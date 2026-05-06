"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, push, set } from "firebase/database";

import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] });

import SplashCursor from "../ui/SplashCursor";


interface Note {
  id: string;
  text: string;
  author: string;
  createdAt: number;
  reactions: {
    heart: number;
    like: number;
    smile: number;
    hug: number;
    kiss: number;
  };
}

export default function TheWall() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isWallOpen, setIsWallOpen] = useState(true);

  useEffect(() => {
    // Fetch wall status
    const statusRef = ref(rtdb, 'wall_settings/status');
    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      setIsWallOpen(snapshot.val() !== 'closed');
    });

    const wallRef = ref(rtdb, 'the_wall');
    const unsubscribeNotes = onValue(wallRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        items.sort((a, b) => b.createdAt - a.createdAt);
        setNotes(items);
      } else {
        setNotes([]);
      }
    });
    return () => {
      unsubscribeStatus();
      unsubscribeNotes();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !isWallOpen || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const newRef = push(ref(rtdb, 'the_wall'));
      await set(newRef, {
        text: newNote,
        author: author || "Anonymous",
        createdAt: Date.now(),
        reactions: {
          heart: 0,
          like: 0,
          smile: 0,
          hug: 0,
          kiss: 0
        }
      });
      setNewNote("");
      setAuthor("");
    } catch (error) {
      console.error("Failed to add note", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (noteId: string, reactionType: string) => {
    try {
      const reactionRef = ref(rtdb, `the_wall/${noteId}/reactions/${reactionType}`);
      onValue(reactionRef, (snapshot) => {
        const currentCount = snapshot.val() || 0;
        set(reactionRef, currentCount + 1);
      }, { onlyOnce: true });
    } catch (error) {
      console.error("Failed to react", error);
    }
  };

  return (
    <section className="section-padding bg-black relative overflow-hidden" id="wall">
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

      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-royal font-bold mb-4">The <span className="royal-text">Wall</span></h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-royal-gold to-transparent rounded-full mb-6" />
          <p className="text-white/60 font-serif italic tracking-widest uppercase text-xs">Leave a royal message for the future.</p>
        </div>

        <div className="max-w-xl mx-auto mb-20">
          {isWallOpen ? (
            <form onSubmit={handleSubmit} className="glass p-8 rounded-[2rem] space-y-4 border border-white/5 bg-white/[0.02]">
              <textarea
                placeholder="What's on your mind?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-royal-gold/50 transition-colors h-32 resize-none text-white placeholder:text-white/20 font-serif"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-royal-gold/50 transition-colors text-white placeholder:text-white/20 font-serif"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-royal-gold to-royal-gold-dark text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 px-8 py-2 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-royal-gold/20 uppercase text-xs tracking-widest"
                >
                  <Send size={18} />
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          ) : (
            <div className="glass p-12 rounded-[3rem] border-2 border-red-500/20 bg-red-500/5 text-center flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <span className="text-3xl">🔒</span>
               </div>
               <div>
                  <h3 className="text-xl font-royal font-bold text-white mb-2 uppercase tracking-widest">The Wall is Sealed</h3>
                  <p className="text-white/40 text-sm italic font-serif">Administrators have temporarily closed the wall for new entries.</p>
               </div>
            </div>
          )}
        </div>

        <div className="relative group py-8 overflow-hidden">
          {/* Manual Navigation Buttons */}
          <button 
            onClick={() => {
              const marquee = document.querySelector('.marquee-content');
              if (marquee) (marquee as HTMLElement).style.animationPlayState = 'paused';
              const scrollContainer = document.querySelector('.wall-container');
              if (scrollContainer) scrollContainer.scrollBy({ left: -400, behavior: 'smooth' });
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-royal-gold/30 flex items-center justify-center text-royal-gold hover:bg-royal-gold hover:text-black transition-all z-20 shadow-2xl group/btn"
          >
            <span className="text-2xl group-hover/btn:-translate-x-1 transition-transform">←</span>
          </button>
          
          <button 
            onClick={() => {
              const marquee = document.querySelector('.marquee-content');
              if (marquee) (marquee as HTMLElement).style.animationPlayState = 'paused';
              const scrollContainer = document.querySelector('.wall-container');
              if (scrollContainer) scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-royal-gold/30 flex items-center justify-center text-royal-gold hover:bg-royal-gold hover:text-black transition-all z-20 shadow-2xl group/btn"
          >
            <span className="text-2xl group-hover/btn:translate-x-1 transition-transform">→</span>
          </button>

          <div className="wall-container overflow-x-auto hide-scrollbar">
            <div 
              className="flex gap-8 w-max marquee-content"
              style={{
                animation: 'marquee 60s linear infinite',
              }}
            >
              <style jsx>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .marquee-content:hover {
                  animation-play-state: paused !important;
                }
                .marquee-content:active {
                  animation-play-state: paused !important;
                }
              `}</style>
              
              {/* Duplicate notes once for seamless loop */}
              {[...notes, ...notes].map((note, index) => (
                <motion.div
                  key={`${note.id}-${index}`}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 10, y: -10 }}
                  whileTap={{ scale: 0.95, rotate: 0 }}
                  className={`flex-shrink-0 w-[280px] md:w-[320px] p-6 rounded-sm shadow-2xl relative min-h-[300px] flex flex-col justify-between bg-[#fffef0] text-gray-800 ${caveat.className}`}
                  style={{ 
                    boxShadow: "5px 10px 30px rgba(0,0,0,0.8), inset 0 0 40px rgba(212,175,55,0.05)",
                    borderBottomRightRadius: "40px 10px",
                    rotate: `${(note.id.charCodeAt(0) % 6) - 3}deg`
                  }}
                >
                  {/* Tape Graphic */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-royal-gold/20 backdrop-blur-sm border border-royal-gold/10 -rotate-2 shadow-sm" />
                  
                  <p className="text-2xl leading-tight mb-4 font-bold flex-1 text-black/80">{note.text}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 border-t border-royal-gold/10 pt-3">
                    <button onClick={() => handleReaction(note.id, 'heart')} className="flex items-center gap-1 bg-black/5 hover:bg-red-50 px-2 py-1 rounded-full transition-colors text-sm">
                      <span>❤️</span> <span className="font-sans font-bold text-[9px]">{note.reactions?.heart || 0}</span>
                    </button>
                    <button onClick={() => handleReaction(note.id, 'like')} className="flex items-center gap-1 bg-black/5 hover:bg-blue-50 px-2 py-1 rounded-full transition-colors text-sm">
                      <span>👍</span> <span className="font-sans font-bold text-[9px]">{note.reactions?.like || 0}</span>
                    </button>
                    <button onClick={() => handleReaction(note.id, 'smile')} className="flex items-center gap-1 bg-black/5 hover:bg-yellow-50 px-2 py-1 rounded-full transition-colors text-sm">
                      <span>😊</span> <span className="font-sans font-bold text-[9px]">{note.reactions?.smile || 0}</span>
                    </button>
                  </div>

                  <div className="text-right border-t border-royal-gold/5 pt-2">
                    <p className="text-xl font-bold text-royal-gold-dark font-royal">- {note.author}</p>
                    <p className="text-[9px] opacity-40 mt-1 font-sans tracking-[0.2em] uppercase">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
