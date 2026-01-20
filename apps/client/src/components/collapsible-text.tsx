import { useEffect, useState } from "react";

import { useMediaQuery } from "~/hooks/use-media-query";

export const CollapsibleText = ({ text }: { text: string }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isExpanded, setIsExpanded] = useState(false);
  const previewLimit = 255;

  const toggleText = () => setIsExpanded(!isExpanded);
  const shouldShowButton = text.length > previewLimit;

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  return (
    <div className="w-full">
      <p className="break-words whitespace-pre-line text-neutral-700">
        {isExpanded ? text : `${text.substring(0, previewLimit)}...`}
      </p>

      {shouldShowButton && (
        <button className="mt-2 text-sm font-medium hover:underline" onClick={toggleText}>
          {isExpanded ? "Daha Az Göster" : "Devamını Oku"}
        </button>
      )}
    </div>
  );
};
