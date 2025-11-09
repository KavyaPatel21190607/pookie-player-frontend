import { motion } from 'motion/react';
import { Song } from '../types/song';
import { Music, Heart } from 'lucide-react';

interface CompactSongListProps {
  songs: Song[];
  currentSongIndex: number;
  onSongSelect: (index: number) => void;
  isPlaying: boolean;
  favoriteSongIds?: string[];
  onToggleFavorite?: (songId: string) => void;
}

export function CompactSongList({ 
  songs, 
  currentSongIndex, 
  onSongSelect, 
  isPlaying,
  favoriteSongIds = [],
  onToggleFavorite 
}: CompactSongListProps) {
  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
      {songs.map((song, index) => {
        const isCurrentSong = index === currentSongIndex;

        return (
          <motion.button
            key={song.id}
            onClick={() => onSongSelect(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full relative overflow-hidden rounded-2xl p-4 text-left transition-all
              ${isCurrentSong ? 'ring-2 ring-pink-400 shadow-lg' : 'shadow-md hover:shadow-lg'}
            `}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${song.coverColor} opacity-90`} />
            
            {/* Overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              {/* Music Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/60 shadow-md">
                <Music className="w-6 h-6 text-white drop-shadow-md" />
              </div>

              {/* Song Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold truncate text-sm drop-shadow-md">{song.title}</h4>
                <p className="text-white/95 text-xs truncate drop-shadow-md">{song.artist}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/90 text-xs drop-shadow-md font-medium">
                    {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                  </span>
                  {isCurrentSong && isPlaying && (
                    <div className="flex items-center gap-0.5">
                      <div className="w-0.5 h-2 bg-white rounded-full animate-pulse drop-shadow-md" />
                      <div className="w-0.5 h-3 bg-white rounded-full animate-pulse drop-shadow-md" style={{ animationDelay: '150ms' }} />
                      <div className="w-0.5 h-2 bg-white rounded-full animate-pulse drop-shadow-md" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Heart Icon - Favorite Button */}
              {onToggleFavorite ? (
                <Heart
                  className={`w-5 h-5 flex-shrink-0 transition-all drop-shadow-md cursor-pointer hover:scale-110 ${
                    favoriteSongIds.includes(song._id)
                      ? 'text-pink-500 fill-pink-500'
                      : 'text-white/80 hover:text-pink-400 hover:fill-pink-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(song._id);
                  }}
                />
              ) : (
                <Heart
                  className={`w-5 h-5 flex-shrink-0 transition-all drop-shadow-md ${
                    isCurrentSong ? 'text-white fill-white' : 'text-white/80'
                  }`}
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
