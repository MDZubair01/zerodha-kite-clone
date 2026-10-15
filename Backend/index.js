require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const verifyToken = require("./middleware/authMiddleware");
const { HoldingsModel } = require("./model/HoldingModel");
const { PositionsModel } = require("./model/PositionModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.TOKEN_KEY || "zerodha_clone_secret_key_123";

const app = express();

// 1. CORS MUST be registered before any routes
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// Token Generator Helper
const createSecretToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60, // 3 days
  });
};

// Root Status Check
app.get("/", (req, res) => {
  res.send("<h1>Zerodha Clone Backend API is Running on Port 3002</h1>");
});

// ------------------- AUTH ROUTES -------------------

// 1. Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isAdminUser = email === "admin@zerodha.com";

    const user = new UserModel({
      email,
      password: hashedPassword,
      username,
      isAdmin: isAdminUser,
      isOnline: true,
      lastLogin: new Date(),
      funds: {
        availableCash: 100000,
        usedMargin: 0,
      },
    });

    await user.save();

    const token = createSecretToken(user._id);

    return res.status(201).json({
      message: "User signed up successfully",
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Signup Route Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
});

// 2. Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }

    user.isOnline = true;
    user.lastLogin = new Date();
    if (!user.funds) {
      user.funds = { availableCash: 100000, usedMargin: 0 };
    }
    await user.save();

    const token = createSecretToken(user._id);

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || user.email === "admin@zerodha.com",
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 3. Logout Route
app.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required to log out" });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { isOnline: false, lastLogout: new Date() },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout: " + error.message });
  }
});

// 4. View User Sessions (ADMIN ONLY)
app.get("/userSessions", verifyToken, async (req, res) => {
  try {
    const requestingUser = await UserModel.findById(req.user.id);
    if (!requestingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAdmin = requestingUser.isAdmin || requestingUser.email === "admin@zerodha.com";
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Administrator privileges required.",
      });
    }

    const users = await UserModel.find(
      {},
      "username email isAdmin isOnline lastLogin lastLogout"
    ).lean();

    res.status(200).json(users);
  } catch (error) {
    console.error("Session fetch error:", error);
    res.status(500).json({ message: "Error fetching sessions: " + error.message });
  }
});

// 5. Force End Session (ADMIN ONLY)
app.post("/terminateSession/:id", verifyToken, async (req, res) => {
  try {
    const requestingUser = await UserModel.findById(req.user.id);
    const isAdmin = requestingUser?.isAdmin || requestingUser?.email === "admin@zerodha.com";

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    const { id } = req.params;
    await UserModel.findByIdAndUpdate(id, {
      isOnline: false,
      lastLogout: new Date(),
    });
    res.status(200).json({ success: true, message: "Session ended successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error ending session: " + error.message });
  }
});

// 6. Check Active Session Heartbeat
app.get("/checkSession", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("isOnline");
    if (!user || !user.isOnline) {
      return res.status(401).json({
        active: false,
        message: "Your session has been terminated by an administrator.",
      });
    }
    return res.status(200).json({ active: true });
  } catch (error) {
    return res.status(500).json({ message: "Error checking session status" });
  }
});

// ------------------- MARKET DATA & USER HOLDINGS -------------------

// User-Isolated Holdings
app.get("/allHoldings", verifyToken, async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({ userId: req.user.id });
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching holdings: " + error.message });
  }
});

// ------------------- POSITIONS ROUTES -------------------

// Fetch open market positions (User-isolated with global fallback)
app.get("/allPositions", verifyToken, async (req, res) => {
  try {
    let positions = await PositionsModel.find({ userId: req.user.id });
    if (!positions || positions.length === 0) {
      positions = await PositionsModel.find({ userId: { $exists: false } });
    }
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching positions: " + error.message });
  }
});

// Square off (close) an open position
app.post("/squareOffPosition/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const position = await PositionsModel.findById(id);

    if (!position) {
      return res.status(404).json({ message: "Position not found." });
    }

    const user = await UserModel.findById(req.user.id);
    const proceeds = Number((position.qty * position.price).toFixed(2));

    if (user && user.funds) {
      user.funds.availableCash = Number((user.funds.availableCash + proceeds).toFixed(2));
      user.markModified("funds");
      await user.save();
    }

    const closeOrder = new OrdersModel({
      userId: req.user.id,
      name: position.name,
      qty: position.qty,
      price: position.price,
      mode: "SELL",
    });
    await closeOrder.save();

    await PositionsModel.findByIdAndDelete(id);

    res.status(200).json({
      message: `Squared off ${position.name} successfully!`,
      closedOrder: closeOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error squaring off position: " + error.message });
  }
});

