export interface EventFormData {
    title: string;
    description: string;
    eventType: 'concert' | 'hiking' | 'dinner' | 'games' | 'sports' | 'tech' | 'art' | 'education' | 'other';
    date: string;
    time: string;
    location: string;
    address: string;
    maxParticipants: number;
    joiningFee: number;
    category: string;
    tags: string[];
    image?: string;
  }
  
  export const EVENT_TYPES = [
    { value: 'concert', label: '🎵 Concert' },
    { value: 'hiking', label: '🥾 Hiking' },
    { value: 'dinner', label: '🍽️ Dinner' },
    { value: 'games', label: '🎮 Games' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'tech', label: '💻 Tech' },
    { value: 'art', label: '🎨 Art' },
    { value: 'education', label: '📚 Education' },
    { value: 'other', label: '🎪 Other' }
  ];
  
  export const EVENT_CATEGORIES = [
    'Music', 'Sports', 'Food & Drink', 'Tech', 'Art & Culture', 
    'Outdoor', 'Games', 'Education', 'Wellness', 'Business', 'Social'
  ];