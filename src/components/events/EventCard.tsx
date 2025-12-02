'use client'

import Link from 'next/link';
import { Event } from '@/types/event';
import { Calendar, Users, MapPin, DollarSign, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
  showHost?: boolean;
}

export default function EventCard({ event, showHost = true }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Music': 'bg-purple-100 text-purple-800',
      'Sports': 'bg-green-100 text-green-800',
      'Food': 'bg-red-100 text-red-800',
      'Tech': 'bg-blue-100 text-blue-800',
      'Art': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Games': 'bg-pink-100 text-pink-800',
      'Travel': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white shadow-lg hover:shadow-xl border border-gray-100 rounded-xl overflow-hidden transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-48">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <div className="text-4xl">
              {event.eventType === 'concert' && '🎵'}
              {event.eventType === 'hiking' && '🥾'}
              {event.eventType === 'sports' && '⚽'}
              {event.eventType === 'games' && '🎮'}
              {event.eventType === 'tech' && '💻'}
              {event.eventType === 'art' && '🎨'}
              {!['concert', 'hiking', 'sports', 'games', 'tech', 'art'].includes(event.eventType) && '🎪'}
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="top-4 right-4 absolute">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
            {event.status.toUpperCase()}
          </span>
        </div>

        {/* Category Badge */}
        <div className="top-4 left-4 absolute">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>

        {/* Participants Count */}
        <div className="right-4 bottom-4 absolute bg-black/70 px-3 py-1 rounded-full text-white text-sm">
          <Users className="inline mr-1 w-4 h-4" />
          {event.currentParticipants}/{event.maxParticipants}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        {/* Event Title and Host */}
        <div className="mb-4">
          <Link href={`/events/${event._id}`}>
            <h3 className="mb-2 font-bold text-gray-900 hover:text-blue-600 text-xl transition">
              {event.title}
            </h3>
          </Link>
          
          {showHost && event.host && (
            <div className="flex items-center mt-2">
              <div className="flex justify-center items-center bg-blue-100 mr-2 rounded-full w-8 h-8">
                {event.host.avatar ? (
                  <img
                    src={event.host.avatar}
                    alt={event.host.name}
                    className="rounded-full w-8 h-8"
                  />
                ) : (
                  <span className="font-semibold text-blue-600">
                    {event.host.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-700 text-sm">{event.host.name}</p>
                {event.host.rating && (
                  <p className="text-yellow-600 text-xs">⭐ {event.host.rating}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="mr-2 w-4 h-4 text-blue-500" />
            <span className="text-sm">{formatDate(event.date)}</span>
            <Clock className="mr-2 ml-3 w-4 h-4 text-blue-500" />
            <span className="text-sm">{event.time}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="mr-2 w-4 h-4 text-red-500" />
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <DollarSign className="mr-2 w-4 h-4 text-green-500" />
            <span className={`text-sm font-semibold ${event.joiningFee === 0 ? 'text-green-600' : 'text-gray-800'}`}>
              {event.joiningFee === 0 ? 'FREE' : `$${event.joiningFee.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Description Excerpt */}
        <p className="mb-6 text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 px-2 py-1 rounded-full text-gray-600 text-xs"
            >
              #{tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-600 text-xs">
              +{event.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            href={`/events/${event._id}`}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-white text-sm transition"
          >
            View Details
          </Link>
          
          <div className="text-gray-500 text-sm">
            {event.joiningFee > 0 ? 'Paid Event' : 'Free Entry'}
          </div>
        </div>
      </div>
    </div>
  );
}