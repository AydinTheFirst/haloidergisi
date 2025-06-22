import { Button, ButtonProps } from "@react-email/components";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/utils";

const buttonStyles = cva("rounded text-center", {
  variants: {
    variant: {
      primary: "bg-blue-500 text-white ",
      secondary: "bg-gray-300 text-gray-900"
    },
    size: {
      sm: "text-sm px-3 py-1",
      md: "text-md px-4 py-2",
      lg: "text-lg px-5 py-3"
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "md"
  }
});

export interface StyledButtonProps
  extends ButtonProps,
    VariantProps<typeof buttonStyles> {}

export function StyledButton({ variant, size, ...rest }: StyledButtonProps) {
  return (
    <Button
      {...rest}
      className={cn(buttonStyles({ variant, size }), rest.className)}
    />
  );
}
