import { useState } from "react";

export const CollapsibleText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewLimit = 255;

  const toggleText = () => setIsExpanded(!isExpanded);
  const shouldShowButton = text.length > previewLimit;

  return (
    <div className='w-full'>
      <p className='whitespace-pre-line break-words text-neutral-700'>
        {isExpanded ? text : `${text.substring(0, previewLimit)}...`}
      </p>

      {shouldShowButton && (
        <button
          className='mt-2 text-sm font-medium text-blue-600 hover:underline'
          onClick={toggleText}
        >
          {isExpanded ? "Daha Az Göster" : "Devamını Oku"}
        </button>
      )}
    </div>
  );
};
