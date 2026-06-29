// components/ForumPosts.tsx

import { getForumPosts } from "@/lib/api/forums";
import Link from "next/link";

const ForumPosts = async () => {
  const {posts} = await getForumPosts();
  

  return (
    <section className="bg-[#0A0B0F] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#C4B5FD]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
            Community discussions
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Forum Posts
          </h2>
          <p className="mt-3 text-sm text-white/50">
            Join the conversation with our community
          </p>
        </div>

        {/* Posts List */}

{/* Cards Grid */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {posts.map((post) => (
    <div
      key={post._id}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#12141A] transition hover:border-[#8B5CF6]/30 hover:shadow-xl hover:shadow-[#8B5CF6]/5"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-transparent to-transparent" />

        {/* Category badge */}
        {post.category && (
          <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
            <span className="text-[11px] font-semibold text-white">{post.category}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-semibold text-white line-clamp-1">{post.title}</h3>
        <p className="text-sm text-white/50 line-clamp-2">{post.description}</p>

        <div className="flex items-center gap-2 text-xs text-white/50">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-[10px] font-bold text-[#A78BFA]">
            {post.authorName?.charAt(0).toUpperCase()}
          </div>
          {post.authorName}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="flex items-center gap-1 text-xs text-white/40">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {post.commentCount ?? 0} replies
          </span>
          <Link
            href={`/forum/${post._id}`}
            className="rounded-xl bg-[#8B5CF6]/15 px-4 py-2 text-xs font-semibold text-[#A78BFA] transition hover:bg-[#8B5CF6] hover:text-white"
          >
            Read →
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            View all posts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ForumPosts;