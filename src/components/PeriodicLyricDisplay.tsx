import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PeriodicTile } from './PeriodicTile';
import { Song } from '../types/song';
import { Sparkles } from 'lucide-react';

interface PeriodicLyricDisplayProps {
  song: Song | undefined;
  currentTime: number;
  isPlaying: boolean;
}

export function PeriodicLyricDisplay({ song, currentTime, isPlaying }: PeriodicLyricDisplayProps) {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying || !song) return;

    // Find the current lyric based on timestamp
    for (let i = song.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= song.lyrics[i].timestamp) {
        setCurrentLyricIndex(i);
        break;
      }
    }
  }, [currentTime, song, isPlaying]);

  // Show empty state if no song
  if (!song) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-xl border-2 border-pink-200 min-h-[400px] lg:min-h-[500px] relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-2xl text-purple-400 mb-2">No Songs Available</h3>
          <p className="text-purple-300">Add some songs to get started!</p>
        </div>
      </div>
    );
  }

  const currentLyric = song.lyrics[currentLyricIndex];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-xl border-2 border-pink-200 min-h-[400px] lg:min-h-[500px] relative overflow-hidden">
      {/* Decorative sparkles */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-20">
        <Sparkles className="w-4 h-4 lg:w-6 lg:h-6 text-pink-400" />
      </div>

      <div className="mb-6">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 text-center text-lg lg:text-xl">
          Now Playing
        </h2>
        <p className="text-center text-purple-400 text-xs lg:text-sm mt-1">{song.title} • {song.artist}</p>
      </div>

      {/* Original Lyric Line */}
      <div className="text-center mb-6 lg:mb-8">
        <motion.p
          key={currentLyricIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 italic text-sm lg:text-base"
        >
          "{currentLyric?.originalLine}"
        </motion.p>
      </div>

      {/* Periodic Table Display */}
      <div className="flex flex-wrap gap-2 justify-center items-center min-h-[200px] lg:min-h-[280px]">
        {currentLyric?.parsedTokens.map((token, index) => {
          if (token.type === 'element') {
            return (
              <PeriodicTile
                key={`${currentLyricIndex}-${index}`}
                symbol={token.symbol!}
                name={token.name!}
                number={token.number!}
                delay={index * 0.05}
              />
            );
          } else if (token.type === 'space') {
            return <div key={`${currentLyricIndex}-${index}`} className="w-2 lg:w-4" />;
          } else {
            return (
              <motion.div
                key={`${currentLyricIndex}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-gray-600 flex items-center h-[60px] lg:h-[70px] text-lg lg:text-xl"
              >
                {token.value}
              </motion.div>
            );
          }
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 lg:mt-8 flex justify-center gap-2">
        {song.lyrics.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 lg:h-2 rounded-full transition-all duration-300 ${
              index === currentLyricIndex 
                ? 'w-6 lg:w-8 bg-gradient-to-r from-pink-400 to-purple-400' 
                : 'w-1.5 lg:w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}