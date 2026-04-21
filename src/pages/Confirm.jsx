// src/pages/Confirm.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Confirm() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirm = async () => {
      const hash = window.location.hash;

      if (!hash) {
        navigate("/login");
        return;
      }

      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (!error) {
          navigate("/dashboard-home");
        } else {
          console.error("Email confirmation error:", error.message);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleEmailConfirm();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <div className="text-center">
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-gray-700">Confirming your email...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}
