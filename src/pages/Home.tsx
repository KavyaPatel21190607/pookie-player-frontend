import { Heart, Sparkles } from 'lucide-react';
import { PeriodicLyricDisplay } from '../components/PeriodicLyricDisplay';
import { CompactSongList } from '../components/CompactSongList';
import { Song } from '../types/song';

interface HomeProps {
  currentSong: Song | undefined;
  currentTime: number;
  isPlaying: boolean;
  songs: Song[];
  currentSongIndex: number;
  onSongSelect: (index: number) => void;
  favoriteSongIds?: string[];
  onToggleFavorite?: (songId: string) => void;
}

export function Home({
  currentSong,
  currentTime,
  isPlaying,
  songs,
  currentSongIndex,
  onSongSelect,
  favoriteSongIds = [],
  onToggleFavorite,
}: HomeProps) {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8 lg:mb-12 animate-fadeIn">
        <div className="inline-flex items-center gap-2 mb-3">
          <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-pink-400 animate-pulse" fill="currentColor" />
          <h1 className="text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            Pookie's Periodic Lyrics
          </h1>
          <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-pink-400 animate-pulse" fill="currentColor" />
        </div>
        <p className="text-purple-400 text-sm lg:text-base">
          Where chemistry meets melody ✨
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Periodic Lyric Display */}
        <PeriodicLyricDisplay
          song={currentSong}
          currentTime={currentTime}
          isPlaying={isPlaying}
        />

        {/* Song Queue */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-xl border-2 border-purple-200 relative overflow-hidden">
          {/* Decorative sparkles */}
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>

          <div className="mb-6 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 text-center">
              Song Library
            </h2>
            <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
          </div>

          <CompactSongList
            songs={songs}
            currentSongIndex={currentSongIndex}
            onSongSelect={onSongSelect}
            isPlaying={isPlaying}
            favoriteSongIds={favoriteSongIds}
            onToggleFavorite={onToggleFavorite}
          />

          <div className="mt-6 text-center text-sm text-purple-400/70">
            Click any song to play! ✨
          </div>
        </div>
      </div>
    </div>
  );
}
