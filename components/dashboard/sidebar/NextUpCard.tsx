"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// NOTE: kalau tipe kamu sudah dipindah ke "@/types/events", tinggal ubah import ini.
import type { EventDto } from "@/lib/dashboard/types";
import { formatDateTime } from "@/lib/dashboard/time";

export const NextUpCard: React.FC<{ upcoming: EventDto | null }> = ({ upcoming }) => (
  <Card className="h-full w-full max-w-full overflow-hidden">
    <CardHeader className="p-4 sm:p-5 pb-2 sm:pb-3">
      <CardTitle className="text-sm font-medium">Next Up</CardTitle>
    </CardHeader>

    <CardContent className="p-4 sm:p-5 pt-0">
      {upcoming ? (
        <div className="space-y-3 sm:space-y-3.5">
          {/* Title + slug */}
          <div className="space-y-1.5 min-w-0">
            <div className="text-[15px] sm:text-base font-semibold leading-tight line-clamp-2 break-words">
              {upcoming.title}
            </div>
            <div className="text-[11px] sm:text-xs text-muted-foreground truncate break-all">
              @{upcoming.slug}
            </div>
          </div>

          {/* Meta as definition list, kolom kiri label, kanan konten */}
          <dl className="grid grid-cols-[auto,1fr] items-start gap-x-2 gap-y-1.5 text-xs sm:text-sm">
            <dt className="font-medium">Waktu</dt>
            <dd className="text-muted-foreground min-w-0 break-words">
              <span className="block sm:inline">{formatDateTime(upcoming.startsAt)}</span>
              <span className="hidden sm:inline"> — </span>
              <span className="block sm:inline">{formatDateTime(upcoming.endsAt)}</span>
            </dd>

            {upcoming.location && (
              <>
                <dt className="font-medium">Lokasi</dt>
                <dd className="text-muted-foreground min-w-0 break-words line-clamp-2">
                  {upcoming.location}
                </dd>
              </>
            )}

            <dt className="font-medium">Status</dt>
            <dd>
              <Badge
                className="capitalize mt-0.5 w-fit h-5 px-2 text-[10px]"
                variant={
                  upcoming.status === "published" ? "default" :
                  upcoming.status === "draft"     ? "secondary" : "destructive"
                }
              >
                {upcoming.status}
              </Badge>
            </dd>
          </dl>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-muted-foreground">Tidak ada event mendatang.</p>
      )}
    </CardContent>
  </Card>
);
