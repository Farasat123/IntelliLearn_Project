// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Brain, Menu, X } from "../assets/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("/");
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "features" },
    { name: "About", href: "about" },
    { name: "Contact", href: "contact" },
  ];

  // Scroll to section and update active
  const handleNavClick = (href) => {
    if (href === "/") {
      navigate("/");
      setActiveSection("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(href);
        navigate("/"); // Keep URL clean
      }
    }
    setIsMobileMenuOpen(false); // close mobile menu
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.filter((l) => l.href !== "/");
      let current = "/";
      for (let s of sections) {
        const el = document.getElementById(s.href);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 80) current = s.href;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-20 bg-white/85 backdrop-blur-md shadow-sm border-b border-blue-50">
      <nav className="container max-w-7xl mx-auto px-4 flex justify-between items-center py-4">

        {/* Logo */}
        <div
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-2 rounded-lg shadow-inner shadow-blue-900/20">
            <Brain size={22} />
          </div>
          <span className="text-xl font-bold text-gray-900">IntelliLearn</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l.name}
              onClick={() => handleNavClick(l.href)}
              className={`group relative px-1 pb-1 font-medium transition-colors ${
                activeSection === l.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span className="relative z-10">{l.name}</span>
              <span
                className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-opacity duration-300 ${
                  activeSection === l.href ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                }`}
              />
              <span className="absolute inset-0 rounded-lg bg-blue-50/0 transition duration-300 group-hover:bg-blue-50/80" aria-hidden="true" />
            </button>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className={`relative px-4 py-2 rounded-lg font-semibold transition-all ${
              location.pathname === "/login"
                ? "text-blue-700 bg-blue-50"
                : "text-gray-600 hover:text-blue-700 hover:bg-blue-50/90"
            }`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className={`relative px-5 py-2 rounded-xl font-semibold shadow transition-all overflow-hidden ${
              location.pathname === "/signup"
                ? "bg-blue-700 text-white shadow-blue-500/40"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
            }`}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" aria-hidden="true" />
            <span className="relative">Sign Up</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-900"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl w-full border-t border-blue-100">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((l) => (
              <button
                key={l.name}
                onClick={() => handleNavClick(l.href)}
                className={`text-lg transition ${
                  activeSection === l.href
                    ? "text-blue-600 font-bold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {l.name}
              </button>
            ))}

            <hr className="border-gray-200" />

            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg ${
                location.pathname === "/login" ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-5 py-3 rounded-xl text-center font-semibold transition ${
                location.pathname === "/signup"
                  ? "bg-blue-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg"
              }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
