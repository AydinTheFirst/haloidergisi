export interface IUser {
  id: string;
  displayName: string;
  email: string;
  password: string;
  token: string;
  createdAt: number;
  role: string;
  isAdmin: boolean;
  avatar?: string;
  bio?: string;
  website?: string;
  squadId?: number;
}

export interface IMagazine {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail: string;
  file: string;
  timestamp: string;
  status: "published" | "draft";
}

export interface ICategory {
  id: string;
  title: string;
  description: string;
}
