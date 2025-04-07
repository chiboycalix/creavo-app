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
  user: User;
  content: string;
  timestamp: string;
  date?: string;
  image?: string;
  reactions: {
    likes: number;
    loves: number;
  };
}
