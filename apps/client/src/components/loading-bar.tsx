import { Progress } from "@heroui/react";
import { useNavigation, useRevalidator } from "react-router";

export default function LoadingBar() {
  const navigation = useNavigation();
  const revalidator = useRevalidator();

  const isLoading = navigation.state === "loading" || revalidator.state === "loading";

  return (
    <Progress
      aria-label="Loading progress bar"
      className="fixed top-0 right-0 left-0 z-50 h-1.5"
      hidden={!isLoading}
      isIndeterminate
      radius="none"
    />
  );
}
