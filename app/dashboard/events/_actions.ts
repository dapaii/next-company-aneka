// app/(dashboard)/events/_actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/dashboard/events");
}
