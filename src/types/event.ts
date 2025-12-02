export interface Event {
    _id: string;
    title: string;
    description: string;
    eventType: string;
    date: string;
    time: string;
    location: string;
    address: string;
    host: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
      rating?: number;
    };
    participants: string[];
    maxParticipants: number;
    currentParticipants: number;
    joiningFee: number;
    image?: string;
    status: 'open' | 'full' | 'cancelled' | 'completed';
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface EventFilters {
    keyword?: string;
    category?: string;
    eventType?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    minFee?: number;
    maxFee?: number;
    minParticipants?: number;
    maxParticipants?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
  
  export interface EventSearchResponse {
    success: boolean;
    data: {
      events: Event[];
      filters: {
        categories: string[];
        locations: string[];
        eventTypes: string[];
      };
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }