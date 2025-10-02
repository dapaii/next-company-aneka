"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecentItem } from "@/lib/dashboard/types";

export const RecentActivityCard: React.FC<{ items: RecentItem[] }> = ({ items }) => (
  <Card className="h-full">
    <CardHeader className="p-5 pb-3">
      <CardTitle className="text-sm font-medium">Aktivitas Terbaru</CardTitle>
    </CardHeader>
    <CardContent className="p-5 pt-0">
      {items.length ? (
        <ul className="divide-y">
          {items.map((it, idx) => (
            <li key={idx} className="py-2 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-sm leading-tight line-clamp-1">{it.title}</span>
                <Badge
                  className="capitalize shrink-0"
                  variant={it.status === "published" ? "default" : it.status === "draft" ? "secondary" : "destructive"}
                >
                  {it.status}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{it.at}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
      )}
    </CardContent>
  </Card>
);
