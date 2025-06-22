import { Image, type ImageProps } from "@heroui/react";
import { CDN_URL } from "~/config";

export default function CdnImage(props: ImageProps) {
  const newProps = {
    ...props,
    loading: "lazy",
    src: new URL(props.src || "", CDN_URL).href
  } as ImageProps;

  return <Image {...newProps} />;
}
