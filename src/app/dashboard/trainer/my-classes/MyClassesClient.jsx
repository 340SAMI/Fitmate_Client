"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { AlertDialog, Button } from "@heroui/react";
import { TrashBin, Pencil, Person } from "@gravity-ui/icons";
import { deleteClass} from "@/lib/actions/Classes";
import UpdateClassModal from "./UpdateClassModal";
import StudentsModal from "./StudentsModal";
import Link from "next/link";
import { getPurchase } from "@/lib/api/purchase.";

const statusStyles = {
  approved: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending:  "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function MyClassesClient({ initialClasses }) {
  const [classes, setClasses]           = useState(initialClasses);
  const [editingClass, setEditingClass] = useState(null);
  const [students, setStudents]         = useState([]);
  const [studentsModal, setStudentsModal] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [deletingId, setDeletingId]     = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteClass(id);
      setClasses((prev) => prev.filter((c) => c._id !== id));
      toast.success("Class deleted!");
    } catch {
      toast.error("Failed to delete class");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewStudents = async (classId) => {
    setLoadingStudents(true);
    setStudentsModal(true);
    try {
      const data = await getPurchase(null, userId);
      setStudents(data?.purchases ?? []);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleUpdateSuccess = (updated) => {
    setClasses((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
    setEditingClass(null);
    toast.success("Class updated!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}

        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-white">My Classes</h1>
            <p className="mt-1 text-sm text-white/40">
            {classes.length} {classes.length === 1 ? "class" : "classes"} created
            </p>
        </div>

        <Link
            href="/dashboard/trainer/add-class"
            className="rounded-xl bg-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
        >
            + Add Class
        </Link>
        </div>

      {/* Empty state */}
      {classes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/20">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <p className="text-sm font-semibold text-white/40">No classes yet</p>
          <p className="text-xs text-white/25">Classes you create will appear here</p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#12141A]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/30">Class</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/30">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/30">Price</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/30">Schedule</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/30">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-white/30">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {classes.map((cls) => (
                  <tr key={cls._id} className="transition hover:bg-white/[0.02]">
                    {/* Class */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cls.image}
                          alt={cls.className}
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-white line-clamp-1">{cls.className}</p>
                          <p className="text-xs text-white/40">{cls.difficulty}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-white/60">{cls.category}</td>

                    {/* Price */}
                    <td className="px-5 py-4 font-semibold text-white">${cls.price}</td>

                    {/* Schedule */}
                    <td className="px-5 py-4">
                      <p className="text-white/60">{cls.schedule?.days?.join(", ")}</p>
                      <p className="text-xs text-white/35">{cls.schedule?.time}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[cls.status] ?? statusStyles.pending}`}>
                        {cls.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* Update */}
                        <button
                          onClick={() => setEditingClass(cls)}
                          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/10 hover:text-[#A78BFA]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        {/* View Students */}
                        <button
                          onClick={() => handleViewStudents(cls._id)}
                          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                        >
                          <Person className="h-3.5 w-3.5" />
                          Students
                        </button>

                        {/* Delete */}
                        <AlertDialog>
                          <Button
                            size="sm"
                            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10"
                          >
                            <TrashBin className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                          <AlertDialog.Backdrop>
                            <AlertDialog.Container>
                              <AlertDialog.Dialog className="sm:max-w-[400px]">
                                <AlertDialog.CloseTrigger />
                                <AlertDialog.Header>
                                  <AlertDialog.Icon status="danger" />
                                  <AlertDialog.Heading>Delete this class?</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body>
                                  <p className="text-sm text-white/60">
                                    <strong className="text-white">{cls.className}</strong> will be permanently deleted.
                                  </p>
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                  <Button slot="close" variant="tertiary">Cancel</Button>
                                  <Button
                                    slot="close"
                                    variant="danger"
                                    isDisabled={deletingId === cls._id}
                                    onPress={() => handleDelete(cls._id)}
                                  >
                                    <TrashBin />
                                    {deletingId === cls._id ? "Deleting…" : "Yes, delete"}
                                  </Button>
                                </AlertDialog.Footer>
                              </AlertDialog.Dialog>
                            </AlertDialog.Container>
                          </AlertDialog.Backdrop>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {editingClass && (
        <UpdateClassModal
          cls={editingClass}
          onSuccess={handleUpdateSuccess}
          onClose={() => setEditingClass(null)}
        />
      )}

      {/* Students Modal */}
      <StudentsModal
        isOpen={studentsModal}
        students={students}
        isLoading={loadingStudents}
        onClose={() => { setStudentsModal(false); setStudents([]); }}
      />
    </div>
  );
}