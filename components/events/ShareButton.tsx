"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof Button>;

export default function ShareButton(props: ButtonProps) {
  const [ok, setOk] = React.useState(false);

  async function onShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }
    } catch {
      // no-op
    }
  }

  return (
    <Button onClick={onShare} {...props}>
      {ok ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
      {ok ? "Tersalin!" : "Bagikan"}
    </Button>
  );
}
