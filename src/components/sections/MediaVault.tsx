"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Film } from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import Masonry from "../ui/Masonry";

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  createdAt: number;
}

export default function MediaVault() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    const vaultRef = ref(rtdb, 'media_vault');
    const unsubscribe = onValue(vaultRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        items.sort((a, b) => b.createdAt - a.createdAt);
        setMedia(items);
      } else {
        setMedia([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const images = media.filter(item => item.type === 'image');
  const videos = media.filter(item => item.type === 'video');

  const masonryItems = images.map((item, index) => ({
    id: item.id,
    img: item.url,
    name: item.name,
    height: [400, 300, 500, 350, 450, 600][index % 6]
  }));

  return (
    <section className="bg-black py-24" id="vault">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-royal font-bold mb-4">Media <span className="royal-text">Vault</span></h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-royal-gold to-transparent rounded-full" />
          <p className="text-white/40 font-serif italic mt-4 uppercase tracking-[0.3em] text-[10px]">A dual collection of our shared journey.</p>
        </div>

        <div className="space-y-32">
          {/* Images Section */}
          <div className="flex flex-col gap-12">
            <div className="flex items-center justify-center gap-3">
              <ImageIcon className="text-royal-gold" size={24} />
              <h3 className="text-2xl font-royal font-bold text-white uppercase tracking-widest">Image Gallery</h3>
            </div>
            
            <div className="w-full min-h-[600px]">
              {masonryItems.length > 0 ? (
                <Masonry
                  items={masonryItems}
                  ease="power3.out"
                  duration={0.6}
                  stagger={0.05}
                  animateFrom="bottom"
                  scaleOnHover
                  hoverScale={0.95}
                  colorShiftOnHover={false}
                />
              ) : (
                <div className="w-full py-20 text-center border border-dashed border-white/5 rounded-[2rem] text-white/20 italic font-serif">
                  No images in the vault
                </div>
              )}
            </div>
          </div>

          {/* Videos Section */}
          <div className="flex flex-col gap-12">
            <div className="flex items-center justify-center gap-3">
              <Film className="text-royal-gold" size={24} />
              <h3 className="text-2xl font-royal font-bold text-white uppercase tracking-widest">Video Archive</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {videos.length > 0 ? (
                videos.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-[4/5] relative group rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl cursor-pointer"
                    onViewportEnter={(entry) => {
                      const video = entry?.target.querySelector('video');
                      if (video) video.play().catch(() => {});
                    }}
                    onViewportLeave={(entry) => {
                      const video = entry?.target.querySelector('video');
                      if (video) video.pause();
                    }}
                  >
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" 
                      muted 
                      loop 
                      playsInline 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6 pointer-events-none">
                      <p className="text-white font-royal text-lg uppercase tracking-wider">{item.name}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[2rem] text-white/20 italic font-serif">
                  No videos in the archive
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
