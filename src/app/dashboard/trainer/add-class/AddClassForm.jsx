"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  TextField,
  FieldError,
} from "@heroui/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createClass } from "@/lib/actions/Classes";

const CATEGORIES = ["Yoga", "Cardio", "HIIT", "Strength", "Pilates", "CrossFit", "Boxing", "Cycling"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inputClass = "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20";
const selectClass = "mt-1.5 w-full rounded-xl border border-white/10 bg-[#0F1013] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20 cursor-pointer";
const labelClass = "text-sm font-medium text-white/70";

export default function AddClassForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
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

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image) { toast.error("Please upload a class image"); return; }
    if (selectedDays.length === 0) { toast.error("Please select at least one day"); return; }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      className:    formData.get("className"),
      image,
      category:     formData.get("category"),
      difficulty:   formData.get("difficulty"),
      duration:     formData.get("duration"),
      schedule: {
        days: selectedDays,
        time: formData.get("time"),
      },
      price:        Number(formData.get("price")),
      description:  formData.get("description"),
      trainerId:    session?.user?.id,
      trainerName:  session?.user?.name,
      status:       "Pending",
      bookingCount: 0,
    };

    try {
      const response = await createClass(payload);
      console.log("response from client", response);
      if (response?.ok === false) throw new Error(response?.message ?? "Failed to create class");
      toast.success("Class submitted for approval!");
      setTimeout(() => router.push("/dashboard/trainer/my-classes"), 1200);
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
        <h1 className="text-2xl font-bold text-white">Add a New Class</h1>
        <p className="mt-1.5 text-sm text-white/40">
          Fill in the details below. Your class will be reviewed by an admin before going live.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <span className={labelClass}>
            Class Image <span className="text-red-400">*</span>
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
                  <p className="text-sm font-medium">Click to upload class image</p>
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

        {/* Class Name */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Class Name <span className="text-red-400">*</span>
          </label>
          <input
            name="className"
            required
            placeholder="e.g. Morning HIIT Blast"
            className={inputClass}
          />
        </div>

        {/* Category + Difficulty */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Category <span className="text-red-400">*</span>
            </label>
            <select name="category" required defaultValue="" className={selectClass}>
              <option value="" disabled>Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Difficulty <span className="text-red-400">*</span>
            </label>
            <select name="difficulty" required defaultValue="" className={selectClass}>
              <option value="" disabled>Select difficulty</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration + Price */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Duration <span className="text-red-400">*</span>
            </label>
            <input
              name="duration"
              required
              placeholder="e.g. 45 mins"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>
              Price ($) <span className="text-red-400">*</span>
            </label>
            <input
              name="price"
              required
              type="number"
              min="1"
              placeholder="e.g. 25"
              className={inputClass}
            />
          </div>
        </div>

        {/* Schedule Days */}
        <div className="flex flex-col gap-2">
          <span className={labelClass}>
            Schedule Days <span className="text-red-400">*</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const active = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/20 text-[#A78BFA]"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
          {selectedDays.length > 0 && (
            <p className="text-xs text-white/35">
              Selected: {selectedDays.join(", ")}
            </p>
          )}
        </div>

        {/* Class Time */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Class Time <span className="text-red-400">*</span>
          </label>
          <input
            name="time"
            required
            type="time"
            className={`${inputClass} [color-scheme:dark]`}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Describe what students will do, what to bring, fitness level requirements..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => { setImage(null); setPreview(null); setSelectedDays([]); }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white sm:w-auto"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full rounded-xl bg-[#8B5CF6] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8B5CF6]/20 transition hover:bg-[#7C3AED] disabled:opacity-60 sm:w-auto"
          >
            {isLoading ? "Submitting…" : isUploading ? "Uploading image…" : "Submit for Approval"}
          </button>
        </div>

      </form>
    </div>
  );
}