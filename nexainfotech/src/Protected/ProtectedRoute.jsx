import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "./axios";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios.get("/api/admin/check-auth")
      .then(() => setStatus("authenticated"))
      .catch(() => setStatus("unauthenticated"));
  }, []);

  if (status === "loading") {
    return <div className="text-white text-center mt-20">Checking session...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}