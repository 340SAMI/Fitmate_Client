import ForumPostGridCard from "./ForumPostGridCard";


export default function ForumListingContainer({ initialPosts }) {
  const posts = initialPosts ?? [];

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      <div className="border-b border-white/[0.06] bg-[#0F1013]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Community Forum
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {posts.length} posts shared by the community
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-white/20"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-lg font-semibold text-white/60">No forum posts yet</p>
            <p className="text-sm text-white/30">Be the first to share something with the community</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ForumPostGridCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
