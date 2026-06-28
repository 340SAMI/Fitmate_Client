"use client";
import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { createForum } from "@/lib/actions/forum";


const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

export default function AddPageForm({ user }) {
  const [image, setImage] = useState(null);       // uploaded URL
  const [preview, setPreview] = useState(null);   // local preview
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  /* ── imgBB upload ── */
  async function uploadToImgBB(file) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (!data.success) throw new Error("image upload failed");
      return data.data.url;
    } finally {
      setUploading(false);
    }
  }

  async function handleFile(file) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG / JPG files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    const url = await uploadToImgBB(file);
    setImage(url);
    toast.success("Cover image uploaded!");
  }

  /* ── form submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a cover image.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();

    if (!title || !description) return; // HeroUI handles inline errors

    setSubmitting(true);
    try {
      const payload = {
        title,
        image,
        description,
        authorId: user?.id || user?._id,
        authorName: user?.name,
        authorImage: user?.image,
        authorRole: user?.role,
        likes: [],
        dislikes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };

      await createForum(payload);
      toast.success("Post published successfully! 🎉");

      // reset
      e.target.reset();
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ backgroundColor: "#1A1D28", border: "1px solid rgba(255,255,255,0.08)" }}
      />

      <div
        className="min-h-screen flex items-start justify-center px-4 py-12"
        style={{ backgroundColor: "#11131A", fontFamily: "Inter, sans-serif" }}
      >
        <div className="w-full max-w-[70%]">


          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "#1A1D28", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">Post Details</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in the details below to publish to the forum.</p>

            <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>

              {/* Title */}
              <TextField isRequired name="title" className="w-full">
                <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Post Title
                </Label>
                <Input
                  placeholder="e.g. New Feature: Trainer Scheduling is Live"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-[#8B5CDA]"
                  style={{ backgroundColor: "#11131A", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <FieldError className="text-xs text-rose-400 mt-1" />
              </TextField>

              {/* Cover Image */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  Cover Image
                </p>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFile(e.dataTransfer.files[0]);
                  }}
                  className="relative w-full rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 py-10"
                  style={{
                    border: `2px dashed ${dragOver ? "#8B5CDA" : "rgba(255,255,255,0.12)"}`,
                    backgroundColor: dragOver ? "rgba(139,92,218,0.05)" : "#11131A",
                    minHeight: 160,
                  }}
                >
                  {uploading ? (
                    <p className="text-sm text-gray-400 animate-pulse">Uploading…</p>
                  ) : preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="preview"
                      className=" rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <span className="text-4xl">🖼️</span>
                      <p className="text-sm text-center text-gray-500">
                        <span className="text-[#8B5CDA] font-medium">Click to upload</span>{" "}
                        or drag &amp; drop via ImgBB
                      </p>
                      <p className="text-xs text-gray-600">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
              </div>

              {/* Description */}
              <TextField isRequired name="description" className="w-full">
                <Label className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Description
                </Label>
                <textarea
                  name="description"
                  placeholder="Write your post content here..."
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none focus:ring-1 focus:ring-[#8B5CDA]"
                  style={{ backgroundColor: "#11131A", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Inter, sans-serif" }}
                />
                <FieldError className="text-xs text-rose-400 mt-1" />
              </TextField>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="reset"
                  variant="secondary"
                  onPress={() => { setImage(null); setPreview(null); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 border border-white/10 bg-transparent hover:bg-white/5 transition-colors"
                >
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  isDisabled={submitting || uploading}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #8B5CDA, #6D6AFE)" }}
                >
                  {submitting ? "Publishing…" : "Publish Post"}
                </Button>
              </div>

            </Form>
          </div>
        </div>
      </div>
    </>
  );
}