import { Image, type ImageProps } from "@heroui/react";

export default function Logo(props: ImageProps) {
  const newProps = {
    ...props,
    alt: "Halo Logo",
    src: "/halo-light.png"
  } as ImageProps;

  return <Image {...newProps} />;
}
