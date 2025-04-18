import type { InputProps } from "@heroui/react";

import { Input } from "@heroui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export const PasswordInput = (props: InputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const endContent = (
    <button
      onClick={toggleVisibility}
      type='button'
    >
      {isVisible ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <Input
      endContent={endContent}
      isRequired
      label={props.label || "Şifre"}
      name='password'
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
};
