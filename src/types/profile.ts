export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'host' | 'admin';
    avatar?: string;
    bio?: string;
    interests: string[];
    location: string;
    rating?: number;
    totalReviews?: number;
    isVerified: boolean;
    createdAt: string;
  }
  
  export interface ProfileFormData {
    name: string;
    bio: string;
    location: string;
    interests: string[];
    avatar?: string;
  }