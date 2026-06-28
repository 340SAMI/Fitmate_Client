"use client";
import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Button, Dropdown, Label, Header, AlertDialog } from "@heroui/react";
import { getClasses } from "@/lib/api/classes";
import { deleteClass, UpdateClass } from "@/lib/actions/Classes";
import Image from "next/image";


const CATEGORY_OPTIONS = ["all", "Yoga", "Weights", "Cardio", "Pilates", "Boxing"];
const STATUS_OPTIONS = ["all", "pending", "approved", "rejected"];

const CAT_STYLE = {
  Yoga: "bg-purple-900/30 text-purple-300 border border-purple-700/40",
  Weights: "bg-blue-900/30 text-blue-300 border border-blue-700/40",
  Cardio: "bg-emerald-900/30 text-emerald-300 border border-emerald-700/40",
  Pilates: "bg-amber-900/30 text-amber-300 border border-amber-700/40",
  Boxing: "bg-pink-900/30 text-pink-300 border border-pink-700/40",
};
const STATUS_STYLE = {
  pending: "bg-amber-900/30 text-amber-400 border border-amber-700/40",
  approved: "bg-emerald-900/30 text-emerald-400 border border-emerald-700/40",
  rejected: "bg-rose-900/30 text-rose-400 border border-rose-700/40",
};

