"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const Trend7DaysCard: React.FC<{
  labels: string[]; values: number[]; path: string;
}> = ({ labels, values, path }) => (
  <Card className="h-full overflow-hidden">
    <CardHeader className="p-5 pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Event / 7 hari</CardTitle>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
    </CardHeader>
    <CardContent className="p-5 pt-0">
      <div className="text-2xl font-semibold">{values.reduce((a, b) => a + b, 0)}</div>
      <div className="h-16 -mx-1 mt-1">
        <svg viewBox="0 0 140 40" className="w-full h-full">
          <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2 text-[10px] text-muted-foreground">
        {labels.map((l, i) => <span key={i} className="truncate text-center">{l}</span>)}
      </div>
    </CardContent>
  </Card>
);
