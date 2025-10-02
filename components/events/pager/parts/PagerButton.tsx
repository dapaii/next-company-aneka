"use client";

import { Button } from "@/components/ui/button";

type Props = React.ComponentProps<typeof Button> & { label: string };

export default function PagerButton({
  label,
  variant = "outline",
  size = "sm",
  type = "button",
  ...buttonProps
}: Props) {
  return (
    <Button variant={variant} size={size} type={type} {...buttonProps}>
      {label}
    </Button>
  );
}
