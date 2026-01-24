import { cn } from "@adn-ui/react";

import { getCdnUrl } from "@/utils/cdn";

interface CdnImageProps extends React.ComponentProps<"img"> {
  src: string;
  alt: string;
}

export default function CdnImage({ src, className, alt, ...props }: CdnImageProps) {
  return (
    <img
      src={getCdnUrl(src)}
      className={cn("w-full h-auto object-cover rounded shadow", className)}
      alt={alt}
      {...props}
    />
  );
}
