'use client'

import Link from 'next/link';
import { Event } from '@/types/event';
import { Calendar, Users, MapPin, DollarSign, Clock, ChevronRight, Star, User, CheckCircle, CalendarDays, Trophy } from 'lucide-react';

interface EventCardProps {
  event: Event;
  showHost?: boolean;
  variant?: 'default' | 'compact';
  showParticipantStatus?: boolean; // নতুন prop
  showEventStats?: boolean; // নতুন prop - My Events পেজের জন্য
}

export default function EventCard({ 
  event, 
  showHost = true, 
  variant = 'default',
  showParticipantStatus = false,
  showEventStats = false
}: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-gradient-to-r from-[#96A78D] to-[#D2C1B6]';
      case 'full': return 'bg-gradient-to-r from-[#234C6A]/80 to-[#234C6A]/60';
      case 'cancelled': return 'bg-gradient-to-r from-white/20 to-white/10';
      case 'completed': return 'bg-gradient-to-r from-white/30 to-white/20';
      default: return 'bg-gradient-to-r from-white/20 to-white/10';
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
      'Music': 'bg-gradient-to-br from-[#96A78D] to-[#D2C1B6]',
      'Sports': 'bg-gradient-to-br from-[#234C6A] to-[#96A78D]',
      'Food': 'bg-gradient-to-br from-[#D2C1B6] to-[#96A78D]',
      'Tech': 'bg-gradient-to-br from-[#234C6A] to-[#D2C1B6]',
      'Art': 'bg-gradient-to-br from-[#D2C1B6] to-[#96A78D]',
      'Education': 'bg-gradient-to-br from-[#234C6A] to-[#96A78D]',
      'Games': 'bg-gradient-to-br from-[#D2C1B6] to-[#234C6A]',
      'Travel': 'bg-gradient-to-br from-[#96A78D] to-[#234C6A]'
    };
    return colors[category] || 'bg-gradient-to-br from-[#234C6A] to-[#96A78D]';
  };

  const isPastEvent = () => {
    const eventDate = new Date(event.date);
    const now = new Date();
    return eventDate < now;
  };

  const getEventStatusBadge = () => {
    if (isPastEvent()) {
      return {
        text: 'Attended',
        color: 'bg-gradient-to-r from-[#96A78D] to-[#234C6A]',
        icon: <CheckCircle className="w-3 h-3" />
      };
    }
    
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffDays = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return {
        text: 'Upcoming',
        color: 'bg-gradient-to-r from-[#D2C1B6] to-[#234C6A]',
        icon: <CalendarDays className="w-3 h-3" />
      };
    }
    
    return {
      text: 'Registered',
      color: 'bg-gradient-to-r from-[#234C6A] to-[#96A78D]',
      icon: <CheckCircle className="w-3 h-3" />
    };
  };

  if (variant === 'compact') {
    return (
      <div className="group bg-gradient-to-br from-white/5 hover:from-white/10 to-white/10 hover:to-white/15 hover:shadow-lg hover:shadow-white/5 backdrop-blur-sm p-4 border border-white/20 rounded-xl hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className={`${getCategoryColor(event.category)} text-white rounded-lg p-3 text-center min-w-[70px] shadow-lg`}>
              <div className="font-bold text-xl">{formatDate(event.date).split(',')[1]?.trim().split(' ')[1] || ''}</div>
              <div className="text-xs uppercase tracking-wider">{formatDate(event.date).split(',')[1]?.trim().split(' ')[0] || ''}</div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={`/events/${event._id}`}>
                  <h3 className="font-semibold text-white group-hover:text-white/90 text-base truncate transition-colors">
                    {event.title}
                  </h3>
                </Link>
                <p className="flex items-center gap-1 text-white/60 text-sm truncate">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)} text-white`}>
                  {event.status.toUpperCase()}
                </div>
                {showParticipantStatus && (
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getEventStatusBadge().color} text-white`}>
                    {getEventStatusBadge().icon}
                    {getEventStatusBadge().text}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{event.currentParticipants}/{event.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span className={event.joiningFee === 0 ? 'text-[#96A78D] font-medium' : 'text-white'}>
                    {event.joiningFee === 0 ? 'Free' : `$${event.joiningFee}`}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-gradient-to-br from-white/5 hover:from-white/10 to-white/10 hover:to-white/15 hover:shadow-white/5 hover:shadow-xl backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
      {/* Header with image and status */}
      <div className="relative h-48 overflow-hidden">
        {event.image ? (
          <div className="relative w-full h-full">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className={`flex justify-center items-center w-full h-full ${getCategoryColor(event.category)}`}>
            <div className="text-white/90 text-4xl">
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
        
        {/* Top overlay */}
        <div className="top-0 right-0 left-0 absolute flex justify-between items-start p-4">
          <div className="flex flex-col gap-2">
            <div className={`${getCategoryColor(event.category)} text-white px-3 py-1.5 rounded-full text-xs font-semibold inline-block w-fit shadow-lg`}>
              {event.category}
            </div>
            <div className={`${getStatusColor(event.status)} px-3 py-1.5 rounded-full text-xs font-semibold text-white inline-block w-fit`}>
              {event.status.toUpperCase()}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="bg-black/40 shadow-lg backdrop-blur-sm p-3 rounded-xl text-center">
              <div className="font-bold text-white text-xl">{formatDate(event.date).split(',')[1]?.trim().split(' ')[1] || ''}</div>
              <div className="text-white/70 text-xs uppercase tracking-wider">{formatDate(event.date).split(',')[1]?.trim().split(' ')[0] || ''}</div>
              <div className="mt-1 text-white/60 text-xs">{formatDate(event.date).split(',')[0]}</div>
            </div>
            
            {/* Participant Status Badge */}
            {showParticipantStatus && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold ${getEventStatusBadge().color} text-white shadow-lg`}>
                {getEventStatusBadge().icon}
                {getEventStatusBadge().text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Event title and host */}
        <div className="mb-4">
          <Link href={`/events/${event._id}`}>
            <h3 className="mb-2 font-bold text-white hover:text-[#D2C1B6] text-xl line-clamp-1 transition-colors">
              {event.title}
            </h3>
          </Link>
          
          <p className="mb-4 text-white/70 text-sm line-clamp-2">
            {event.description}
          </p>

          {showHost && event.host && (
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
              <div className="relative">
                <div className="bg-gradient-to-r from-[#234C6A] to-[#96A78D] p-0.5 rounded-full w-9 h-9">
                  {event.host.avatar ? (
                    <img
                      src={event.host.avatar}
                      alt={event.host.name}
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center bg-white/10 rounded-full w-full h-full">
                      <User className="w-4 h-4 text-white/80" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white/80 text-sm">Hosted by {event.host.name}</p>
                {event.host.rating && (
                  <p className="flex items-center gap-1.5 text-white/60 text-xs">
                    <Star className="fill-[#D2C1B6] w-3 h-3 text-[#D2C1B6]" />
                    {event.host.rating.toFixed(1)}
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">{event.host.totalEvents || 0} events</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Event Stats for My Events Page */}
          {showEventStats && (
            <div className="bg-gradient-to-r from-white/10 to-transparent mt-4 p-4 border border-white/10 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                    <Trophy className="w-4 h-4 text-[#D2C1B6]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Your Participation</p>
                    <p className="font-medium text-white text-sm">
                      Joined {new Date(event.participationDate || event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">Payment Status</p>
                  <p className={`font-bold text-sm ${event.joiningFee === 0 ? 'text-[#96A78D]' : 'text-[#D2C1B6]'}`}>
                    {event.joiningFee === 0 ? 'FREE' : `Paid $${event.joiningFee}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event details grid */}
        <div className="gap-3 grid grid-cols-2 mb-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <div className="flex justify-center items-center bg-white/10 backdrop-blur-sm rounded-lg w-9 h-9">
              <Clock className="w-4 h-4 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs">Time</p>
              <p className="font-medium text-white text-sm">{event.time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <div className="flex justify-center items-center bg-white/10 backdrop-blur-sm rounded-lg w-9 h-9">
              <MapPin className="w-4 h-4 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs">Location</p>
              <p className="font-medium text-white text-sm truncate">{event.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <div className="flex justify-center items-center bg-white/10 backdrop-blur-sm rounded-lg w-9 h-9">
              <DollarSign className="w-4 h-4 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs">Fee</p>
              <p className={`font-semibold text-sm ${event.joiningFee === 0 ? 'text-[#96A78D]' : 'text-white'}`}>
                {event.joiningFee === 0 ? 'FREE' : `$${event.joiningFee.toFixed(2)}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <div className="flex justify-center items-center bg-white/10 backdrop-blur-sm rounded-lg w-9 h-9">
              <Users className="w-4 h-4 text-white/80" />
            </div>
            <div>
              <p className="text-white/60 text-xs">Participants</p>
              <p className="font-medium text-white text-sm">
                {event.currentParticipants}/{event.maxParticipants}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white/80 text-xs transition-colors"
            >
              #{tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="bg-white/10 px-3 py-1 rounded-full text-white/60 text-xs">
              +{event.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action button */}
        <div className="pt-4 border-white/10 border-t">
          <Link
            href={`/events/${event._id}`}
            className="group/btn flex justify-center items-center gap-2 bg-gradient-to-r from-[#234C6A]/40 hover:from-[#234C6A]/60 to-[#96A78D]/40 hover:to-[#96A78D]/60 hover:shadow-[#96A78D]/10 hover:shadow-lg px-6 py-3 border border-white/20 hover:border-white/30 rounded-xl w-full font-semibold text-white text-sm transition-all duration-300"
          >
            View Event Details
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}