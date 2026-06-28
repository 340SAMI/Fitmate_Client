'use client';

import { useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import Loading from '@/app/loading';
import { getUsers } from '@/lib/api/users';
import { updateUser } from '@/lib/actions/User';
import { AlertDialog, Button } from '@heroui/react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function getAvatarStyle(name) {
  const styles = [
    'bg-blue-500/20 text-blue-400',
    'bg-teal-500/20 text-teal-400',
    'bg-amber-500/20 text-amber-400',
    'bg-purple-500/20 text-purple-400',
    'bg-cyan-500/20 text-cyan-400',
    'bg-rose-500/20 text-rose-400',
    'bg-emerald-500/20 text-emerald-400',
  ];
  const index = (name?.charCodeAt(0) ?? 0) % styles.length;
  return styles[index];
}

export default function ManageTrainerLayout() {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadTrainers = async (search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('role', 'trainer');
      if (search) params.set('search', search);
      const data = await getUsers(`?${params.toString()}`);
      setTrainers(data);
    } catch (err) {
      toast.error(err?.message || 'Failed to load trainers.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (!search) {
      loadTrainers();
      return;
    }
    const timeout = setTimeout(() => loadTrainers(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id + action);
      await updateUser(id, action);
      // remove from list since they're no longer a trainer
      setTrainers(prev => prev.filter(t => t._id !== id));
      toast.success('Trainer demoted to user.');
    } catch (err) {
      toast.error(err?.message || 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  if (initialLoad && loading) return <Loading />;

  return (
    <div className="min-h-screen text-white font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-xl border border-white/[0.06] shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="p-6 border-b bg-[#1A1D28] border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                Active Trainers
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{trainers.length} trainers</p>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-[#11131A] text-sm text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-xl border border-white/[0.06] focus:outline-none focus:border-[#6D6AFE]/40 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-gray-400 text-xs tracking-wider uppercase bg-[#1A1D28]">
                  <th className="py-4 px-6 font-medium">Trainer</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Joined</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-sm text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : trainers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-sm text-gray-600">
                      No trainers found.
                    </td>
                  </tr>
                ) : (
                  trainers.map((trainer) => {
                    const isBusy = !!actionLoading;

                    return (
                      <tr key={trainer._id} className="hover:bg-white/[0.01] transition-colors group bg-[#1A1D28]">

                        {/* Trainer */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {trainer.image ? (
                              <img src={trainer.image} alt={trainer.name} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                            ) : (
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${getAvatarStyle(trainer.name)}`}>
                                {trainer.name?.[0]?.toUpperCase() ?? '?'}
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium text-white group-hover:text-[#6D6AFE] transition-colors">{trainer.name}</span>
                              <span className="text-xs text-gray-400">{trainer.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            Active
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(trainer.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center justify-end">
                            <AlertDialog>
                              <Button
                                isDisabled={isBusy}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-rose-500/20 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40"
                              >
                                Demote to User
                              </Button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="danger" />
                                      <AlertDialog.Heading className="text-white">Demote this trainer?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p>This will strip <strong className="text-rose-400">{trainer.name}</strong>&apos;s trainer privileges and revert them to a regular user.</p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary">Cancel</Button>
                                      <Button
                                        slot="close"
                                        isDisabled={isBusy}
                                        onClick={() => handleAction(trainer._id, 'demote')}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                                      >
                                        Demote
                                      </Button>
                                    </AlertDialog.Footer>
                                  </AlertDialog.Dialog>
                                </AlertDialog.Container>
                              </AlertDialog.Backdrop>
                            </AlertDialog>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/[0.06] bg-[#1A1D28]">
            <p className="text-xs text-gray-500">
              Showing {trainers.length} trainers
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}