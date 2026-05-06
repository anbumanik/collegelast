"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Image as ImageIcon } from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

interface BirthdayContent {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  description: string;
  createdAt: number;
}

export default function Birthday() {
  const [content, setContent] = useState<BirthdayContent[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<{url: string, type: string} | null>(null);

  useEffect(() => {
    const birthdayRef = ref(rtdb, 'birthday_videos');
    const unsubscribe = onValue(birthdayRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        items.sort((a, b) => b.createdAt - a.createdAt);
        setContent(items);
      } else {
        setContent([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="section-padding overflow-hidden bg-black" id="birthday">
      <div className="container mx-auto relative">
        <div className="flex flex-col items-center mb-24">
          <h2 className="text-4xl md:text-6xl font-royal font-bold mb-4 text-center">Birthday <span className="royal-text">Celebrations</span></h2>
          <p className="text-white/60 text-center max-w-2xl font-serif italic tracking-wide">A royal journey through our most memorable celebrations, captured in moments and stories.</p>
        </div>

        {/* Timeline Center Line */}
        <div className="absolute left-1/2 top-[200px] bottom-0 w-px bg-gradient-to-b from-royal-gold/50 via-royal-gold-dark/30 to-transparent hidden md:block" />

        <div className="space-y-32 relative">
          {content.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}
              >
                {/* Media Side */}
                <div className="w-full md:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/5 hover:border-royal-gold/30 transition-colors"
                    onClick={() => setSelectedMedia({ url: item.url, type: item.type || 'video' })}
                  >
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000&auto=format&fit=crop";
                          target.className = "w-full h-full object-cover opacity-20 grayscale";
                        }}
                      />
                    ) : (
                      <>
                        <video src={item.url} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                          <div className="w-16 h-16 bg-royal-gold/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-royal-gold/40 group-hover:scale-110 group-hover:bg-royal-gold transition-all duration-500">
                            <Play size={32} fill="white" className="text-white ml-1 group-hover:fill-black group-hover:text-black transition-colors" />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-6 left-8">
                       <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-[0.3em] text-royal-gold border border-royal-gold/20 flex items-center gap-2">
                         {item.type === 'image' ? <ImageIcon size={12} /> : <Play size={12} />}
                         {item.type === 'image' ? 'Photograph' : 'Video Memory'}
                       </span>
                    </div>
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : 'md:text-left'} space-y-6`}>
                  <h3 className="text-3xl md:text-5xl font-royal font-bold text-white tracking-tight">{item.name}</h3>
                  <div className={`w-24 h-[1px] bg-gradient-to-r from-royal-gold to-transparent ${isEven ? 'ml-auto bg-gradient-to-l' : 'mr-auto'}`} />
                  <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-serif italic">
                    &quot;{item.description}&quot;
                  </p>
                </div>

                {/* Center Node (Dot on line) */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-royal-gold rounded-full hidden md:block shadow-[0_0_20px_rgba(212,175,55,0.8)] border-2 border-black">
                  <div className="absolute inset-0 bg-royal-gold-light rounded-full animate-ping opacity-40" />
                </div>
              </motion.div>
            );
          })}
          
          {content.length === 0 && (
            <div className="text-center py-20 border border-dashed border-royal-gold/20 rounded-[3rem] bg-white/5">
              <p className="text-royal-gold/30 uppercase tracking-[0.3em] text-xs font-royal">Waiting for your favorite memories...</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/98 backdrop-blur-3xl"
            onClick={() => setSelectedMedia(null)}
          >
            <button className="absolute top-8 right-8 text-royal-gold/50 hover:text-royal-gold transition-colors">
              <X size={40} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-6xl w-full max-h-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'image' ? (
                <img 
                  src={selectedMedia.url} 
                  className="w-full h-full object-contain bg-black/50" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000&auto=format&fit=crop";
                    target.className = "w-full h-full object-contain opacity-40";
                  }}
                />
              ) : (
                <video src={selectedMedia.url} controls autoPlay className="w-full h-full bg-black" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
