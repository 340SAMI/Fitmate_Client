"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { TrashBin } from "@gravity-ui/icons";
import { AlertDialog, Button } from "@heroui/react";
import { deleteForumPost } from "@/lib/actions/forum";
import Link from "next/link";

const roleStyle = {
  trainer: "bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/25",
  admin: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
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
      toast.error(err?.message ?? "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const roleBadge = roleStyle[post.authorRole] ?? "bg-white/5 text-white/50 border border-white/10";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] transition hover:border-[#8B5CF6]/40 hover:shadow-xl hover:shadow-black/30">
      <div className="relative h-48 w-full overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/20"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/20 px-3 py-1 text-xs font-semibold text-[#C4B5FD]">
          {post.category ?? "Forum"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleBadge}`}>
            {post.authorRole ?? "member"}
          </span>
          <span className="text-xs text-white/35">{formattedDate}</span>
        </div>

        <h3 className="text-base font-bold leading-snug text-white line-clamp-1">
          {post.title}
        </h3>

        <p className="text-xs text-white/45">
          by <span className="font-medium text-white/70">{post.authorName}</span>
        </p>

        <p className="text-sm leading-relaxed text-white/60 line-clamp-3">
          {post.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-white">{post.authorRole ?? "Member"}</span>
            <span className="text-xs text-white/35">{post.category ?? "Community"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/forum/${post._id}`}
              className="rounded-xl bg-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7C3AED]"
            >
              View Details
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
                <AlertDialog.Backdrop className="bg-black/60">
                  <AlertDialog.Container className="p-2 sm:p-3">
                    <AlertDialog.Dialog className="rounded-xl border border-white/10 bg-[#111317] text-white shadow-lg sm:max-w-[380px]">
                      <AlertDialog.CloseTrigger className="text-white/50 hover:text-white" />
                      <AlertDialog.Header className="gap-2 px-4 pt-4">
                        <AlertDialog.Icon status="danger" />
                        <AlertDialog.Heading className="text-sm font-semibold text-white">
                          Delete this post?
                        </AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body className="px-4 py-2">
                        <p className="text-sm leading-6 text-white/70">
                          <strong className="text-white">{post.title}</strong> will be permanently
                          removed and cannot be recovered.
                        </p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer className="flex justify-end gap-2 px-4 pb-4 pt-2">
                        <Button slot="close" variant="tertiary" className="border border-white/10 bg-white/5 text-white hover:bg-white/10">
                          Cancel
                        </Button>
                        <Button
                          slot="close"
                          variant="danger"
                          isDisabled={isDeleting}
                          onPress={handleDelete}
                          className="bg-red-500/90 text-white hover:bg-red-500"
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
