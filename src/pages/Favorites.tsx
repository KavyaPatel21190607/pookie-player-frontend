import { Heart, Clock, Music, Sparkles } from 'lucide-react';
import { Song } from '../types/song';
import { motion } from 'motion/react';

interface FavoritesProps {
  songs: Song[];
  currentSongIndex: number;
  onSongSelect: (index: number) => void;
  isPlaying: boolean;
  favoriteSongIds: string[];
  onToggleFavorite: (songId: string) => void;
}

export function Favorites({ songs, currentSongIndex, onSongSelect, isPlaying, favoriteSongIds, onToggleFavorite }: FavoritesProps) {
  const favoriteSongs = songs;

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl smooth-scroll">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
          <h1 className="text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Favorite Songs
          </h1>
        </div>
        <p className="text-purple-400 text-sm lg:text-base">
          Your most loved pookie tracks 💕
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl p-4 text-center border-2 border-white/50">
          <Music className="w-8 h-8 text-pink-600 mx-auto mb-2" />
          <p className="text-2xl text-pink-700">{favoriteSongs.length}</p>
          <p className="text-xs text-pink-600">Total Songs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl p-4 text-center border-2 border-white/50">
          <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="currentColor" />
          <p className="text-2xl text-purple-700">{favoriteSongs.length}</p>
          <p className="text-xs text-purple-600">Favorites</p>
        </div>

        <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl p-4 text-center border-2 border-white/50">
          <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl text-blue-700">
            {Math.floor(favoriteSongs.reduce((acc, song) => acc + song.duration, 0) / 60)}
          </p>
          <p className="text-xs text-blue-600">Minutes</p>
        </div>

        <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-2xl p-4 text-center border-2 border-white/50">
          <Music className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl text-green-700">100%</p>
          <p className="text-xs text-green-600">Pookie</p>
        </div>
      </div>

      {/* Favorite Songs List */}
      <div className="space-y-3">
        {favoriteSongs.map((song, index) => {
          const isCurrentSong = index === currentSongIndex;

          return (
            <motion.button
              key={song.id}
              onClick={() => onSongSelect(index)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full relative overflow-hidden rounded-2xl p-4 text-left transition-all flex items-center gap-4
                ${isCurrentSong ? 'ring-4 ring-pink-400 shadow-xl' : 'shadow-md hover:shadow-lg'}
              `}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${song.coverColor} opacity-80`} />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-4 flex-1 min-w-0">
                {/* Album Art */}
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border-2 border-white/50">
                  <Music className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white truncate mb-1">{song.title}</h3>
                  <p className="text-white/80 text-sm truncate">{song.artist}</p>
                </div>

                {/* Duration & Status */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-white/70 text-sm hidden sm:block">
                    {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                  </span>

                  {isCurrentSong && isPlaying ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </motion.div>
                  ) : (
                    <Heart 
                      className="w-6 h-6 text-pink-500 cursor-pointer hover:scale-110 transition-all" 
                      fill="currentColor" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(song._id);
                      }}
                    />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {favoriteSongs.length === 0 && (
        <div className="text-center py-16 bg-white/50 rounded-3xl">
          <Heart className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-purple-400 mb-2">No favorite songs yet</p>
          <p className="text-purple-300 text-sm">Start adding songs you love! 💕</p>
        </div>
      )}
    </div>
  );
}
