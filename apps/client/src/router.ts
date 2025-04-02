// Generouted, changes to this file will be overridden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/:magazines/:magazineId`
  | `/about`
  | `/account`
  | `/contact`
  | `/dashboard`
  | `/dashboard/categories`
  | `/dashboard/categories/:categoryId`
  | `/dashboard/news`
  | `/dashboard/news/:newsId`
  | `/dashboard/posts`
  | `/dashboard/posts/:postId`
  | `/dashboard/squads`
  | `/dashboard/squads/:squadId`
  | `/dashboard/users`
  | `/dashboard/users/:userId`
  | `/login`
  | `/register`
  | `/team`;

export type Params = {
  "/:magazines/:magazineId": { magazines: string; magazineId: string };
  "/dashboard/categories/:categoryId": { categoryId: string };
  "/dashboard/news/:newsId": { newsId: string };
  "/dashboard/posts/:postId": { postId: string };
  "/dashboard/squads/:squadId": { squadId: string };
  "/dashboard/users/:userId": { userId: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
