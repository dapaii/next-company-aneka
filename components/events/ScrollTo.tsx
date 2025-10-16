"use client";

import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;
type Props = { targetId: string } & ButtonProps;

export default function ScrollTo({ targetId, ...btn }: Props) {
  const onClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return <Button onClick={onClick} {...btn} />;
}
