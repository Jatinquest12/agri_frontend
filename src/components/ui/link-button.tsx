import Link from "next/link";
import type { ComponentProps } from "react";

import { buttonClasses } from "@/components/ui/button";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={buttonClasses({ variant, size, className: className as string })}
    />
  );
}
