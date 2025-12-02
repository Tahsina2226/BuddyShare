export interface Participant {
    _id: string;
    name: string;
    avatar?: string;
    email: string;
    location: string;
    interests: string[];
  }
  
  export interface EventDetails extends Event {
    participants: Participant[];
    canJoin?: {
      canJoin: boolean;
      reasons: string[];
    };
  }