import {
  User as BaseUser,
  Profile as BaseProfile,
  Crew as BaseCrew,
  Post as BasePost,
  Category as BaseCategory,
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
}
