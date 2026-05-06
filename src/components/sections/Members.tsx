"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { ChevronDown, ChevronUp } from "lucide-react";
import SplashCursor from "../ui/SplashCursor";


interface Member {
  id: string;
  name: string;
  rollNumber: string;
  gender: 'boy' | 'girl';
  image: string;
}

export default function Members() {
  const [filter, setFilter] = useState<'all' | 'boy' | 'girl'>('all');
  const [membersData, setMembersData] = useState<Member[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const membersRef = ref(rtdb, 'members');
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        // Sort by Roll Number (01, 02, etc.)
        items.sort((a, b) => {
          const numA = parseInt(a.rollNumber) || 999;
          const numB = parseInt(b.rollNumber) || 999;
          return numA - numB;
        });
        setMembersData(items);
      } else {
        setMembersData([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredMembers = membersData.filter(
    (member) => filter === 'all' || member.gender === filter
  );

  const displayedMembers = isExpanded ? filteredMembers : filteredMembers.slice(0, 4);

  return (
    <section className="section-padding bg-black relative overflow-hidden" id="members">
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-4xl md:text-5xl font-royal font-bold mb-4">Our <span className="royal-text">Members</span></h2>
            <div className="h-1 w-24 bg-gradient-to-r from-royal-gold via-royal-gold-light to-transparent rounded-full mb-8 md:mb-0" />
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
            <div className="flex bg-white/5 p-1 rounded-full backdrop-blur-md border border-white/10">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${filter === 'all' ? 'bg-gradient-to-r from-royal-gold to-royal-gold-dark text-black shadow-lg shadow-royal-gold/20' : 'text-white/50 hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('boy')} 
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${filter === 'boy' ? 'bg-gradient-to-r from-royal-gold to-royal-gold-dark text-black shadow-lg shadow-royal-gold/20' : 'text-white/50 hover:text-white'}`}
              >
                Boys
              </button>
              <button 
                onClick={() => setFilter('girl')} 
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${filter === 'girl' ? 'bg-gradient-to-r from-royal-gold to-royal-gold-dark text-black shadow-lg shadow-royal-gold/20' : 'text-white/50 hover:text-white'}`}
              >
                Girls
              </button>
            </div>

            {filteredMembers.length > 4 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all font-bold text-[10px] uppercase tracking-widest group"
              >
                {isExpanded ? (
                  <>
                    Minimize <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform text-royal-gold" />
                  </>
                ) : (
                  <>
                    View All <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-royal-gold" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedMembers.map((member) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                className="rounded-3xl overflow-hidden group relative aspect-[3/4] shadow-2xl cursor-pointer border border-white/5 hover:border-royal-gold/30 transition-colors"
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-700" />
                
                {member.image.includes('placeholder') || member.image === "" ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/20 via-black to-black group-hover:from-royal-gold/40 transition-all duration-700 flex items-center justify-center">
                    <span className="text-9xl font-royal font-black text-white/5 group-hover:text-white/10 transition-colors uppercase">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"; // Male placeholder as example
                      target.className = "absolute inset-0 w-full h-full object-cover grayscale opacity-20";
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover:justify-end group-hover:items-start group-hover:text-left transition-all duration-700">
                  <div className="flex flex-col gap-2 transform group-hover:scale-95 origin-bottom-left transition-transform duration-500">
                    {member.rollNumber && (
                      <span className="text-[10px] text-royal-gold font-serif italic tracking-[0.3em] uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">#{member.rollNumber}</span>
                    )}
                    <h3 className="text-3xl md:text-4xl font-royal font-black text-white tracking-wider uppercase leading-none break-words">
                      {member.name}
                    </h3>
                  </div>
                  <span className={`mt-4 text-[9px] uppercase tracking-[0.3em] px-4 py-2 rounded-full backdrop-blur-md font-bold transition-all duration-500 ${member.gender === 'boy' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white' : 'bg-pink-500/10 text-pink-300 border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-white'}`}>
                    {member.gender}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
