export interface User {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
  location: string;
  interests: string[];
  bio?: string;
  averageRating?: number;
  totalReviews?: number;
  eventsHosted?: number;
  role?: "user" | "host" | "admin";
  isVerified?: boolean;
}

export interface Participant extends User {
  // Participant specific fields can be added here if needed
}

export interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Host extends User {
  eventsHosted?: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  eventType: string;
  category: string;
  joiningFee: number;
  maxParticipants: number;
  currentParticipants: number;
  image?: string;
  status: string;
  tags: string[];
  host: Host;
  duration?: string;
  hostName: string;
  hostEmail: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventDetails extends Event {
  participants: Participant[];
  canJoin?: {
    canJoin: boolean;
    reasons: string[];
  };
  reviews?: Review[];
}

export interface ReviewSubmission {
  rating: number;
  comment: string;
  hostId: string;
}

export interface ReviewUpdate extends Partial<ReviewSubmission> {
  _id: string;
}

export interface ReviewCheckResponse {
  success: boolean;
  data: {
    review: Review | null;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
  };
}

export interface EventResponse {
  success: boolean;
  data: {
    event: EventDetails;
  };
}

export interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CanJoinResponse {
  success: boolean;
  data: {
    canJoin: boolean;
    reasons: string[];
  };
}

export interface JoinEventResponse {
  success: boolean;
  message: string;
  data: {
    event: EventDetails;
  };
}

export interface LeaveEventResponse {
  success: boolean;
  message: string;
  data: {};
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: Review;
  };
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
  data: {};
}

// Filter and search interfaces
export interface EventFilters {
  category?: string;
  eventType?: string;
  location?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
}

// For event creation/update
export interface EventFormData {
  title: string;
  description: string;
  eventType: string;
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

// For user profile
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  bio?: string;
  interests: string[];
  role: "user" | "host" | "admin";
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  eventsHosted: number;
  createdAt: string;
  updatedAt: string;
  
  // Statistics
  upcomingEvents?: number;
  pastEvents?: number;
  totalParticipants?: number;
  reviews?: Review[];
}

// For event statistics
export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalParticipants: number;
  averageRating: number;
  totalReviews: number;
}

// For host dashboard
export interface HostDashboard {
  events: Event[];
  stats: EventStats;
  recentReviews: Review[];
  upcomingEvents: Event[];
}