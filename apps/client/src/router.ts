// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/about`
  | `/contact`
  | `/dashboard`
  | `/dashboard/categories`
  | `/dashboard/categories/:categoryId`
  | `/dashboard/magazines`
  | `/dashboard/magazines/:magazineId`
  | `/dashboard/users`
  | `/dashboard/users/:userId`
  | `/login`
  | `/magazines/:magazineId`
  | `/profile`
  | `/register`
  | `/team`;

export type Params = {
  "/dashboard/categories/:categoryId": { categoryId: string };
  "/dashboard/magazines/:magazineId": { magazineId: string };
  "/dashboard/users/:userId": { userId: string };
  "/magazines/:magazineId": { magazineId: string };
};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