export default function ManageClassTable() {
  const [classes, setClasses] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(new Set(["all"]));
  const [status, setStatus] = useState(new Set(["all"]));
  const [loading, setLoading] = useState(false);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const cat = [...category][0];
    const stat = [...status][0];
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cat !== "all") params.set("category", cat);
    if (stat !== "all") params.set("status", stat);
    const res = await getClasses(params.toString(), null, true);
    setClasses(res?.classes || []);
    setTotal(res?.total || 0);
    setLoading(false);
  }, [search, category, status]);

  useEffect(() => {
    const t = setTimeout(fetchClasses, 300);
    return () => clearTimeout(t);
  }, [fetchClasses]);

  const pending = classes.filter((c) => c.status === "pending").length;

  async function handleAction(id, type) {
    try{
          
    if (type === "approve") {
      await UpdateClass({ status: "approved" }, id, true);
      
    } else if (type === "reject") {
      await UpdateClass({ status: "rejected" }, id, true);
    } else if (type === "delete") {
      await deleteClass(id)
    }
    }catch(err){
        console.error(err)
    }finally{
            fetchClasses();
    }

 
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#11131A", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="rounded-xl" style={{ backgroundColor: "#1A1D28", border: "1px solid rgba(255,255,255,0.06)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 flex-wrap gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <h2 className="text-base font-semibold text-white">All submitted classes</h2>
              <p className="text-sm text-gray-400 mt-0.5">{total} total — {pending} pending review</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">

              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "#11131A", border: "1px solid rgba(255,255,255,0.08)", width: 200 }}>
                <Search size={14} className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search classes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
                />
              </div>

              {/* Category dropdown */}
              <Dropdown>
                <Button className={"sm:max-w-[400px] bg-[#11131A] border-[#272A35] border-2 hover:border-[#8B5CDA] transition-colors duration-300 ease-in-out "}>
                  {[...category][0] === "all" ? "Category" : [...category][0]}
                </Button>
                <Dropdown.Popover className="min-w-[180px]">
                  <Dropdown.Menu  selectedKeys={category} selectionMode="single" onSelectionChange={setCategory}>
                    <Dropdown.Section >
                      <Header>Category</Header>
                      {CATEGORY_OPTIONS.map((c) => (
                        <Dropdown.Item key={c} id={c} textValue={c}>
                          <Dropdown.ItemIndicator />
                          <Label>{c === "all" ? "All categories" : c}</Label>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Section>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>

              {/* Status dropdown */}
              <Dropdown>
                <Button className={"sm:max-w-[400px] bg-[#11131A] border-[#272A35] border-2 hover:border-[#8B5CDA] transition-colors duration-300 ease-in-out "}>
                  {[...status][0] === "all" ? "Status" : [...status][0].charAt(0).toUpperCase() + [...status][0].slice(1)}
                </Button>
                <Dropdown.Popover className="min-w-[180px]">
                  <Dropdown.Menu selectedKeys={status} selectionMode="single" onSelectionChange={setStatus}>
                    <Dropdown.Section>
                      <Header>Status</Header>
                      {STATUS_OPTIONS.map((s) => (
                        <Dropdown.Item key={s} id={s} textValue={s}>
                          <Dropdown.ItemIndicator />
                          <Label>{s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</Label>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Section>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Class", "Trainer", "Category", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-500 text-sm">Loading…</td></tr>
                ) : classes.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-500 text-sm">No classes found</td></tr>
                ) : classes.map((cls, i) => (
                  <tr key={cls._id} style={{ borderBottom: i < classes.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", height: 72 }}>

                    {/* Class */}
                    <td className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden" style={{ backgroundColor: "#2D2A4A" }}>
                          {cls.image
                            ? <Image src={cls.image} className="w-full h-full object-cover" alt={cls.className}  width={50} height={50}/>
                            : "🏋️"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{cls.className}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{cls.duration} · {cls.level}</p>
                        </div>
                      </div>
                    </td>

                    {/* Trainer */}
                    <td className="px-6"><span className="text-sm text-gray-400">{cls.trainerName || "—"}</span></td>

                    {/* Category */}
                    <td className="px-6">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CAT_STYLE[cls.category] || "bg-gray-800 text-gray-400"}`}>
                        {cls.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6"><span className="text-sm font-bold text-emerald-400">${cls.price}</span></td>

                    {/* Status */}
                    <td className="px-6">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[cls.status] || "bg-gray-800 text-gray-400"}`}>
                        {cls.status}
                      </span>
                    </td>

                    {/* Actions */}

                        <td className="px-6">
                        <div className="flex items-center gap-2">
                            {cls.status === "pending" ? (
                            <>
                                {/* Approve */}
                                <AlertDialog>
                                    <Button 
                                    className="w-[80px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40"
                                    >Approve</Button>
                                <AlertDialog.Backdrop>
                                    <AlertDialog.Container>
                                    <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                                        <AlertDialog.CloseTrigger />
                                        <AlertDialog.Header>
                                        <AlertDialog.Icon status="success" />
                                        <AlertDialog.Heading className="text-white">Approve this class?</AlertDialog.Heading>
                                        </AlertDialog.Header>
                                        <AlertDialog.Body>
                                        <p>This will make <strong>{cls.className}</strong> visible to all users.</p>
                                        </AlertDialog.Body>
                                        <AlertDialog.Footer>
                                        <Button slot="close" variant="tertiary">Cancel</Button>
                                        <Button slot="close" variant="primary" onClick={() => handleAction(cls._id, "approve")}>Approve</Button>
                                        </AlertDialog.Footer>
                                    </AlertDialog.Dialog>
                                    </AlertDialog.Container>
                                </AlertDialog.Backdrop>
                                </AlertDialog>

                                {/* Reject */}
                                <AlertDialog>
                                    <Button 
                                    className="w-[80px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-rose-500/20 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40"
                                    >Reject</Button>
                                <AlertDialog.Backdrop>
                                    <AlertDialog.Container>
                                    <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                                        <AlertDialog.CloseTrigger />
                                        <AlertDialog.Header>
                                        <AlertDialog.Icon status="danger" />
                                        <AlertDialog.Heading className="text-white">Reject this class?</AlertDialog.Heading>
                                        </AlertDialog.Header>
                                        <AlertDialog.Body>
                                        <p><strong>{cls.className}</strong> will be marked as rejected and hidden from public view.</p>
                                        </AlertDialog.Body>
                                        <AlertDialog.Footer>
                                        <Button slot="close" variant="tertiary">Cancel</Button>
                                        <Button slot="close" variant="danger" onClick={() => handleAction(cls._id, "reject")}>Reject</Button>
                                        </AlertDialog.Footer>
                                    </AlertDialog.Dialog>
                                    </AlertDialog.Container>
                                </AlertDialog.Backdrop>
                                </AlertDialog>
                            </>
                            ) : (
                            /* Delete */
                            <AlertDialog>
                                
                                <Button 
                                className="w-[100px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-[#6D6AFE]/20 text-[#8B88FF] hover:bg-[#6D6AFE]/10 disabled:opacity-40"
                                >
                                    Delete</Button>
                            
                                <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                    <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                        <AlertDialog.Icon status="danger" />
                                        <AlertDialog.Heading className="text-white">Delete this class?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                        <p>This will permanently delete <strong>{cls.className}</strong>. This action cannot be undone.</p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                        <Button slot="close" variant="tertiary">Cancel</Button>
                                        <Button slot="close" variant="danger" onClick={() => handleAction(cls._id, "delete")}>Delete</Button>
                                    </AlertDialog.Footer>
                                    </AlertDialog.Dialog>
                                </AlertDialog.Container>
                                </AlertDialog.Backdrop>
                            </AlertDialog>
                            )}
                        </div>
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-sm text-gray-500">Showing {classes.length} of {total} classes</p>
          </div>

        </div>
      </div>
    </div>
  );
}