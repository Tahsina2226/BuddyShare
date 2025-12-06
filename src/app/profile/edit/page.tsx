'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProfileFormData } from '@/types/profile';
import { 
  User, 
  Camera, 
  MapPin, 
  Tag, 
  Save, 
  X, 
  ArrowLeft,
  Upload,
  Globe,
  Briefcase,
  Mail,
  Phone,
  Sparkles,
  Shield,
  Bell,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  Linkedin,
  Github,
  Twitter,
  Heart,
  Compass,
  CalendarDays,
  TrendingUp,
  Filter,
  Grid,
  List,
  Sliders,
  Zap,
  Star
} from 'lucide-react';
import API from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [interestInput, setInterestInput] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formSection, setFormSection] = useState<'basic' | 'social' | 'preferences'>('basic');

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    location: '',
    interests: [],
    avatar: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
    phone: '',
    title: '',
    notifications: true,
    privacy: 'public'
  });

  useEffect(() => {
    if (user !== undefined) {
      setAuthChecked(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const response = await API.get('/auth/me');
        const data = response.data;
        
        if (data.success && data.data) {
          const userData = data.data.user || data.data;
          
          setFormData(prev => ({
            ...prev,
            name: userData.name || '',
            bio: userData.bio || '',
            location: userData.location || '',
            interests: userData.interests || [],
            avatar: userData.avatar || '',
            website: userData.website || '',
            linkedin: userData.linkedin || '',
            github: userData.github || '',
            twitter: userData.twitter || '',
            phone: userData.phone || '',
            title: userData.title || '',
            notifications: userData.notifications !== undefined ? userData.notifications : true,
            privacy: userData.privacy || 'public'
          }));
          
          if (userData.avatar) {
            setImagePreview(userData.avatar);
          }
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        
        if (err.response?.status === 401) {
          toast.error('Session expired', {
            description: 'Please login again to continue',
            icon: <Shield className="w-5 h-5 text-[#96A78D]" />,
          });
          setTimeout(() => router.push('/login'), 1500);
          return;
        }
        
        toast.error('Failed to load profile', {
          description: err.response?.data?.message || 'Please try again',
          icon: <AlertCircle className="w-5 h-5 text-[#D2C1B6]" />,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && authChecked) {
      fetchProfile();
    }
    
    if (authChecked && !user) {
      toast.info('Authentication required', {
        description: 'Please login to edit your profile',
        icon: <Shield className="w-5 h-5 text-[#234C6A]" />,
      });
      router.push('/login');
    }
  }, [user, authChecked, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'avatar' && value) {
      setImagePreview(value);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64String }));
        setImagePreview(base64String);
        toast.success('Image uploaded', {
          description: 'Profile picture updated successfully',
          icon: <CheckCircle className="w-5 h-5 text-[#96A78D]" />,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestAdd = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
      toast.success('Interest added', {
        description: `${interestInput.trim()} added to your interests`,
        icon: <Tag className="w-5 h-5 text-[#234C6A]" />,
      });
    }
  };

  const handleInterestRemove = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
    toast.info('Interest removed', {
      description: `${interest} removed from your interests`,
      icon: <X className="w-5 h-5 text-white/40" />,
    });
  };

  const handleInterestKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInterestAdd();
    }
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Validation Error', {
        description: 'Name is required',
        icon: <AlertCircle className="w-5 h-5 text-[#D2C1B6]" />,
      });
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Validation Error', {
        description: 'Location is required',
        icon: <AlertCircle className="w-5 h-5 text-[#D2C1B6]" />,
      });
      return;
    }

    try {
      setSaving(true);
      
      toast.loading('Saving changes...', {
        id: 'save-profile',
        duration: Infinity,
      });

      const response = await API.put('/auth/profile', formData);
      const data = response.data;

      if (data.success) {
        toast.success('Profile updated', {
          id: 'save-profile',
          description: 'Your profile has been updated successfully',
          icon: <CheckCircle className="w-5 h-5 text-[#96A78D]" />,
          duration: 3000,
        });

        setTimeout(() => {
          router.push(`/profile/${user?.id}`);
        }, 2000);
      } else {
        toast.error('Update failed', {
          id: 'save-profile',
          description: data.message || 'Failed to update profile',
          icon: <AlertCircle className="w-5 h-5 text-[#D2C1B6]" />,
        });
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error('Update failed', {
        id: 'save-profile',
        description: err.response?.data?.message || 'Failed to update profile. Please try again.',
        icon: <AlertCircle className="w-5 h-5 text-[#D2C1B6]" />,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <Toaster 
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'group toast group-[.toaster]:bg-white/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:border-white/20 group-[.toaster]:shadow-2xl',
              title: 'group-[.toast]:text-white font-bold',
              description: 'group-[.toast]:text-white/60',
              actionButton: 'group-[.toast]:bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] group-[.toast]:text-white',
              cancelButton: 'group-[.toast]:bg-white/10 group-[.toast]:text-white/60',
            },
          }}
        />
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
            <div className="relative flex justify-center items-center w-20 h-20">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="mb-2 font-bold text-white text-2xl">Loading Profile</p>
          <p className="text-white/60">Preparing your edit profile experience</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
      <Toaster 
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'group toast group-[.toaster]:bg-white/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:border-white/20 group-[.toaster]:shadow-2xl',
            title: 'group-[.toast]:text-white font-bold',
            description: 'group-[.toast]:text-white/60',
            actionButton: 'group-[.toast]:bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] group-[.toast]:text-white',
            cancelButton: 'group-[.toast]:bg-white/10 group-[.toast]:text-white/60',
          },
        }}
      />
      
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <button
                onClick={() => router.push(`/profile/${user?.id}`)}
                className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 mb-4 border-2 border-white/20 rounded-xl font-bold text-white transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Profile
              </button>
              <h1 className="mb-2 font-bold text-4xl tracking-tight bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-white/60">Update your personal information and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-white/60 text-sm">Pro Editor</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-2xl p-2 mb-8 border-2 border-white/20">
            <div className="flex space-x-2">
              {[
                { id: 'basic', label: 'Basic Info', icon: User },
                { id: 'social', label: 'Social Links', icon: LinkIcon },
                { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFormSection(tab.id as any)}
                  className={`group inline-flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    formSection === tab.id
                      ? 'bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] text-white shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {formSection === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-2xl">Profile Picture</h2>
                      <p className="text-white/60">Upload or provide URL for your avatar</p>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-row flex-col items-center md:items-start md:space-x-8 space-y-8 md:space-y-0">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] blur-xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/2 flex items-center justify-center">
                            <span className="font-bold text-white/40 text-5xl">
                              {formData.name.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <label className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#1a3d57] hover:to-[#c4b1a6] px-4 py-2 rounded-xl font-bold text-white text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Upload className="inline mr-2 w-4 h-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <label className="block mb-3 font-bold text-white/60 text-sm">
                          Avatar URL
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                            <LinkIcon className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            name="avatar"
                            value={formData.avatar || ''}
                            onChange={handleChange}
                            placeholder="https://example.com/your-photo.jpg"
                            className="pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                          />
                        </div>
                        <p className="mt-3 text-white/40 text-sm">
                          Enter a direct URL to your profile picture.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-2xl">Basic Information</h2>
                      <p className="text-white/60">Tell us about yourself</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <Briefcase className="inline mr-2 w-4 h-4" />
                        Professional Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell others about yourself..."
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30 resize-none"
                        maxLength={500}
                      />
                      <div className="flex justify-between mt-3">
                        <p className="text-white/40 text-sm">
                          Brief description about yourself
                        </p>
                        <p className={`text-sm ${formData.bio.length >= 450 ? 'text-[#D2C1B6]' : 'text-white/40'}`}>
                          {formData.bio.length}/500
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <MapPin className="inline mr-2 w-4 h-4" />
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Dhaka, Bangladesh"
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-3 rounded-xl">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-2xl">Interests & Skills</h2>
                      <p className="text-white/60">Add your hobbies, skills, and areas of expertise</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="relative mb-6">
                      <input
                        type="text"
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyPress={handleInterestKeyPress}
                        placeholder="Type an interest and press Enter"
                        className="pl-4 pr-32 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                      />
                      <button
                        type="button"
                        onClick={handleInterestAdd}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#1a3d57] hover:to-[#c4b1a6] px-4 py-2 rounded-xl font-bold text-white transition-all"
                      >
                        Add Interest
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <AnimatePresence>
                        {formData.interests.map((interest, index) => (
                          <motion.span
                            key={index}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="inline-flex items-center bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 px-4 py-2 rounded-full border-2 border-white/20 text-white group transition-all"
                          >
                            <Sparkles className="w-4 h-4 mr-2 text-[#234C6A]" />
                            {interest}
                            <button
                              type="button"
                              onClick={() => handleInterestRemove(interest)}
                              className="ml-3 text-white/40 hover:text-[#D2C1B6] transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      
                      {formData.interests.length === 0 && (
                        <div className="w-full py-8 text-center">
                          <div className="inline-flex justify-center items-center mb-4">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/20">
                              <Tag className="w-8 h-8 text-white/40" />
                            </div>
                          </div>
                          <p className="text-white/40 italic">
                            No interests added yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {formSection === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#234C6A] to-[#96A78D] shadow-lg p-3 rounded-xl">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-2xl">Contact & Social Links</h2>
                      <p className="text-white/60">Connect your social profiles</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <Mail className="inline mr-2 w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="px-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl w-full text-white/40 cursor-not-allowed"
                      />
                      <p className="mt-2 text-white/40 text-sm">
                        Primary email
                      </p>
                    </div>

                    <div>
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <Phone className="inline mr-2 w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        placeholder="+880 1234 567890"
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <Globe className="inline mr-2 w-4 h-4" />
                        Personal Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <Linkedin className="inline mr-2 w-4 h-4" />
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin || ''}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                      />
                    </div>

                    <div>
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <Github className="inline mr-2 w-4 h-4" />
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github || ''}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                      />
                    </div>

                    <div>
                      <label className="block mb-3 font-bold text-white/60 text-sm">
                        <Twitter className="inline mr-2 w-4 h-4" />
                        Twitter/X Profile
                      </label>
                      <input
                        type="url"
                        name="twitter"
                        value={formData.twitter || ''}
                        onChange={handleChange}
                        placeholder="https://twitter.com/username"
                        className="px-4 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 focus:border-[#234C6A] rounded-xl focus:ring-2 focus:ring-[#234C6A]/50 w-full text-white placeholder-white/30"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {formSection === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-2xl">Notification Settings</h2>
                      <p className="text-white/60">Control how you receive updates</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/20">
                      <div>
                        <h4 className="font-bold text-white">Email Notifications</h4>
                        <p className="text-white/60 text-sm">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications}
                          onChange={(e) => handleToggleChange('notifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#234C6A] to-[#D2C1B6]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-2xl">Privacy Settings</h2>
                      <p className="text-white/60">Control your profile visibility</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
                      { value: 'private', label: 'Private', description: 'Only followers can view your profile' },
                      { value: 'hidden', label: 'Hidden', description: 'Only you can view your profile' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/20 hover:bg-white/10 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="privacy"
                          value={option.value}
                          checked={formData.privacy === option.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value }))}
                          className="mr-4 w-5 h-5 text-[#234C6A] bg-white/10 border-white/20 focus:ring-[#234C6A] focus:ring-2"
                        />
                        <div>
                          <h4 className="font-bold text-white">{option.label}</h4>
                          <p className="text-white/60 text-sm">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex sm:flex-row flex-col gap-4 pt-8 border-t-2 border-white/20"
          >
            <button
              type="submit"
              disabled={saving}
              className="group relative flex flex-1 justify-center items-center bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#D2C1B6] hover:to-[#234C6A] disabled:opacity-50 px-8 py-4 border-2 border-white/20 rounded-xl font-bold text-white transition-all disabled:cursor-not-allowed hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {saving ? (
                <>
                  <div className="mr-3 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push(`/profile/${user?.id}`)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 hover:border-white/30 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
            >
              Discard Changes
            </button>
          </motion.div>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20"
        >
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-[#D2C1B6]/20 to-[#c4b1a6]/20 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-[#D2C1B6]" />
            </div>
            <div>
              <h4 className="mb-3 font-bold text-white text-lg">💡 Profile Tips</h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#96A78D]" />
                  <span>A complete profile increases your visibility by 85%</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#96A78D]" />
                  <span>Adding interests helps match with relevant events</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#96A78D]" />
                  <span>Professional photos receive more profile views</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}