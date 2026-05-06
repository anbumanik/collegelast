"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MasonryItem {
  id: string | number;
  img: string;
  url?: string;
  height: number;
  name?: string;
}

interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = false,
  colorShiftOnHover = false,
}: MasonryProps) {
  const [columns, setColumns] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(4);
      else if (window.innerWidth >= 768) setColumns(3);
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const gridItems = useMemo(() => {
    const columnHeights = Array(columns).fill(0);
    return items.map((item) => {
      const minHeightColumn = columnHeights.indexOf(Math.min(...columnHeights));
      const x = (minHeightColumn / columns) * 100;
      const y = columnHeights[minHeightColumn];
      columnHeights[minHeightColumn] += item.height;
      return { ...item, x, y, width: 100 / columns };
    });
  }, [items, columns]);

  const height = Math.max(...gridItems.map((i) => i.y + i.height));

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".masonry-item");
    
    const fromVars: gsap.TweenVars = { opacity: 0 };
    switch (animateFrom) {
      case "bottom": fromVars.y = 50; break;
      case "top": fromVars.y = -50; break;
      case "left": fromVars.x = -50; break;
      case "right": fromVars.x = 50; break;
    }

    gsap.fromTo(elements, 
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );
  }, [gridItems, animateFrom, duration, ease, stagger]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height }}
    >
      {gridItems.map((item) => (
        <div
          key={item.id}
          className="masonry-item absolute p-2 md:p-4 transition-all duration-500"
          style={{
            left: `${item.x}%`,
            top: `${item.y}px`,
            width: `${item.width}%`,
          }}
        >
          <div 
            className={`
              relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl group cursor-pointer
              ${blurToFocus ? "blur-sm hover:blur-0" : ""}
              ${colorShiftOnHover ? "grayscale hover:grayscale-0" : ""}
              transition-all duration-700 ease-out
            `}
            style={{ 
              height: item.height - 32,
              transform: scaleOnHover ? `scale(1)` : undefined 
            }}
            onMouseEnter={(e) => {
              if (scaleOnHover) {
                gsap.to(e.currentTarget, { scale: hoverScale, duration: 0.4, ease: "power2.out" });
              }
            }}
            onMouseLeave={(e) => {
              if (scaleOnHover) {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: "power2.in" });
              }
            }}
          >
            <img
              src={item.img}
              alt={item.name || "Gallery Item"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=1000&auto=format&fit=crop"; 
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              <p className="text-royal-gold font-royal text-lg uppercase tracking-wider translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {item.name || "Untitled"}
              </p>
              <div className="h-0.5 w-0 group-hover:w-full bg-royal-gold transition-all duration-500 delay-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
