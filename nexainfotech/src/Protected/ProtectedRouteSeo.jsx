import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "./axios";

const ProtectedRouteSeo = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🛰️ Frontend: Checking SEO session...");
        const response = await axios.get("/api/seo/check-auth");
        console.log("🛰️ Frontend: Auth Response -", response.data);
        if (response.data.authenticated) {
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.log("🛰️ Frontend: Auth Check Failed -", error.response?.status);
        setStatus("unauthenticated");
      }
    };
    checkAuth();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0c0c16]">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/seo/login" />;
  }

  return children;
};

export default ProtectedRouteSeo;
