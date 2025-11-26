// src/components/Footer.jsx
import React from "react";
import { Brain, Linkedin, Github, Twitter, Mail, Clock } from "../assets/icons";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Login", href: "#" },
  ];

  const socialLinks = [
    { icon: <Linkedin size={20} />, href: "#", name: "LinkedIn" },
    { icon: <Github size={20} />, href: "#", name: "GitHub" },
    { icon: <Twitter size={20} />, href: "#", name: "Twitter" },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      {/* 🔥 SAME CORNER SPACING */}
      <div className="container max-w-7xl py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Brain size={24} />
              </div>
              <span className="text-xl font-bold text-white">IntelliLearn</span>
            </a>

            <p className="text-gray-400 max-w-md mb-6">
              AI-based platform for smarter exam preparation. Upload your study materials, ask questions, and get instant, cited answers powered by advanced RAG technology.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="text-gray-400 hover:text-white bg-gray-800 p-3 rounded-full transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((ql) => (
                <li key={ql.name}>
                  <a
                    href={ql.href}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {ql.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-400" />
                <a
                  href="mailto:support@intellilearn.com"
                  className="hover:text-white"
                >
                  support@intellilearn.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Clock size={20} className="text-blue-400 mt-1" />
                <span>
                  Available Monday - Friday
                  <br />
                  9:00 AM - 6:00 PM EST
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950/50 py-6">
        <div className="container max-w-7xl px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} IntelliLearn. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
