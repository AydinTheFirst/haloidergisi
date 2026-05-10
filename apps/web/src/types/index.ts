export type * from "@repo/db";

import {
  User as BaseUser,
  Profile as BaseProfile,
  Crew as BaseCrew,
  Post as BasePost,
  Category as BaseCategory,
  Theme as BaseTheme,
} from "@repo/db";

export interface List<T> {
  items: T[];
  meta: {
    total: number;
    take: number;
    skip: number;
  };
}

export type QueryRes<T> = List<T>; // backward compatibility

export interface User extends BaseUser {
  profile?: BaseProfile;
  crew?: BaseCrew;
}

export interface Profile extends BaseProfile {
  user?: User;
}

export interface Crew extends BaseCrew {
  users?: User[];
}

export interface Post extends BasePost {
  category?: BaseCategory;
  themes?: {
    id: string;
    work: string;
    category: string;
  }[];
  themeWork?: string;
  themeCategory?: string;
}

export interface Theme extends BaseTheme {
  posts?: Post[];
}
