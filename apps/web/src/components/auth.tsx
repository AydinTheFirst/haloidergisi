import { Button, ButtonProps } from "@adn-ui/react";
import { Icon } from "@iconify/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import apiClient from "@/lib/api-client";

interface GoogleAuthButtonProps extends ButtonProps {
  action?: "login" | "link";
}

export const GoogleAuthButton = ({ action = "login", ...props }: GoogleAuthButtonProps) => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        if (action === "login") {
          const { data } = await apiClient.post<{ token: string }>("/auth/google/callback", {
            code,
          });
          localStorage.setItem("token", data.token);
          await router.navigate({ to: "/" });
        } else {
          await apiClient.post("/auth/google/link", { code });
          toast.success("Google hesabınız başarıyla bağlandı.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Google login error:", error.message);
        }

        toast.error(apiClient.resolveApiError(error).message);
      }
    },
    onError(errorResponse) {
      toast.error(errorResponse.error, {
        description: errorResponse.error_description,
      });
    },
    flow: "auth-code",
  });

  return (
    <Button
      variant='outline'
      {...props}
      onClick={() => login()}
    >
      <Icon icon='flat-color-icons:google' />
      Google ile Devam Et
    </Button>
  );
};
