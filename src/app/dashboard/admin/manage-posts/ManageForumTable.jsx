"use client";
import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Button, AlertDialog } from "@heroui/react";


import Image from "next/image";
import { getForumPosts } from "@/lib/api/forums";
import { deleteForumPost } from "@/lib/actions/forum";

const ROLE_STYLE = {
  trainer: "bg-purple-900/30 text-purple-300 border border-purple-700/40",
  admin: "bg-blue-900/30 text-blue-300 border border-blue-700/40",
  member: "bg-gray-800 text-gray-400 border border-gray-700/40",
};

export default function ManageForumTable() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await getForumPosts(null, params.toString());
    setPosts(res?.posts || []);
    setTotal(res?.total || 0);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchPosts, 300);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  async function handleDelete(id) {
    try {
      await deleteForumPost(id);
    } catch (err) {
      console.error(err);
    } finally {
      fetchPosts();
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#11131A", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="rounded-xl" style={{ backgroundColor: "#1A1D28", border: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 flex-wrap gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <h2 className="text-base font-semibold text-white">All community posts</h2>
              <p className="text-sm text-gray-400 mt-0.5">{total} total posts</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "#11131A", border: "1px solid rgba(255,255,255,0.08)", width: 220 }}>
                <Search size={14} className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search posts…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Post", "Author", "Engagement", "Posted", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-500 text-sm">Loading…</td></tr>
                ) : posts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-500 text-sm">No posts found</td></tr>
                ) : posts.map((post, i) => (
                  <tr
                    key={post._id}
                    style={{
                      borderBottom: i < posts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      height: 72,
                    }}
                  >
                    {/* Post */}
                    <td className="px-6" style={{ maxWidth: 340 }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden" style={{ backgroundColor: "#2D2A4A" }}>
                          {post.image
                            ? <Image src={post.image} className="w-full h-full object-cover" alt={post.title} width={40} height={40} />
                            : <div className="w-full h-full flex items-center justify-center text-lg">📝</div>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[240px]">{post.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: "#2D2A4A" }}>
                          {post.authorImage
                            ? <Image src={post.authorImage} className="w-full h-full object-cover" alt={post.authorName} width={28} height={28} />
                            : <div className="w-full h-full flex items-center justify-center text-xs">👤</div>}
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 whitespace-nowrap">{post.authorName || "—"}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_STYLE[post.authorRole] || "bg-gray-800 text-gray-400"}`}>
                            {post.authorRole || "member"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Engagement */}
                    <td className="px-6">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span title="Likes">👍 {post.likes?.length ?? 0}</span>
                        <span title="Dislikes">👎 {post.dislikes?.length ?? 0}</span>
                        <span title="Comments">💬 {post.comments?.length ?? 0}</span>
                      </div>
                    </td>

                    {/* Posted */}
                    <td className="px-6">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6">
                      <AlertDialog>
                        <Button className="w-[80px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-rose-500/20 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40">
                          Delete
                        </Button>
                        <AlertDialog.Backdrop>
                          <AlertDialog.Container>
                            <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                              <AlertDialog.CloseTrigger />
                              <AlertDialog.Header>
                                <AlertDialog.Icon status="danger" />
                                <AlertDialog.Heading className="text-white">Delete this post?</AlertDialog.Heading>
                              </AlertDialog.Header>
                              <AlertDialog.Body>
                                <p>This will permanently delete <strong>{post.title}</strong>. This action cannot be undone.</p>
                              </AlertDialog.Body>
                              <AlertDialog.Footer>
                                <Button slot="close" variant="tertiary">Cancel</Button>
                                <Button slot="close" variant="danger" onClick={() => handleDelete(post._id)}>Delete</Button>
                              </AlertDialog.Footer>
                            </AlertDialog.Dialog>
                          </AlertDialog.Container>
                        </AlertDialog.Backdrop>
                      </AlertDialog>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm text-gray-500">Showing {posts.length} of {total} posts</p>
          </div>

        </div>
      </div>
    </div>
  );
}