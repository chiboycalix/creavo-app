export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Reaction {
  type: "like" | "love" | "comment";
  count: number;
}

export interface Message {
  id: string;
  mId: string;
  content: string;
  image?: string | null;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  reactions: {
    likes: number;
    loves: number;
  };
  date?: string;
}
