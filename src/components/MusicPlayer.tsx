import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Song } from '../types/song';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import { Slider } from './ui/slider';

interface MusicPlayerProps {
  song: Song;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
  onPrevious: () => void;
}

export function MusicPlayer({
  song,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  onNext,
  onPrevious
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element only once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;
      
      // Set up permanent event listeners
      audio.addEventListener('ended', () => {
        console.log('Audio ended');
        setIsPlaying(false);
        onNext();
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(Math.floor(audio.currentTime));
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        console.error('Audio error details:', {
          src: audio.src,
          error: audio.error,
          networkState: audio.networkState,
          readyState: audio.readyState
        });
        setIsPlaying(false);
      });
      
      audio.addEventListener('canplay', () => {
        console.log('Audio can play, duration:', audio.duration);
      });
      
      audio.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded, duration:', audio.duration);
      });
    }
    
    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handle song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) return;
    
    console.log('Loading new audio:', song.audioUrl);
    audio.pause();
    audio.src = song.audioUrl;
    audio.currentTime = 0;
    audio.load();
    
    // If we're supposed to be playing, start playback once loaded
    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Auto-play error:', err);
        setIsPlaying(false);
      });
    }
  }, [song.audioUrl]);

  // Handle play/pause changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      console.log('Playing audio...');
      audio.play().catch(err => {
        console.error('Play error:', err);
        setIsPlaying(false);
      });
    } else {
      console.log('Pausing audio...');
      audio.pause();
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-300/98 via-purple-300/98 to-blue-300/98 backdrop-blur-lg border-t-2 lg:border-t-4 border-white/50 shadow-2xl z-50">
      <div className="container mx-auto px-3 lg:px-4 py-3 lg:py-4 max-w-7xl">
        {/* Progress Bar */}
        <div className="mb-3 lg:mb-4">
          <Slider
            value={[currentTime]}
            max={song.duration}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between mt-1 lg:mt-2 text-[10px] lg:text-xs text-white/80">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(song.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:gap-6">
          {/* Song Info */}
          <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-xl bg-gradient-to-br ${song.coverColor} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <Heart className="w-5 h-5 lg:w-7 lg:h-7 text-white" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white truncate text-sm lg:text-base">{song.title}</h3>
              <p className="text-white/70 text-xs lg:text-sm truncate">{song.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 lg:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrevious}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <SkipBack className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 lg:w-7 lg:h-7 text-pink-500" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 lg:w-7 lg:h-7 text-pink-500 ml-0.5 lg:ml-1" fill="currentColor" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <SkipForward className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="currentColor" />
            </motion.button>
          </div>

          {/* Volume - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3 flex-1 justify-end">
            <Volume2 className="w-5 h-5 text-white" />
            <div className="w-24">
              <Slider defaultValue={[80]} max={100} step={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}