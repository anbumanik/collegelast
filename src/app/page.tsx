"use client";
import { useState } from "react";
import Hero from "@/components/sections/Hero";
import Members from "@/components/sections/Members";
import Birthday from "@/components/sections/Birthday";
import MediaVault from "@/components/sections/MediaVault";
import TheWall from "@/components/sections/TheWall";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = [
    { name: "Members", href: "#members" },
    { name: "Birthday", href: "#birthday" },
    { name: "Vault", href: "#vault" },
    { name: "The Wall", href: "#wall" },
  ];

  const handleAdmin = () => {
    const password = prompt("Enter Admin Password:");
    if (password === "ANBU") {
      window.location.href = "/admin";
    } else if (password) {
      alert("Incorrect Password!");
    }
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-royal-gold via-royal-gold-light to-royal-gold z-[60] origin-left shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
        style={{ scaleX }} 
      />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center justify-between md:justify-start gap-8 shadow-2xl">
          {/* Logo/Brand for Mobile */}
          <span className="font-royal text-royal-gold font-black tracking-widest text-lg md:hidden">MCA</span>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-white/60 hover:text-royal-gold transition-all tracking-[0.2em] uppercase text-[10px] font-bold"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={handleAdmin}
              className="text-royal-gold/60 hover:text-royal-gold transition-all tracking-[0.2em] uppercase text-[10px] font-bold border-l border-white/10 pl-8 flex items-center gap-2"
            >
              <Shield size={12} />
              Admin
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-royal-gold hover:bg-white/5 rounded-full transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <motion.a 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-royal text-white hover:text-royal-gold transition-colors tracking-[0.3em] uppercase"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  setIsMenuOpen(false);
                  handleAdmin();
                }}
                className="text-xl font-royal text-royal-gold hover:text-royal-gold-light transition-colors tracking-[0.3em] uppercase mt-4 flex items-center gap-3"
              >
                <Shield size={20} />
                Admin
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Hero />
      <Members />
      <Birthday />
      <MediaVault />
      <TheWall />

      <footer className="py-12 border-t border-white/5 text-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-royal-gold to-transparent" />
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-serif">
            © 2026 College Memories. Crafted with Elegance by 
            <a 
              href="https://portfolioan-xi.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-royal-gold hover:text-royal-gold-light font-bold ml-2 transition-colors"
            >
              @a7pixels
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
