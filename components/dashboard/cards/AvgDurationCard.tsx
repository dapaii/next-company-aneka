"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock4 } from "lucide-react";

export const AvgDurationCard: React.FC<{ hours: number }> = ({ hours }) => (
  <Card className="h-full">
    <CardHeader className="p-5 pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Rata-rata durasi</CardTitle>
        <Clock4 className="h-4 w-4 text-primary" />
      </div>
    </CardHeader>
    <CardContent className="p-5 pt-0">
      <div className="text-3xl font-semibold">{hours}</div>
      <div className="text-xs text-muted-foreground mt-1">jam per event</div>
    </CardContent>
  </Card>
);
