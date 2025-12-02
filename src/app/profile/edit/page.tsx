'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProfileFormData } from '@/types/profile';
import { User, Camera, MapPin, Tag, Save, X } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [interestInput, setInterestInput] = useState('');

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    location: '',
    interests: [],
    avatar: ''
  });

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          const userData = data.data.user;
          setFormData({
            name: userData.name,
            bio: userData.bio || '',
            location: userData.location,
            interests: userData.interests || [],
            avatar: userData.avatar || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestAdd = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const handleInterestRemove = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleInterestKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInterestAdd();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Update auth context with new user data
        if (login) {
          // This would typically update the user in context
          // For now, we'll just show success and redirect
          setTimeout(() => {
            router.push(`/profile/${user?.id}`);
          }, 1500);
        }
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-blue-600 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-gray-900 text-3xl">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information and preferences</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 mb-6 p-4 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="bg-green-100 mr-3 p-2 rounded-full">
                <span className="text-green-600">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">Profile updated successfully!</p>
                <p className="mt-1 text-green-700 text-sm">Redirecting to your profile...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 mb-6 p-4 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="bg-red-100 mr-3 p-2 rounded-full">
                <span className="text-red-600">✗</span>
              </div>
              <div>
                <p className="font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 md:p-8 rounded-xl">
          <div className="space-y-8">
            {/* Avatar Section */}
            <div>
              <h2 className="mb-6 pb-2 border-b font-bold text-gray-900 text-xl">
                <User className="inline mr-2 w-5 h-5" />
                Profile Picture
              </h2>
              
              <div className="flex md:flex-row flex-col items-center md:items-start md:space-x-8 space-y-6 md:space-y-0">
                {/* Avatar Preview */}
                <div className="relative">
                  <div className="bg-blue-100 rounded-full w-32 h-32 overflow-hidden">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-full">
                        <span className="font-bold text-blue-600 text-4xl">
                          {formData.name.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="right-0 bottom-0 absolute bg-blue-600 hover:bg-blue-700 p-2 rounded-full text-white transition"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Avatar URL Input */}
                <div className="flex-1">
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  <p className="mt-2 text-gray-500 text-sm">
                    Enter a direct URL to your profile picture. We recommend using a square image.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h2 className="mb-6 pb-2 border-b font-bold text-gray-900 text-xl">Basic Information</h2>
              
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell others about yourself..."
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                    maxLength={500}
                  />
                  <p className="mt-1 text-gray-500 text-sm">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    <MapPin className="inline mr-1 w-4 h-4" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Dhaka, Bangladesh"
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h2 className="mb-6 pb-2 border-b font-bold text-gray-900 text-xl">
                <Tag className="inline mr-2 w-5 h-5" />
                Interests
              </h2>
              
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={handleInterestKeyPress}
                    placeholder="Add an interest (e.g., Hiking, Music, Tech)"
                    className="flex-1 px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleInterestAdd}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-white transition"
                  >
                    Add
                  </button>
                </div>

                {/* Interests Display */}
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full text-blue-800"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleInterestRemove(interest)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  {formData.interests.length === 0 && (
                    <p className="text-gray-500 italic">No interests added yet. Add your hobbies and interests.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex sm:flex-row flex-col gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 justify-center items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium text-white transition disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="mr-2 animate-spin">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push(`/profile/${user?.id}`)}
                className="hover:bg-gray-50 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Help Text */}
        <div className="bg-blue-50 mt-6 p-4 rounded-lg">
          <p className="text-blue-800 text-sm">
            💡 <strong>Tip:</strong> A complete profile helps others get to know you better. 
            Add interests to find events that match your hobbies!
          </p>
        </div>
      </div>
    </div>
  );
}