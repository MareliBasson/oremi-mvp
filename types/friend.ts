export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthday?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface FriendInput {
  name: string;
  email?: string;
  phone?: string;
  birthday?: string;
  notes?: string;
}
