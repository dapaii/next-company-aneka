"use client";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import AnimatedStatCardMagnetic from "@/components/motion/AnimatedStatCardMagnetic";
import { CheckCircle2, FilePenLine, Archive as ArchiveIcon } from "lucide-react";

export const StatCardRow: React.FC<{
  published: number; draft: number; archived: number;
}> = ({ published, draft, archived }) => (
  <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[1fr]">
    <StaggerItem>
      <AnimatedStatCardMagnetic
        className="h-full"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        label="Published"
        value={published}
        borderClass="border-emerald-200/60 dark:border-emerald-900/40"
        hint="Event yang sudah tayang."
      />
    </StaggerItem>
    <StaggerItem>
      <AnimatedStatCardMagnetic
        className="h-full"
        icon={<FilePenLine className="h-4 w-4 text-amber-600" />}
        label="Draft"
        value={draft}
        borderClass="border-amber-200/60 dark:border-amber-900/40"
        hint="Masih dalam proses penyusunan."
      />
    </StaggerItem>
    <StaggerItem>
      <AnimatedStatCardMagnetic
        className="h-full"
        icon={<ArchiveIcon className="h-4 w-4 text-rose-600" />}
        label="Archived"
        value={archived}
        borderClass="border-rose-200/60 dark:border-rose-900/40"
        hint="Event yang sudah diarsipkan."
      />
    </StaggerItem>
  </StaggerContainer>
);
