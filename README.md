# 📈 Zerodha Kite Clone — Full-Stack MERN Trading Platform

A modern, responsive clone of Zerodha's Kite trading platform built on a decoupled multi-service architecture with real-time portfolio reconciliation, order lifecycle simulation, and JWT authentication.

---

## 🌐 Live Deployments

| Component | URL | Description |
| :--- | :--- | :--- |
| **Trading Terminal** | [Live Dashboard](https://zerodha-kite-dashboard-fca1.onrender.com) | Main trading dashboard with live charts, order books, and positions |
| **Client Portal** | [Landing Page](https://zerodha-kite-frontend.onrender.com) | Public marketing, pricing, and account registration portal |
| **Backend API** | [API Health Endpoint](https://zerodha-kite-backend.onrender.com) | REST API services for transactions and authentication |

> **Quick Demo Access**:
> - **Email**: `hellow12@gmail.com`
> - **Password**: `demoPassword123`
> *(Or register a new trading profile directly via the Sign Up form)*

---

## 🛠️ System Architecture

```text
 ┌──────────────────────┐        ┌──────────────────────┐
 │ Client Portal (React)│        │  Trading Dashboard   │
 │   zerodha-frontend   │        │   zerodha-dashboard  │
 └──────────┬───────────┘        └──────────┬───────────┘
            │                               │
            └───────────────┬───────────────┘
                            │ HTTPS / REST (CORS Whitelisted)
                            ▼
              ┌───────────────────────────┐
              │    Node.js / Express      │
              │   zerodha-kite-backend    │
              └─────────────┬─────────────┘
                            │ Mongoose ODM
                            ▼
              ┌───────────────────────────┐
              │    MongoDB Atlas Cluster  │
              └───────────────────────────┘
