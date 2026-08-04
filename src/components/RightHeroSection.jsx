import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MusicNotes from '../assets/Music_Notes.mp4';

const avatars = [
  {
    id: 1,
    src: 'https://i.pinimg.com/736x/2a/eb/22/2aeb22b61d027e08931b7996eb20ce65.jpg',
    alt: 'team member 1',
    positionClass: 'top-[12%] right-[10%]',
    floatY: [0, -12, 0],
    duration: 3.5,
  },
  {
    id: 2,
    src: 'https://i.pinimg.com/736x/70/1a/3f/701a3ff2bbd25dd5957f25958a71f4bf.jpg',
    alt: 'team member 2',
    positionClass: 'top-[28%] right-[25%]',
    floatY: [0, -18, 0],
    duration: 4.2,
  },
  {
    id: 3,
    src: 'https://i.pinimg.com/736x/48/ff/d6/48ffd682683f0c4a7a2e40ce8df3705d.jpg',
    alt: 'team member 3',
    positionClass: 'top-[44%] right-[10%]',
    floatY: [0, -10, 0],
    duration: 3.0,
  },
  {
    id: 4,
    src: 'https://i.pinimg.com/736x/4a/4f/4c/4a4f4cfd07de2fbcaaa7ac4a7a6017a3.jpg',
    alt: 'team member 4',
    positionClass: 'top-[60%] right-[28%]',
    floatY: [0, -15, 0],
    duration: 3.8,
  },
  {
    id: 5,
    src: 'https://i.pinimg.com/1200x/57/91/58/579158180b1aa2cd71b281396ccc4560.jpg',
    alt: 'team member 5',
    positionClass: 'top-[75%] right-[8%]',
    floatY: [0, -14, 0],
    duration: 4.0,
  },
];

export default function RightHeroSection() {
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [topZIndex, setTopZIndex] = useState(10);

  const bringToFront = (id) => {
    setActiveId(id);
    setTopZIndex((prev) => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-90 sm:min-h-120 lg:min-h-full rounded-3xl sm:rounded-[28px] overflow-hidden shadow-inner"
    >
      {/* Background Hero */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      >
        <source src={MusicNotes} type="video/mp4" />
      </video>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>

      {/* Floating Draggable Avatars */}
      {avatars.map((avatar) => {
        const isSelected = activeId === avatar.id;

        return (
          <motion.img
            key={avatar.id}
            src={avatar.src}
            alt={avatar.alt}
            drag
            dragConstraints={containerRef}
            dragElastic={0.25}
            dragSnapToOrigin={false}
            onDragStart={() => bringToFront(avatar.id)}
            onHoverStart={() => bringToFront(avatar.id)}
            style={{
              zIndex: isSelected ? topZIndex : 10,
            }}
            animate={{
              y: avatar.floatY,
            }}
            transition={{
              y: {
                duration: avatar.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            whileHover={{ scale: 1.15, cursor: 'grab' }}
            whileTap={{ scale: 0.95, cursor: 'grabbing' }}
            className={`absolute w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-white object-cover shadow-lg select-none touch-none ${avatar.positionClass}`}
          />
        );
      })}

      {/* "Drag Me" Indicator Badge at Bottom Left */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm px-3.5 py-2 rounded-full shadow-lg pointer-events-none select-none"
      >
        {/* Animated Drag Icon */}
        <motion.svg
          animate={{ x: [-3, 3, -3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-4 h-4 text-white/90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.05 4.575a1.5 1.5 0 10-1.95 2.1l2.5 2.525-4.825-1.206a1.5 1.5 0 00-1.802.946 1.5 1.5 0 00.946 1.802l5.131 1.283a3.001 3.001 0 012.222 2.378l.428 2.14a3 3 0 002.942 2.412h.388a3 3 0 002.942-2.412l.428-2.14a3.001 3.001 0 012.222-2.378l2.256-.564a1.5 1.5 0 00.946-1.802 1.5 1.5 0 00-1.802-.946l-2.032.508M15 10.5V3a1.5 1.5 0 00-3 0v7.5"
          />
        </motion.svg>
        <span className="font-medium tracking-wide">Drag bubbles</span>
      </motion.div>
    </div>
  );
}
