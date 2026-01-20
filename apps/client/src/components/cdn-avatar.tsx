import { Avatar, type AvatarProps } from "@heroui/react";

import { CDN_URL } from "~/config";

export default function CdnAvatar(props: AvatarProps) {
  const newProps = {
    ...props,
    src: new URL(props.src || "", CDN_URL).href,
  } as AvatarProps;

  return <Avatar {...newProps} />;
}
