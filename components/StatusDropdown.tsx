// components/events/StatusDropdown.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type EventStatus = "draft" | "published" | "archived";

type Props = {
  id: string;
  current: EventStatus;
};

export default function StatusDropdown({ id, current }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function update(to: EventStatus) {
    if (to === current) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: to }),
        });
        if (!res.ok) {
          alert("Gagal update status");
          return;
        }
        router.refresh();
      } catch (e) {
        console.error(e);
        alert("Network error");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={isPending}>
          Status: <span className="capitalize">{current}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); update("draft"); }}>
          draft
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); update("published"); }}>
          published
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); update("archived"); }}>
          archived
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
