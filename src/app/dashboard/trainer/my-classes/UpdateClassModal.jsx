"use client";

import { UpdateClass } from "@/lib/actions/Classes";
import { useState } from "react";
import { toast } from "react-toastify";


const CATEGORIES   = ["Yoga", "Cardio", "HIIT", "Strength", "Pilates", "CrossFit", "Boxing", "Cycling"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DAYS         = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inputClass  = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20";
const selectClass = "w-full rounded-xl border border-white/10 bg-[#0F1013] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20";
const labelClass  = "text-xs font-medium text-white/50";

export default function UpdateClassModal({ cls, onSuccess, onClose }) {
  const [isLoading, setIsLoading]     = useState(false);
  const [selectedDays, setSelectedDays] = useState(cls.schedule?.days ?? []);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) { toast.error("Select at least one day"); return; }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const updates = {
      ...cls,
      className:   formData.get("className"),
      category:    formData.get("category"),
      difficulty:  formData.get("difficulty"),
      duration:    formData.get("duration"),
      price:       Number(formData.get("price")),
      description: formData.get("description"),
      schedule: {
        days: selectedDays,
        time: formData.get("time"),
      },
    };

    try {
      await UpdateClass(updates, cls._id);
      onSuccess(updates);
    } catch {
      toast.error("Failed to update class");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#16181C] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="text-base font-semibold text-white">Update Class</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">

          {/* Class Name */}
          <div className="space-y-1.5">
            <label className={labelClass}>Class Name</label>
            <input name="className" required defaultValue={cls.className} className={inputClass} />
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Category</label>
              <select name="category" required defaultValue={cls.category} className={selectClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Difficulty</label>
              <select name="difficulty" required defaultValue={cls.difficulty} className={selectClass}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Duration + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Duration</label>
              <input name="duration" required defaultValue={cls.duration} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Price ($)</label>
              <input name="price" type="number" min="1" required defaultValue={cls.price} className={inputClass} />
            </div>
          </div>

          {/* Days */}
          <div className="space-y-1.5">
            <label className={labelClass}>Schedule Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedDays.includes(day)
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/20 text-[#A78BFA]"
                      : "border-white/10 bg-white/5 text-white/50 hover:text-white"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="space-y-1.5">
            <label className={labelClass}>Class Time</label>
            <input
              name="time"
              type="time"
              required
              defaultValue={cls.schedule?.time}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={cls.description}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-[#8B5CF6] py-2.5 text-sm font-semibold text-white transition hover:bg-[#7C3AED] disabled:opacity-60"
            >
              {isLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}