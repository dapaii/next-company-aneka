"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const PublicationRateCard: React.FC<{
  pubRate: number; published: number; total: number;
}> = ({ pubRate, published, total }) => (
  <Card className="h-full">
    <CardHeader className="p-5 pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Tingkat Publikasi</CardTitle>
        <Badge variant="secondary" className="text-[11px] px-2 py-0.5">{pubRate}%</Badge>
      </div>
    </CardHeader>
    <CardContent className="p-5 pt-0 space-y-3">
      <Progress value={pubRate} />
      <p className="text-xs text-muted-foreground">{published} dari {total} event sudah dipublikasikan.</p>
    </CardContent>
  </Card>
);
