import { useState } from 'react';
import { Search, Music, Heart, Clock } from 'lucide-react';
import { Song } from '../types/song';
import { motion } from 'motion/react';

interface LibraryProps {
  songs: Song[];
  currentSongIndex: number;
  onSongSelect: (index: number) => void;
  isPlaying: boolean;
  favoriteSongIds: string[];
  onToggleFavorite: (songId: string) => void;
}

export function Library({ songs, currentSongIndex, onSongSelect, isPlaying, favoriteSongIds, onToggleFavorite }: LibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl smooth-scroll">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-3 mb-2">
          <Music className="w-8 h-8 text-pink-400" />
          <h1 className="text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Music Library
          </h1>
        </div>
        <p className="text-purple-400 text-sm lg:text-base">
          Browse all your pookie songs ✨
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="Search songs or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-md rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-purple-300"
          />
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredSongs.map((song, index) => {
          const actualIndex = songs.indexOf(song);
          const isCurrentSong = actualIndex === currentSongIndex;

          return (
            <motion.button
              key={song.id}
              onClick={() => onSongSelect(actualIndex)}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden rounded-3xl p-6 text-left transition-all
                ${isCurrentSong ? 'ring-4 ring-pink-400 shadow-2xl' : 'shadow-lg hover:shadow-xl'}
              `}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${song.coverColor} opacity-90`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Album Art Circle */}
                <div className="w-full aspect-square rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 border-2 border-white/50">
                  <Music className="w-16 h-16 text-white" />
                </div>

                {/* Song Info */}
                <h3 className="text-white mb-1 truncate">{song.title}</h3>
                <p className="text-white/80 text-sm truncate mb-3">{song.artist}</p>

                {/* Footer */}
                <div className="flex items-center justify-between text-white/70 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                    </span>
                  </div>

                  {isCurrentSong && isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Favorite Icon */}
              <div 
                className="absolute top-4 right-4 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(song._id);
                }}
              >
                <Heart 
                  className={`w-6 h-6 transition-all cursor-pointer ${
                    favoriteSongIds.includes(song._id)
                      ? 'text-pink-500 fill-pink-500 hover:scale-110'
                      : 'text-white/80 hover:text-pink-400 hover:fill-pink-400 hover:scale-110'
                  }`} 
                />
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full" />
            </motion.button>
          );
        })}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-16">
          <Music className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <p className="text-purple-400">No songs found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
