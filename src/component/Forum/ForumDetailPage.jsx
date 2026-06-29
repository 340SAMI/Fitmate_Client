"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ForumDetailPage({ post: initialPost, user }) {
  const [post, setPost] = useState(initialPost);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const userId = user?.id;
  const hasLiked = post?.likes?.includes(userId);
  const hasDisliked = post?.dislikes?.includes(userId);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

const handleLike = async () => {
  if (!userId) { toast.error("Please sign in to vote"); return; }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/${post._id}/like`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    

    if (res.status === 403) {
      console.log(res.status)
      const data = await res.json();
      console.log(data)
      toast.error(data.error);
      return;
    }

    if (!res.ok) throw new Error();

    setPost((prev) => ({
      ...prev,
      likes: hasLiked
        ? prev.likes.filter((id) => id !== userId)
        : [...(prev.likes ?? []), userId],
      dislikes: prev.dislikes?.filter((id) => id !== userId) ?? [],
    }));
  } catch {
    toast.error("Failed to update like");
  }
};

const handleDislike = async () => {
  if (!userId) { toast.error("Please sign in to vote"); return; }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/${post._id}/dislike`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.status === 403) {
      console.log(res.status)
      const data = await res.json();
      toast.error(data.error);
      return;
    }

    if (!res.ok) throw new Error();

    setPost((prev) => ({
      ...prev,
      dislikes: hasDisliked
        ? prev.dislikes.filter((id) => id !== userId)
        : [...(prev.dislikes ?? []), userId],
      likes: prev.likes?.filter((id) => id !== userId) ?? [],
    }));
  } catch {
    toast.error("Failed to update dislike");
  }
};

  const handleComment = async () => {
    if (!userId) { toast.error("Please sign in to comment"); return; }
    if (!commentText.trim()) { toast.error("Comment cannot be empty"); return; }
    setIsCommenting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/${post._id}/comment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName: user.name,
          userImage: user.image,
          text: commentText.trim(),
        }),
      });
      const newComment = await res.json();
      if (!res.ok) throw new Error(newComment.error);
      setPost((prev) => ({ ...prev, comments: [...(prev.comments ?? []), newComment] }));
      setCommentText("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err.message ?? "Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/${post._id}/comment/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: editText.trim(), userId }),
        }
      );
      if (!res.ok) throw new Error();
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, text: editText.trim() } : c
        ),
      }));
      setEditingId(null);
      toast.success("Comment updated!");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/${post._id}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) throw new Error();
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      toast.success("Comment deleted!");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const roleBadgeClass = {
    trainer: "bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/25",
    admin: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  }[post?.authorRole] ?? "bg-white/5 text-white/50 border border-white/10";

  return (
    <div className="min-h-screen bg-[#0A0B0F]">

      {/* Hero image */}
      <div style={{ position: "relative", height: "380px", width: "100%", overflow: "hidden" }}>
        <img
          src={post?.image}
          alt={post?.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, #0A0B0F 0%, rgba(10,11,15,0.5) 60%, transparent 100%)"
        }} />
        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
          <Link
            href="/forum"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">

        {/* Title + meta */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {post?.title}
          </h1>
          <div className="flex items-center gap-3">
            {post?.authorImage ? (
              <img src={post.authorImage} alt={post.authorName} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-xs font-bold text-[#A78BFA]">
                {post?.authorName?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white">{post?.authorName}</p>
              <p className="text-xs text-white/35">{formatDate(post?.createdAt)}</p>
            </div>
            <span className={`ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleBadgeClass}`}>
              {post?.authorRole}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#16181C] p-6">
          <p className="text-sm leading-relaxed text-white/70">{post?.description}</p>
        </div>

        {/* Like / Dislike */}
        <div className="mb-10 flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              hasLiked
                ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/20 text-[#A78BFA]"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {post?.likes?.length ?? 0}
          </button>

          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              hasDisliked
                ? "border-red-500/40 bg-red-500/15 text-red-400"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={hasDisliked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
              <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
            {post?.dislikes?.length ?? 0}
          </button>

          <span className="ml-auto text-xs text-white/30">
            {post?.comments?.length ?? 0} comment{post.comments?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Comments section */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/35">
            Comments
          </h2>

          {/* Add comment */}
          {userId ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                placeholder="Write a comment..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
              <button
                onClick={handleComment}
                disabled={isCommenting || !commentText.trim()}
                className="self-end rounded-xl bg-[#8B5CF6] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#7C3AED] disabled:opacity-60"
              >
                {isCommenting ? "Posting…" : "Post Comment"}
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/40">
              <Link href="/authenticate/signin" className="text-[#A78BFA] hover:underline">Sign in</Link> to leave a comment
            </div>
          )}

          {/* Comments list */}
          {post?.comments?.length === 0 ? (
            <p className="text-sm text-white/30">No comments yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {post.comments?.map((comment) => (
                <div key={comment._id} className="rounded-2xl border border-white/10 bg-[#16181C] p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {comment.userImage ? (
                        <img src={comment.userImage} alt={comment.userName} className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">
                          {comment.userName?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-white">{comment.userName}</span>
                      <span className="text-xs text-white/30">{formatDate(comment.createdAt)}</span>
                      {comment.editedAt && <span className="text-xs text-white/20">(edited)</span>}
                    </div>

                    {/* Edit / Delete — only own comments */}
                    {comment.userId === userId && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingId(comment._id); setEditText(comment.text); }}
                          className="text-xs text-white/30 hover:text-white/60 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-red-400/60 hover:text-red-400 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === comment._id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(comment._id)}
                          className="rounded-lg bg-[#8B5CF6] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#7C3AED]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50 transition hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-white/65">{comment.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}