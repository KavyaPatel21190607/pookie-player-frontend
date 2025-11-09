import { motion } from 'motion/react';

interface PeriodicTileProps {
  symbol: string;
  name: string;
  number: number;
  delay?: number;
}

export function PeriodicTile({ symbol, name, number, delay = 0 }: PeriodicTileProps) {
  const colors = [
    'from-pink-200 to-pink-300',
    'from-purple-200 to-purple-300',
    'from-blue-200 to-blue-300',
    'from-green-200 to-green-300',
    'from-yellow-200 to-yellow-300',
    'from-red-200 to-red-300',
  ];
  
  const colorClass = colors[number % colors.length];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay
      }}
      whileHover={{ 
        scale: 1.15, 
        rotate: 5,
        transition: { duration: 0.2 }
      }}
      className={`relative bg-gradient-to-br ${colorClass} rounded-xl lg:rounded-2xl p-2 lg:p-3 shadow-md lg:shadow-lg border-2 border-white/50 min-w-[60px] lg:min-w-[70px] h-[60px] lg:h-[70px] flex flex-col items-center justify-center group cursor-pointer`}
    >
      {/* Atomic Number */}
      <div className="absolute top-0.5 left-1.5 lg:top-1 lg:left-2 text-[9px] lg:text-[10px] text-gray-600 opacity-70">
        {number}
      </div>
      
      {/* Element Symbol */}
      <div className="text-gray-800 mt-1 text-base lg:text-lg">
        {symbol}
      </div>
      
      {/* Element Name - Tooltip */}
      <div className="absolute -bottom-10 lg:-bottom-10 left-1/2 -translate-x-1/2 bg-white/95 rounded-lg px-2 lg:px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-pink-200 text-xs lg:text-sm">
        <div className="text-pink-500">{name}</div>
      </div>
    </motion.div>
  );
}