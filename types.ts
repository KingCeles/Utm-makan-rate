export interface Review {
  id: string;
  restaurantId: string;
  userId: string; // The student ID (hidden if anonymous)
  rating: number; // 1-5
  comment: string;
  isAnonymous: boolean;
  timestamp: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Restaurant {
  id: string;
  name: string;
  description: string; // AI generated or user provided
  cuisine: string[]; // e.g., "Malay", "Western", "Spicy"
  location: string;
  imageUrl: string;
  reviews: Review[];
  averageRating: number;
}

export interface User {
  studentId: string;
  email: string;
  role: 'admin' | 'student';
  isLoggedIn: boolean;
  isVerified: boolean;
}

export type PageView = 'HOME' | 'DETAILS' | 'LOGIN';
