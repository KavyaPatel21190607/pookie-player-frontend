import { useState, useEffect, useRef } from 'react';
import { Heart, Mail, Calendar, Shield, LogOut, Loader2, Camera, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { userService } from '../services/userService';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  favoriteCount?: number;
  playlistCount?: number;
  favorites?: any[];
  playlists?: any[];
  createdAt: string;
}

export function Profile({ onLogout }: { onLogout?: () => void }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please login to view your profile.');
        setIsLoading(false);
        return;
      }

      const response = await userService.getProfile();
      
      if (response.success && response.data) {
        setUserData(response.data.user);
      } else {
        setError('Failed to load profile data');
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          
          // Update avatar in backend
          const response = await userService.updateProfile({ avatar: base64String });
          
          if (response.success && response.data) {
            setUserData(prev => prev ? { ...prev, avatar: base64String } : null);
            toast.success('Profile photo updated successfully! 🎀');
          } else {
            toast.error('Failed to update profile photo');
          }
        } catch (error: any) {
          console.error('Avatar upload error:', error);
          toast.error(error.response?.data?.message || 'Failed to upload photo');
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setIsUploadingAvatar(false);
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('File processing error:', error);
      toast.error('Failed to process image');
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl smooth-scroll flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-purple-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl smooth-scroll flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load profile data</p>
          <button 
            onClick={fetchUserProfile}
            className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl smooth-scroll">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
          <h1 className="text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Profile
          </h1>
        </div>
        <p className="text-purple-400 text-sm lg:text-base">
          Your pookie account details ✨
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl p-8 mb-6 border-4 border-white/50 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center border-4 border-pink-300 shadow-lg overflow-hidden">
              {userData.avatar ? (
                <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-6xl lg:text-7xl filter drop-shadow-md">🎀</span>
              )}
            </div>
            
            {/* Upload Button Overlay */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              className="absolute inset-0 w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-white" />
              )}
            </motion.button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-white mb-2">{userData.name}</h2>
            <p className="text-white/80 text-sm mb-4">{userData.email}</p>
            
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-2xl text-white">{userData.favoriteCount || userData.favorites?.length || 0}</p>
                <p className="text-xs text-white/70">Favorites</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-white">{userData.playlistCount || userData.playlists?.length || 0}</p>
                <p className="text-xs text-white/70">Playlists</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-white">∞</p>
                <p className="text-xs text-white/70">Pookie Level</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="space-y-4">
        {/* Email */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border-2 border-pink-200 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="text-gray-700 font-medium">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Role */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border-2 border-purple-200 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Account Type</p>
              <p className="text-gray-700 font-medium capitalize">{userData.role}</p>
            </div>
          </div>
        </div>

        {/* Member Since */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border-2 border-blue-200 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Member Since</p>
              <p className="text-gray-700 font-medium">{formatDate(userData.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      {onLogout && (
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full bg-gradient-to-r from-red-400 to-pink-400 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}