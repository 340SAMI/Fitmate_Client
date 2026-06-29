// src/app/dashboard/admin/trainer-applications/actions.js
"use server";

import { ApplicationResult } from "@/lib/actions/application";
import { revalidatePath } from "next/cache";

export async function reviewApplication(id, action, feedback) {
  if (!id || !action) return { error: "Missing required fields" };

  if (action === "reject" && !feedback?.trim()) {
    return { error: "Feedback is required when rejecting" };
  }

  const result = await ApplicationResult(id, { action, feedback });

  if (result?.error) return { error: result.error };

  revalidatePath("/dashboard/admin/trainer-applications");
  return { success: true };
}