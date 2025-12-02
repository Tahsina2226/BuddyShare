export interface DashboardStats {
  hostedEvents: number;
  joinedEvents: number;
  upcomingEvents: number;
  totalSpent: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface UserEvent {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  joiningFee: number;
  currentParticipants: number;
  maxParticipants: number;
  host?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingEvents: UserEvent[];
  recentEvents: UserEvent[];
  hostedEvents: UserEvent[];
}
