import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Library } from './pages/Library';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Navigation } from './components/Navigation';
import { MusicPlayer } from './components/MusicPlayer';
import { Song } from './types/song';
import { authService } from './services/authService';
import { songService } from './services/songService';
import { userService } from './services/userService';
import { Toaster, toast } from 'sonner';

export type Page = 'home' | 'library' | 'favorites' | 'profile';
export type AuthView = 'login' | 'register';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Songs state
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [favoriteSongIds, setFavoriteSongIds] = useState<string[]>([]);

  // App state
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentSong = songs[currentSongIndex];

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoadingSongs(true);
        const response = await songService.getAllSongs();
        if (response.success && response.data) {
          setSongs(response.data.songs);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        toast.error('Failed to load songs');
      } finally {
        setIsLoadingSongs(false);
      }
    };

    fetchSongs();
  }, []);

  // Fetch favorites when authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await userService.getFavorites();
        if (response.success && response.data) {
          const favoriteIds = response.data.favorites.map((song: Song) => song._id);
          setFavoriteSongIds(favoriteIds);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API fails
      setIsAuthenticated(false);
    }
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
      setCurrentTime(0);
    }
  };

  const handlePrevious = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
      setCurrentTime(0);
    }
  };

  const handleToggleFavorite = async (songId: string) => {
    try {
      const isFavorite = favoriteSongIds.includes(songId);
      
      if (isFavorite) {
        await userService.removeFromFavorites(songId);
        setFavoriteSongIds(prev => prev.filter(id => id !== songId));
        toast.success('Removed from favorites');
      } else {
        await userService.addToFavorites(songId);
        setFavoriteSongIds(prev => [...prev, songId]);
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  // Show loading while checking auth or loading songs
  if (isCheckingAuth || isLoadingSongs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthView('register')}
        />
      );
    } else {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  // Main app
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'white',
            color: '#9333ea',
            border: '2px solid #f9a8d4',
          },
          className: 'toast-custom',
          duration: 3000,
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Desktop Sidebar Navigation */}
          <div 
            className={`hidden lg:block transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'lg:w-64' : 'lg:w-0'
            }`}
          >
            {isSidebarOpen && (
              <Navigation 
                currentPage={currentPage} 
                onPageChange={setCurrentPage}
                onClose={() => setIsSidebarOpen(false)}
              />
            )}
          </div>

        {/* Main Content */}
        <div className="flex-1 pb-32 lg:pb-28 overflow-y-auto smooth-scroll">
          {/* Sidebar Toggle Button for Desktop */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hidden lg:flex fixed top-4 left-4 z-50 w-10 h-10 items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border-2 border-pink-200"
            >
              <svg 
                className="w-5 h-5 text-pink-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          )}

          {currentPage === 'home' && (
            <Home
              currentSong={currentSong}
              currentTime={currentTime}
              isPlaying={isPlaying}
              songs={songs}
              currentSongIndex={currentSongIndex}
              onSongSelect={handleSongSelect}
              favoriteSongIds={favoriteSongIds}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {currentPage === 'library' && (
            <Library
              songs={songs}
              currentSongIndex={currentSongIndex}
              onSongSelect={handleSongSelect}
              isPlaying={isPlaying}
              favoriteSongIds={favoriteSongIds}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {currentPage === 'favorites' && (
            <Favorites
              songs={songs.filter(song => favoriteSongIds.includes(song._id))}
              currentSongIndex={currentSongIndex}
              onSongSelect={handleSongSelect}
              isPlaying={isPlaying}
              favoriteSongIds={favoriteSongIds}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {currentPage === 'profile' && (
            <Profile onLogout={handleLogout} />
          )}
        </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-24 left-0 right-0 z-40">
            <Navigation currentPage={currentPage} onPageChange={setCurrentPage} isMobile />
          </div>
        </div>

        {/* Music Player - only render if there's a current song */}
        {currentSong && (
          <MusicPlayer
            song={currentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </>
  );
}
