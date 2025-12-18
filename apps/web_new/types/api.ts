export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

export interface Film {
  filmId: string; // BigInt serialized to string
  filmName: string;
  englishName?: string;
  introduction?: string;
  directors?: string;
  performers?: string;
  onTime?: string;
  filmTime?: string;
  poster?: string; // from relation or mapped
  // Additional fields commonly used in frontend but might need mapping
  genres?: string[];
  areas?: string[];
  tickets?: number;
  revenue?: string;
}

export interface Arrange {
  arrangeId: string; // BigInt
  filmId?: string;
  roomId?: number;
  date?: string;
  start?: string;
  end?: string;
  price?: number;
  film?: Film;
  filmroom?: {
    roomId: number;
    roomName?: string;
  };
}

export interface User {
  userId: number;
  userName: string;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  // Don't include password
}
