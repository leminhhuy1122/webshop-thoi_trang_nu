import React from 'react';
import { motion } from 'motion/react';
import { Cat } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
      
      {/* Box Container */}
      <div className="relative w-32 h-40 flex items-end justify-center">
        
        {/* Box Back */}
        <div className="absolute bottom-0 w-24 h-16 bg-[#b09e8a] z-0 rounded-b-lg shadow-inner" />

        {/* Cat */}
        <motion.div
          className="absolute bottom-2 flex items-center justify-center text-neutral-800 z-10"
          initial={{ y: 0 }}
          animate={{ y: [0, 0, -45, -45, 0, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.1, 0.3, 0.6, 0.8, 1]
          }}
        >
          <Cat className="w-14 h-14" fill="currentColor" strokeWidth={1} />
        </motion.div>

        {/* Box Front (Base) */}
        <div className="absolute bottom-0 w-24 h-16 bg-[#d4c3b3] border border-[#b09e8a] z-20 rounded-b-lg flex items-center justify-center shadow-lg">
          {/* Tape / Box Detail */}
          <div className="absolute top-0 w-8 h-8 border-b border-x border-[#b09e8a] bg-[#cbb8a5] opacity-50" />
        </div>

        {/* Box Lid */}
        <motion.div
          className="absolute bottom-14 w-26 h-6 bg-[#d4c3b3] border border-[#b09e8a] z-30 rounded shadow-md"
          style={{ width: '6.5rem' }} // slightly wider than the 6rem (24) box
          initial={{ y: 0, x: 0, rotate: 0 }}
          animate={{ 
            y: [0, -55, -55, 0, 0],
            x: [0, -15, -15, 0, 0],
            rotate: [0, -12, -12, 0, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.75, 0.9, 1]
          }}
        >
          {/* Lid Tape */}
          <div className="w-full h-full flex items-center justify-center opacity-40">
             <div className="w-8 h-2 bg-[#b09e8a]" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
