import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container text-center p-5 mb-5">
      <h1 className="mt-5">404 Not Found</h1>
      <p className="text-muted mt-3">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;