"use client";

import { useState } from "react";
import { Check } from "@gravity-ui/icons";
import { Button, Form, Input, Label, TextField, FieldError } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createForum } from "@/lib/actions/forum";

const inputClass = "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20";
const labelClass = "text-sm font-medium text-white/70";

export default function AddForumPostForm({session}) {
  
  const router = useRouter();

  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res  = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        setImage(data.data.url);
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed.");
        setPreview(null);
      }
    } catch {
      toast.error("Network error during upload.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image) { toast.error("Please upload a cover image"); return; }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      title:       formData.get("title"),
      image,
      description: formData.get("description"),
      authorId:    session?.id,
      authorName:  session?.name,
      authorImage: session?.image ?? null,
      authorRole:  session?.role,
      likes:       [],
      dislikes:    [],
      comments:    [],
      createdAt:   new Date().toISOString(),
    };

    console.log("check session",payload)

    try {

      const data = await createForum(payload)
      if (!data.insertedId) throw new Error(data.message ?? "Failed to create post");
      toast.success("Post published!");
      setTimeout(() => router.push("/dashboard/trainer/my-posts"), 1200);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add Forum Post</h1>
        <p className="mt-1.5 text-sm text-white/40">
          Share your knowledge with the community.
        </p>
      </div>

      <Form className="flex flex-col gap-6" onSubmit={onSubmit}>

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <span className={labelClass}>
            Cover Image <span className="text-red-400">*</span>
          </span>
          <label className="group cursor-pointer">
            <div className={`relative flex h-52 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
              preview
                ? "border-[#8B5CF6]/40"
                : "border-white/10 hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/5"
            } bg-white/[0.02]`}>
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <p className="text-sm font-semibold text-white">Click to change</p>
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8B5CF6] border-t-transparent" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/30 transition group-hover:text-[#8B5CF6]/60">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  <p className="text-sm font-medium">Click to upload cover image</p>
                  <p className="text-xs text-white/20">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Title */}
        <TextField isRequired name="title">
          <Label className={labelClass}>
            Title <span className="text-red-400">*</span>
          </Label>
          <Input
            placeholder="e.g. 5 Recovery Tips Every Athlete Should Know"
            className={inputClass}
          />
          <FieldError className="mt-1 text-xs text-red-400" />
        </TextField>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={6}
            placeholder="Write your post content here. Share tips, insights, or experiences with the community..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="border-t border-white/5" />

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="reset"
            onClick={() => { setImage(null); setPreview(null); }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white sm:w-auto"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8B5CF6]/20 transition hover:bg-[#7C3AED] disabled:opacity-60 sm:w-auto"
          >
            <Check />
            {isLoading ? "Publishing…" : isUploading ? "Uploading…" : "Publish Post"}
          </button>
        </div>

      </Form>
    </div>
  );
}