// ------------------- FUNDS & MARGIN ROUTES -------------------

// 1. Get User Funds
app.get("/userFunds", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.funds || typeof user.funds.availableCash !== "number") {
      user.funds = { availableCash: 100000, usedMargin: 0 };
      user.markModified("funds");
      await user.save();
    }

    res.json(user.funds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching funds: " + error.message });
  }
});

// 2. Add Demo Funds (UPI Deposit)
app.post("/addFunds", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const depositAmount = Number(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.funds || typeof user.funds.availableCash !== "number") {
      user.funds = { availableCash: 100000, usedMargin: 0 };
    }

    user.funds.availableCash += depositAmount;
    user.markModified("funds");
    await user.save();

    res.json({ message: "Funds added successfully!", funds: user.funds });
  } catch (error) {
    res.status(500).json({ message: "Error adding funds: " + error.message });
  }
});

// 3. Withdraw Funds Route
app.post("/withdrawFunds", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const withdrawAmount = Number(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.funds || typeof user.funds.availableCash !== "number") {
      user.funds = { availableCash: 100000, usedMargin: 0 };
    }

    if (user.funds.availableCash < withdrawAmount) {
      return res.status(400).json({
        message: `Insufficient available cash. You can only withdraw up to ₹${user.funds.availableCash.toFixed(2)}.`,
      });
    }

    user.funds.availableCash -= withdrawAmount;
    user.markModified("funds");
    await user.save();

    res.json({ message: "Withdrawal completed successfully!", funds: user.funds });
  } catch (error) {
    res.status(500).json({ message: "Error processing withdrawal: " + error.message });
  }
});

// ------------------- STRICT PROTECTED ORDER ROUTES -------------------

// User-Isolated Orders History
app.get("/allOrders", verifyToken, async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({ userId: req.user.id });
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders: " + error.message });
  }
});

// Cancel Order & Reconcile Funds and Holdings
app.delete("/cancelOrder/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const orderToCancel = await OrdersModel.findOne({ _id: id, userId: req.user.id });
    if (!orderToCancel) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    const { name, qty, price, mode } = orderToCancel;
    const orderCost = Number((qty * price).toFixed(2));

    const user = await UserModel.findById(req.user.id);
    let existingHolding = await HoldingsModel.findOne({ userId: req.user.id, name });

    if (mode === "BUY") {
      if (user && user.funds) {
        user.funds.availableCash = Number((user.funds.availableCash + orderCost).toFixed(2));
        user.funds.usedMargin = Number(Math.max(0, (user.funds.usedMargin || 0) - orderCost).toFixed(2));
        user.markModified("funds");
        await user.save();
      }

      if (existingHolding) {
        if (existingHolding.qty <= qty) {
          await HoldingsModel.findByIdAndDelete(existingHolding._id);
        } else {
          const remainingQty = existingHolding.qty - qty;
          const remainingCost = existingHolding.qty * existingHolding.avg - orderCost;
          existingHolding.qty = remainingQty;
          existingHolding.avg = Number((remainingCost / remainingQty).toFixed(2));
          await existingHolding.save();
        }
      }
    } else if (mode === "SELL") {
      if (user && user.funds) {
        user.funds.availableCash = Number(Math.max(0, user.funds.availableCash - orderCost).toFixed(2));
        user.markModified("funds");
        await user.save();
      }

      if (existingHolding) {
        existingHolding.qty += qty;
        await existingHolding.save();
      } else {
        const restoredHolding = new HoldingsModel({
          userId: req.user.id,
          name,
          qty,
          avg: price,
          price,
          net: "+0.00%",
          day: "+0.00%",
        });
        await restoredHolding.save();
      }
    }

    await OrdersModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Order cancelled and portfolio/funds reconciled successfully!",
      cancelledOrderId: id,
    });
  } catch (error) {
    console.error("Cancellation error:", error);
    res.status(500).json({ message: "Error cancelling order: " + error.message });
  }
});

