"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import SplashCursor from "../ui/SplashCursor";


interface HeroImage {
  url: string;
  name?: string;
}

export default function Hero() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const heroRef = ref(rtdb, 'hero_images');
    onValue(heroRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setImages(Object.values(data));
      }
    });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#050505]">
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#A855F7"
      />

      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {images.length > 0 ? (
            <motion.img
              key={index}
              src={images[index]?.url}
              alt={images[index]?.name || "Hero Background"}
              initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              animate={{ opacity: 0.5, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-40 grayscale"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-slowly-drifting-4663-large.mp4" type="video/mp4" />
            </video>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center min-h-screen pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.4,
                delayChildren: 0.5,
              },
            },
          }}
          className="flex flex-col items-center gap-4 md:gap-8"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="flex items-center gap-2 md:gap-4 mb-2"
          >
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-royal-gold" />
            <span className="text-royal-gold font-serif italic tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-base uppercase">Elegance in Every Chapter</span>
            <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-royal-gold" />
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
              }
            }}
            className="text-5xl sm:text-7xl md:text-9xl font-royal font-black tracking-[0.05em] md:tracking-[0.1em] mb-2 royal-text drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          >
            THE END
          </motion.h1>

          <div className="flex flex-col items-center gap-1 md:gap-2">
            <motion.h2
              variants={{
                hidden: { opacity: 0, letterSpacing: "0.1em" },
                visible: { opacity: 1, letterSpacing: "0.2em", transition: { duration: 1.5 } }
              }}
              whileInView={{ letterSpacing: "0.4em" }}
              className="text-lg sm:text-2xl md:text-4xl font-serif text-white tracking-[0.2em] md:tracking-[0.4em] uppercase font-light"
            >
              BATCH-2024-26
            </motion.h2>

            <motion.h3
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 1 } }
              }}
              className="text-4xl sm:text-6xl md:text-8xl font-royal text-royal-gold font-black tracking-[0.1em] md:tracking-[0.3em] mt-2 md:mt-4 drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              MCA
            </motion.h3>
          </div>

          <motion.div
            variants={{
              hidden: { width: 0 },
              visible: { width: "100%", transition: { duration: 1.5, ease: "easeInOut" } }
            }}
            className="h-px w-full max-w-[150px] md:max-w-md bg-gradient-to-r from-transparent via-royal-gold to-transparent my-4 md:my-6 opacity-50"
          />

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1 } }
            }}
            className="space-y-2 md:space-y-4"
          >
            <p className="text-lg sm:text-2xl md:text-4xl text-white/90 font-serif tracking-[0.1em] md:tracking-[0.2em] uppercase font-bold max-w-[300px] md:max-w-3xl mx-auto leading-tight md:leading-relaxed">
              BHARATHIAR UNIVERSITY
              <br />
              <span className="text-xs sm:text-lg md:text-2xl tracking-[0.3em] md:tracking-[0.6em] text-royal-gold font-medium">COIMBATORE</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-8 md:mt-12 hidden sm:flex"
          >
            <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-royal-gold/30 rounded-full flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-1.5 md:h-2 bg-royal-gold rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
