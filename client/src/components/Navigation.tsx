import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Menu, X, Code2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const isHomePage = location === "/" || location === "";

  const navItems = isHomePage ? [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#education", label: "Education" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ] : [];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-2xl tracking-tighter text-primary">CHAELVIN</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" onClick={(e) => handleNavClick(e, "#hero")} className="text-sm font-semibold transition-colors hover:text-primary text-muted-foreground">Home</a>
            <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="text-sm font-semibold transition-colors hover:text-primary text-muted-foreground">About</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="text-sm font-semibold transition-colors hover:text-primary text-muted-foreground">Contact</a>
            {user ? (
              <Link 
                href="/admin" 
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
                data-testid="nav-admin"
              >
                Admin
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="px-5 py-2 rounded-full border-2 border-primary/20 text-primary text-sm font-bold hover:bg-primary/5 transition-all hover:scale-105 active:scale-95"
                data-testid="nav-login"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a 
                  key={item.href} 
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
              {user ? (
                <Link 
                  href="/admin"
                  className="block w-full text-center mt-4 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <a 
                  href="/api/login" 
                  className="block w-full text-center mt-4 px-4 py-3 rounded-lg border border-border font-medium"
                >
                  Login
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
