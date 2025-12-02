'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { EventFormData, EVENT_TYPES, EVENT_CATEGORIES } from '@/types/eventForm';
import { Upload, X, Plus, Tag, Calendar, Clock, MapPin, Users, DollarSign, Image as ImageIcon } from 'lucide-react';

interface CreateEventFormProps {
  initialData?: Partial<EventFormData>;
  eventId?: string;
}

export default function CreateEventForm({ initialData, eventId }: CreateEventFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    eventType: initialData?.eventType || 'concert',
    date: initialData?.date || '',
    time: initialData?.time || '19:00',
    location: initialData?.location || '',
    address: initialData?.address || '',
    maxParticipants: initialData?.maxParticipants || 10,
    joiningFee: initialData?.joiningFee || 0,
    category: initialData?.category || 'Music',
    tags: initialData?.tags || [],
    image: initialData?.image || ''
  });

  if (!user || (user.role !== 'host' && user.role !== 'admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          Only hosts can create events. Please update your account to host role.
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) { setError('Event title is required'); return false; }
    if (!formData.description.trim()) { setError('Event description is required'); return false; }
    if (!formData.date) { setError('Event date is required'); return false; }
    if (!formData.time) { setError('Event time is required'); return false; }
    if (!formData.location.trim()) { setError('Location is required'); return false; }
    if (!formData.address.trim()) { setError('Address is required'); return false; }
    if (formData.maxParticipants < 1 || formData.maxParticipants > 1000) { setError('Maximum participants must be between 1 and 1000'); return false; }
    if (formData.joiningFee < 0) { setError('Joining fee cannot be negative'); return false; }
    if (!formData.category) { setError('Category is required'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const url = eventId 
        ? `http://localhost:5000/api/events/${eventId}`
        : 'http://localhost:5000/api/events';
      const method = eventId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(eventId ? `/events/${eventId}` : '/events');
        }, 1500);
      } else {
        setError(data.message || 'Failed to save event');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{eventId ? 'Edit Event' : 'Create New Event'}</h1>
        <p className="text-gray-600">{eventId ? 'Update your event details below' : 'Fill in the details to create an amazing event for others to join'}</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <span className="text-green-600">✓</span>
            </div>
            <div>
              <p className="font-medium text-green-800">Event {eventId ? 'updated' : 'created'} successfully!</p>
              <p className="text-green-700 text-sm mt-1">Redirecting...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <span className="text-red-600">✗</span>
            </div>
            <div>
              <p className="font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Weekend Hiking Trip" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required maxLength={100}/>
                <p className="mt-1 text-sm text-gray-500">Make it catchy and descriptive ({formData.title.length}/100)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your event in detail..." rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required maxLength={1000}/>
                <p className="mt-1 text-sm text-gray-500">{formData.description.length}/1000 characters</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {EVENT_TYPES.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {EVENT_CATEGORIES.map(category => (<option key={category} value={category}>{category}</option>))}
                </select>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="inline w-4 h-4 mr-1" />Date *</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="inline w-4 h-4 mr-1" />Time *</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="inline w-4 h-4 mr-1" />Location (City/Area) *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Dhaka, Gulshan" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="e.g., 123 Main Street, Gulshan-1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Users className="inline w-4 h-4 mr-1" />Maximum Participants *</label>
                    <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" max="1000" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required/>
                    <p className="mt-1 text-sm text-gray-500">How many people can join? (1-1000)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign className="inline w-4 h-4 mr-1" />Joining Fee (USD)</label>
                    <input type="number" name="joiningFee" value={formData.joiningFee} onChange={handleChange} min="0" step="0.01" placeholder="0 for free event" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                    <p className="mt-1 text-sm text-gray-500">Enter 0 for free events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b"><Tag className="inline w-5 h-5 mr-2" />Tags</h2>
            <div>
              <div className="flex gap-2 mb-4">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleTagKeyPress} placeholder="Add a tag (e.g., beginners-friendly)" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                <button type="button" onClick={handleTagAdd} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"><Plus className="w-5 h-5 mr-1" />Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">#{tag}
                    <button type="button" onClick={() => handleTagRemove(tag)} className="ml-2 text-blue-600 hover:text-blue-800"><X className="w-3 h-3"/></button>
                  </span>
                ))}
                {formData.tags.length === 0 && (<p className="text-gray-500 italic">No tags added yet. Add some tags to help people find your event.</p>)}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b"><ImageIcon className="inline w-5 h-5 mr-2" />Event Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
              <p className="text-gray-600 mb-2">Drag and drop an image here, or click to browse</p>
              <p className="text-sm text-gray-500 mb-4">Recommended: 1200x600px, max 5MB</p>
              <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Browse Files</button>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Or enter image URL</label>
                <input type="url" name="image" value={formData.image || ''} onChange={handleChange} placeholder="https://example.com/event-image.jpg" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
            </div>
            {formData.image && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img src={formData.image} alt="Event preview" className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}}/>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {loading ? (<><span className="animate-spin mr-2">⟳</span>{eventId ? 'Updating...' : 'Creating...'}</>) : (eventId ? 'Update Event' : 'Create Event')}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
          </div>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">💡 <strong>Tips for a great event:</strong> Be specific about what participants can expect, choose relevant tags, and set a reasonable fee. Great events have clear descriptions and attractive images!</p>
      </div>
    </div>
  );
}
