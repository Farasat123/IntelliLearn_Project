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
    <header className="fixed top-0 left-0 w-full z-20 bg-white/80 backdrop-blur-sm shadow-sm">
      <nav className="container max-w-7xl mx-auto px-4 flex justify-between items-center py-4">

        {/* Logo */}
        <div
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-blue-600 text-white p-2 rounded-lg">
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
              className={`pb-1 transition-colors ${
                activeSection === l.href
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className={`transition ${
              location.pathname === "/login" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className={`px-5 py-2 rounded-lg font-semibold shadow transition-all ${
              location.pathname === "/signup"
                ? "bg-blue-800 text-white"
                : "bg-blue-600 text-white hover:bg-blue-800"
            }`}
          >
            Sign Up
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
        <div className="md:hidden bg-white shadow-xl w-full">
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
              className={`px-5 py-3 rounded-lg text-center font-semibold transition ${
                location.pathname === "/signup"
                  ? "bg-blue-800 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
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
