import { motion } from 'motion/react';
import { Home, Library, Heart, User, X } from 'lucide-react';
import { Page } from '../App';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Navigation({ currentPage, onPageChange, isMobile = false, onClose }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Home' },
    { id: 'library' as Page, icon: Library, label: 'Library' },
    { id: 'favorites' as Page, icon: Heart, label: 'Favorites' },
    { id: 'profile' as Page, icon: User, label: 'Profile' },
  ];

  if (isMobile) {
    return (
      <div className="bg-white/80 backdrop-blur-lg border-t-2 border-pink-200 mx-4 rounded-t-3xl shadow-2xl">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all ${
                  isActive ? 'text-pink-500' : 'text-gray-400'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? 'fill-pink-500' : ''}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-xs">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white/80 backdrop-blur-lg border-r-2 border-pink-200 min-h-screen p-6 relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors text-gray-500 hover:text-pink-600"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Pookie Player
          </h2>
        </div>
        <p className="text-xs text-purple-400">Chemistry meets melody ✨</p>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-pink-200 to-purple-200 text-pink-600 shadow-md'
                  : 'text-gray-500 hover:bg-pink-50'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? 'fill-pink-600' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Decorative Element */}
      <div className="mt-auto pt-8">
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4 border-2 border-pink-200">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-pink-400" fill="currentColor" />
            <span className="text-sm text-pink-600">Pro Tip</span>
          </div>
          <p className="text-xs text-purple-600">
            Hover over element tiles to see their full names!
          </p>
        </div>
      </div>
    </div>
  );
}
