// src/auth/PublicRoute.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  // waiting...
  if (session === undefined) return <div>Loading...</div>;

  // if logged in → redirect to dashboard
  if (session) return <Navigate to="/dashboard" replace />;

  return children;
}
