"use client";

import ForumPostCard from "@/component/Forum/ForumPostCard";
import { useState } from "react";

export default function MyForumPosts({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Forum Posts</h1>
        <p className="mt-1.5 text-sm text-white/40">
          {posts.length} {posts.length === 1 ? "post" : "posts"} published
        </p>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          <p className="text-sm font-semibold text-white/40">No posts yet</p>
          <p className="text-xs text-white/25">Your published forum posts will appear here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <ForumPostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}

    </div>
  );
}