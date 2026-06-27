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
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getRoleStyle(role) {
  switch (role) {
    case 'admin':   return 'bg-[#1E293B] text-orange-400 border border-orange-500/20';
    case 'trainer': return 'bg-[#1E293B] text-purple-400 border border-purple-500/20';
    default:        return 'bg-[#1E293B] text-blue-400 border border-blue-500/20';
  }
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

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadUsers = async (search = '') => {
    try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) { 
            params.set('search', search);
        }
        const query = params.toString() ? `?${params.toString()}` : '';
      const data = await getUsers(query);
      setUsers(data);
    } catch (err) {
      toast.error(err?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
      setInitialLoad(false)
    }
  };

  useEffect(() => {

  if (!search) {
    loadUsers();
    return;
  }

    const timeout = setTimeout(() => loadUsers(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id + action);
      await updateUser(id, action);
      setUsers(prev => prev.map(u => u._id === id ? {
        ...u,
        ...(action === 'block'     && { status: 'blocked' }),
        ...(action === 'unblock'   && { status: 'active' }),
        ...(action === 'makeAdmin' && { role: 'admin' }),
        ...(action === 'demote'    && { role: 'user' }),
      } : u));
      toast.success(
        action === 'block'     ? 'User blocked.'      :
        action === 'unblock'   ? 'User unblocked.'    :
        action === 'makeAdmin' ? 'Promoted to admin.' :
        'Demoted to user.'
      );
    } catch (err) {
      toast.error(err?.message || 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && initialLoad) return <Loading />;

  return (
    <div className="min-h-screen text-white font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-xl border border-white/[0.06] shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="p-6 border-b bg-[#161520] border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                All Registered Users
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{users.length} total members</p>
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
                <tr className="border-b border-white/[0.06] text-gray-400 text-xs tracking-wider uppercase bg-[#161520]">
                  <th className="py-4 px-6 font-medium">User</th>
                  <th className="py-4 px-6 font-medium">Role</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Joined</th>
                  <th className="py-4 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-gray-600">
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((user) => {
                  const isBlocked     = user.status === 'blocked';
                  const isAdmin       = user.role === 'admin';
                  const isBusy        = !!actionLoading;
                  const blockDisabled = isBusy || isAdmin;
                  const adminDisabled = isBusy || isBlocked;

                  return (
                    <tr key={user._id} className="hover:bg-white/[0.01] transition-colors group">

                      {/* User */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                          ) : (
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${getAvatarStyle(user.name)}`}>
                              {user.name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-white group-hover:text-[#6D6AFE] transition-colors">{user.name}</span>
                            <span className="text-xs text-gray-400">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md capitalize ${getRoleStyle(user.role)}`}>
                          {user.role ?? 'user'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${isBlocked ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 min-w-[200px]">

                          {/* Block / Unblock */}
                          {isBlocked ? (
                            <AlertDialog>
                              <Button
                                isDisabled={isBusy}
                                className="w-[80px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40"
                              >
                                Unblock
                              </Button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="success" />
                                      <AlertDialog.Heading className="text-white">Unblock this user?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p>This will <strong className="text-emerald-400">restore full access</strong> for {user.name}.</p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary">Cancel</Button>
                                      <Button
                                        slot="close"
                                        isDisabled={isBusy}
                                        onClick={() => handleAction(user._id, 'unblock')}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                                      >
                                        Unblock
                                      </Button>
                                    </AlertDialog.Footer>
                                  </AlertDialog.Dialog>
                                </AlertDialog.Container>
                              </AlertDialog.Backdrop>
                            </AlertDialog>
                          ) : (
                            <AlertDialog>
                              <Button
                                isDisabled={blockDisabled}
                                className="w-[80px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-rose-500/20 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40"
                              >
                                Block
                              </Button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="danger" />
                                      <AlertDialog.Heading className="text-white">Block this user?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p>This will <strong className="text-rose-400">restrict access</strong> for {user.name}.</p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary">Cancel</Button>
                                      <Button
                                        slot="close"
                                        isDisabled={isBusy}
                                        onClick={() => handleAction(user._id, 'block')}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                                      >
                                        Block
                                      </Button>
                                    </AlertDialog.Footer>
                                  </AlertDialog.Dialog>
                                </AlertDialog.Container>
                              </AlertDialog.Backdrop>
                            </AlertDialog>
                          )}

                          {/* Make Admin */}
                          {isAdmin ? (
                            <span className="w-[100px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border border-white/[0.06] text-gray-500 bg-white/[0.01] cursor-not-allowed select-none">
                              Already Admin
                            </span>
                          ) : (
                            <AlertDialog>
                              <Button
                                isDisabled={adminDisabled}
                                className="w-[100px] text-center text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-[#6D6AFE]/20 text-[#8B88FF] hover:bg-[#6D6AFE]/10 disabled:opacity-40"
                              >
                                Make Admin
                              </Button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px] bg-[#171520]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="warning" />
                                      <AlertDialog.Heading className="text-white">Make this user an admin?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p>This will grant <strong className="text-[#8B88FF]">{user.name}</strong> full admin privileges. This action cannot be undone.</p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary">Cancel</Button>
                                      <Button
                                        slot="close"
                                        isDisabled={isBusy}
                                        onClick={() => handleAction(user._id, 'makeAdmin')}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent border-[#6D6AFE]/20 text-[#8B88FF] hover:bg-[#6D6AFE]/10"
                                      >
                                        Make Admin
                                      </Button>
                                    </AlertDialog.Footer>
                                  </AlertDialog.Dialog>
                                </AlertDialog.Container>
                              </AlertDialog.Backdrop>
                            </AlertDialog>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/[0.06] bg-[#161520]">
            <p className="text-xs text-gray-500">
              {loading ? 'Loading...' : `Showing ${users.length} users`}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}