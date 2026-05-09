import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Ensure user came from valid reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        alert("Invalid or expired reset link.");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      console.error("Update error:", error.message);
      alert(error.message);
      return;
    }

    alert("Password updated successfully!");

    // ✅ Redirect after success
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Set New Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}