// Place Order & Execute directly into User Holdings & Funds
app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const numQty = Number(qty);
    const numPrice = Number(price);

    if (isNaN(numQty) || numQty <= 0 || isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ message: "Invalid quantity or price" });
    }

    const orderCost = Number((numQty * numPrice).toFixed(2));

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.funds || typeof user.funds.availableCash !== "number") {
      user.funds = { availableCash: 100000, usedMargin: 0 };
    }

    if (mode === "BUY") {
      if (user.funds.availableCash < orderCost) {
        return res.status(400).json({
          message: `Insufficient balance! Order cost is ₹${orderCost.toLocaleString("en-IN")}, but you only have ₹${user.funds.availableCash.toLocaleString("en-IN")} available.`,
        });
      }

      user.funds.availableCash = Number((user.funds.availableCash - orderCost).toFixed(2));
      user.funds.usedMargin = Number(((user.funds.usedMargin || 0) + orderCost).toFixed(2));
      user.markModified("funds");
      await user.save();
    }

    let existingHolding = await HoldingsModel.findOne({
      userId: req.user.id,
      name,
    });

    if (mode === "BUY") {
      if (existingHolding) {
        const currentTotalCost = existingHolding.qty * existingHolding.avg;
        const newCost = numQty * numPrice;
        const combinedQty = existingHolding.qty + numQty;
        const newAvg = (currentTotalCost + newCost) / combinedQty;

        existingHolding.qty = combinedQty;
        existingHolding.avg = Number(newAvg.toFixed(2));
        existingHolding.price = numPrice;
        await existingHolding.save();
      } else {
        const newHolding = new HoldingsModel({
          userId: req.user.id,
          name,
          qty: numQty,
          avg: numPrice,
          price: numPrice,
          net: "+0.00%",
          day: "+0.00%",
        });
        await newHolding.save();
      }
    } else if (mode === "SELL") {
      if (!existingHolding || existingHolding.qty < numQty) {
        return res.status(400).json({
          message: "Insufficient holdings quantity to execute sell order.",
        });
      }

      user.funds.availableCash = Number((user.funds.availableCash + orderCost).toFixed(2));
      user.funds.usedMargin = Number(Math.max(0, (user.funds.usedMargin || 0) - orderCost).toFixed(2));
      user.markModified("funds");
      await user.save();

      if (existingHolding.qty === numQty) {
        await HoldingsModel.findByIdAndDelete(existingHolding._id);
      } else {
        existingHolding.qty -= numQty;
        existingHolding.price = numPrice;
        await existingHolding.save();
      }
    }

    const newOrder = new OrdersModel({
      userId: req.user.id,
      name,
      qty: numQty,
      price: numPrice,
      mode,
    });
    await newOrder.save();

    return res.status(201).json({
      message: "Order executed & funds updated!",
      order: newOrder,
      funds: user.funds,
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return res.status(500).json({ message: "Error processing trade: " + error.message });
  }
});

// ------------------- DEVELOPER APPS & API KEY ROUTES -------------------

// 1. Get User API Key details
app.get("/userApiKey", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("apiKey apiSecret");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      apiKey: user.apiKey || null,
      apiSecret: user.apiSecret || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching API keys: " + error.message });
  }
});

// 2. Generate or Regenerate API Key
app.post("/generateApiKey", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newKey = "kite_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);

    user.apiKey = newKey;
    user.apiSecret = newSecret;
    await user.save();

    res.json({
      message: "API credentials generated successfully!",
      apiKey: newKey,
      apiSecret: newSecret,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating API key: " + error.message });
  }
});

// 3. Revoke API Key
app.post("/revokeApiKey", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.apiKey = null;
    user.apiSecret = null;
    await user.save();

    res.json({ message: "API key revoked successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error revoking API key: " + error.message });
  }
});

// Claim Legacy Holdings
app.post("/claimOldHoldings", verifyToken, async (req, res) => {
  try {
    const updated = await HoldingsModel.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: req.user.id } }
    );
    res.json({ message: "Claimed legacy holdings successfully!", count: updated.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- SERVER START -------------------

const startServer = async () => {
  try {
    await mongoose.connect(uri);
    console.log("DB Connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started and listening on http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error("DB Connection error:", err);
    process.exit(1);
  }
};

startServer();