import { extendVariants, User } from "@heroui/react";

export const UserCard = extendVariants(User, {});

export type UserCardProps = React.ComponentProps<typeof UserCard>;
