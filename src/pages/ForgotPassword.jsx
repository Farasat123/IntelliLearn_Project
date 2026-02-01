import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Recover Password</h2>

        {sent ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              A reset link has been sent to your email.
            </p>

            {/* Redirect Button */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 border rounded"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
              Send Reset Email
            </button>
          </>
        )}
      </form>
    </div>
  );
}
