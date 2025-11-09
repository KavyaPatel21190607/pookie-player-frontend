import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface RegisterProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        toast.success(result.message || 'Registration successful!');
        onRegister(); // Trigger parent component to update auth state
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

      {/* Register Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border-4 border-purple-200">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mb-4 border-4 border-white shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mb-2">
              Join Pookie!
            </h1>
            <p className="text-purple-400">
              Create your account ✨
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Pookie Lover"
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-colors text-gray-700 placeholder-purple-300"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="pookie@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-colors text-gray-700 placeholder-purple-300"
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
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-colors text-gray-700 placeholder-purple-300"
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/70 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-colors text-gray-700 placeholder-purple-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-2 border-purple-300 text-purple-500 focus:ring-purple-400"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" className="text-purple-500 hover:text-purple-700">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-purple-500 hover:text-purple-700">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-300 shadow-lg overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-200/30 rounded-full -ml-8 -mb-8"></div>
              
              <div className="relative z-10">
                <p className="text-gray-600 text-sm mb-4 font-medium">
                  Already have an account?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onSwitchToLogin}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white py-4 rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Heart className="w-6 h-6 relative z-10" fill="currentColor" />
                  <span className="relative z-10 text-lg">Login Now</span>
                  <Sparkles className="w-6 h-6 relative z-10 animate-pulse" />
                </motion.button>
                <p className="text-purple-400 text-xs mt-3">
                  Welcome back! We missed you 💕
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-6">
          <p className="text-purple-400/70 text-sm">
            Made with 💕 and ⚗️
          </p>
        </div>
      </motion.div>
    </div>
  );
}
