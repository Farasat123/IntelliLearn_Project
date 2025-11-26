import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Set New Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-4 border rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white p-3 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
}
