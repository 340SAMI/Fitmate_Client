"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { TrashBin } from "@gravity-ui/icons";
import { AlertDialog, Button } from "@heroui/react";
import { deleteForumPost } from "@/lib/actions/forum";
import Link from "next/link";

const roleStyle = {
  trainer: "bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/25",
  admin:   "bg-amber-500/15 text-amber-400 border border-amber-500/25",
};

const avatarStyle = {
  trainer: "bg-[#8B5CF6]/20 text-[#A78BFA]",
  admin:   "bg-amber-500/20 text-amber-400",
};

export default function ForumPostCard({ post, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteForumPost(post._id);
      toast.success("Post deleted!");
      onDelete?.(post._id);
    } catch (err) {
      toast.error(err.message ?? "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  const roleBadge = roleStyle[post.authorRole] ?? "bg-white/5 text-white/50 border border-white/10";
  const avatarBg  = avatarStyle[post.authorRole] ?? "bg-white/10 text-white/60";

  return (
    <div
      className="group grid overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] transition hover:border-white/20 sm:grid-cols-[200px_1fr]"
      style={{ gridTemplateColumns: "180px 1fr", height: "160px" }}
    >

      {/* Image */}
      <div className="relative overflow-hidden bg-white/[0.03]">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex h-full flex-col gap-2.5 overflow-hidden p-5">

        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleBadge}`}>
            {post.authorRole}
          </span>
          <span className="text-xs text-white/35">{formattedDate}</span>
        </div>

        {/* Title */}
        <p className="line-clamp-1 text-[15px] font-semibold leading-snug text-white">
          {post.title}
        </p>

        {/* Description */}
        <p className="line-clamp-2 text-[13px] leading-relaxed text-white/50">
          {post.description}
        </p>

        {/* Bottom row */}
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3">

          {/* Author */}
          <div className="flex items-center gap-2">
            {post.authorImage ? (
              <img
                src={post.authorImage}
                alt={post.authorName}
                className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarBg}`}>
                {post.authorName?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-white/50">{post.authorName}</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href={`/forum/${post._id}`}
              className="rounded-xl bg-[#8B5CF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A78BFA] transition hover:bg-[#8B5CF6] hover:text-white"
            >
              Read More →
            </Link>

            {onDelete && (
              <AlertDialog>
                <Button
                  size="sm"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10"
                >
                  <TrashBin />
                  Delete
                </Button>
                <AlertDialog.Backdrop className="bg-black/70">
                  <AlertDialog.Container className="p-4">
                    <AlertDialog.Dialog className="rounded-2xl border border-white/10 bg-[#16181C] text-white shadow-2xl sm:max-w-[400px]">
                      <AlertDialog.CloseTrigger />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="danger" />
                        <AlertDialog.Heading className="text-white/60">Delete this post?</AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p className="text-sm text-white/60">
                          <strong className="text-white">{post.title}</strong> will be permanently
                          removed and cannot be recovered.
                        </p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="secondary">
                          Cancel
                        </Button>
                        <Button
                          slot="close"
                          variant="danger"
                          isDisabled={isDeleting}
                          onPress={handleDelete}
                        >
                          <TrashBin />
                          {isDeleting ? "Deleting…" : "Yes, delete"}
                        </Button>
                      </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                  </AlertDialog.Container>
                </AlertDialog.Backdrop>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}