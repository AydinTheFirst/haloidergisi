import { Button, Input, type InputProps } from "@heroui/react";
import { LucideEye, LucideEyeOff } from "lucide-react";
import React from "react";

export default function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const handleToggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const endContent = (
    <Button isIconOnly onPress={handleToggleVisibility} size="sm" type="button" variant="light">
      {isVisible ? <LucideEye size={20} /> : <LucideEyeOff size={20} />}
    </Button>
  );

  return <Input {...props} endContent={endContent} type={isVisible ? "text" : "password"} />;
}
