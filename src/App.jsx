// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import MainFeatures from "./components/MainFeatures";
import HowItWorks from "./components/HowItWorks";
import Stats from "./components/Stats";
import WhyChooseUs from "./components/WhyChooseUs";
import CTA from "./components/CTA";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";     // <-- ADDED
import UpdatePassword from "./pages/UpdatePassword";     // <-- ADDED

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div className="font-sans antialiased text-gray-900 bg-white m-0 p-0 min-h-screen w-full overflow-x-hidden">
              <Header />
              <main>
                <Hero />
                <MainFeatures />
                <HowItWorks />
                <Stats />
                <WhyChooseUs />
                <Testimonials />
                <FAQ />
                <CTA />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <div className="font-sans antialiased text-gray-900 bg-white m-0 p-0">
              <Login />
            </div>
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            <div className="font-sans antialiased text-gray-900 bg-white m-0 p-0">
              <Signup />
            </div>
          }
        />

        {/* Forgot Password – ADDED */}
        <Route
          path="/forgot-password"
          element={
            <div className="font-sans antialiased text-gray-900 bg-white m-0 p-0">
              <ForgotPassword />
            </div>
          }
        />

        {/* Update Password – ADDED */}
        <Route
          path="/update-password"
          element={
            <div className="font-sans antialiased text-gray-900 bg-white m-0 p-0">
              <UpdatePassword />
            </div>
          }
        />

        {/* Dashboard (no header/footer) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}
