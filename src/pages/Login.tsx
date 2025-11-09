import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        toast.success(result.message || 'Login successful!');
        onLogin(); // Trigger parent component to update auth state
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10"
        >
          <Heart className="w-16 h-16 text-pink-300 opacity-40" fill="currentColor" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 right-20"
        >
          <Sparkles className="w-20 h-20 text-purple-300 opacity-30" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 15, 0]
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-32 left-1/4"
        >
          <Heart className="w-24 h-24 text-blue-300 opacity-20" fill="currentColor" />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 25, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-1/4"
        >
          <Sparkles className="w-14 h-14 text-pink-300 opacity-40" />
        </motion.div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border-4 border-pink-200">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full mb-4 border-4 border-white shadow-lg"
            >
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </motion.div>
            
            <h1 className="text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2">
              Welcome Back!
            </h1>
            <p className="text-purple-400">
              Login to your pookie account ✨
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pookie@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-purple-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/70 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors text-gray-700 placeholder-purple-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>



            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <Heart className="w-5 h-5" fill="currentColor" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-8">
            <div className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-pink-300 shadow-lg overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200/30 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-200/30 rounded-full -ml-8 -mb-8"></div>
              
              <div className="relative z-10">
                <p className="text-gray-600 text-sm mb-4 font-medium">
                  Don't have an account yet?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(219, 39, 119, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onSwitchToRegister}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Heart className="w-6 h-6 relative z-10" fill="currentColor" />
                  <span className="relative z-10 text-lg">Create Account</span>
                  <Sparkles className="w-6 h-6 relative z-10 animate-pulse" />
                </motion.button>
                <p className="text-purple-400 text-xs mt-3">
                  Join to unlock all features ✨
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-6">
          <p className="text-purple-400/70 text-sm">
            Made by Developer K With ❤️ just for 🎀
          </p>
        </div>
      </motion.div>
    </div>
  );
}
