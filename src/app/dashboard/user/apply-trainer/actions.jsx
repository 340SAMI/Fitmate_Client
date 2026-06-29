// src/app/dashboard/user/apply-trainer/actions.js
"use server";

import { AddApplication } from "@/lib/actions/application";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData) {
  const experience = formData.get("experience");
  const specialty = formData.get("specialty");
  const certifications = formData.get("certifications");
  const bio = formData.get("bio");

  if (!experience || !specialty) {
    return { error: "Experience and specialty are required" };
  }

  const result = await AddApplication({
    experience: Number(experience),
    specialty,
    certifications,
    bio,
  });

  if (result?.error) {
    return { error: result.error };
  }

  revalidatePath("/dashboard/user/apply-trainer");
  return { success: true };
}