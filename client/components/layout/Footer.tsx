import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-16">
      <div className="container max-w-full px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-black text-white text-lg">Decomposr</h3>
            </div>
            <p className="text-sm text-white/60">
              AI-powered project decomposition for modern software teams.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-white/60 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white">Documentation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8">
          <p className="text-sm text-white/40 text-center">
            © 2026 Decomposr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
