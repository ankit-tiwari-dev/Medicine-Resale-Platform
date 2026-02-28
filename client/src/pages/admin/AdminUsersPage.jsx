import { useState, useCallback } from "react";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ROLE_CONFIG = {
  admin: { color: 'text-muted-amber', bg: 'bg-muted-amber/10', border: 'border-muted-amber/20', label: 'Administrator' },
  rider: { color: 'text-soft-cyan', bg: 'bg-soft-cyan/10', border: 'border-soft-cyan/20', label: 'Logistics Partner' },
  user: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', label: 'Platform User' }
};

const AdminUsersPage = () => {
  const fetcher = useCallback(() => getAdminUsers({ page: 1, limit: 50 }), []);
  const query = useApiQuery(fetcher, true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const updateRole = async (userId, role) => {
    try {
      await updateAdminUser(userId, { role });
      toast.success(`Privilege updated to: ${role}`);
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Privilege update failed."));
    }
  };

  const removeUser = async (userId) => {
    try {
      await deleteAdminUser(userId);
      toast.success("Identity expunged from platform registry.");
      setConfirmDelete(null);
      await query.execute();
    } catch (error) {
      toast.error(extractErrorMessage(error, "Expungement command failed."));
    }
  };

  const users = (query.data?.users || []).filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <Link to="/admin" className="inline-flex items-center text-[10px] font-black text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em] mb-8">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Privileged Identity Registry
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Participant <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Auditing privileges, identity lifecycle, and network access controls.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search Identity Registry..."
                className="h-14 pl-6 pr-6 rounded-2xl bg-card border border-border outline-none focus:border-foreground focus:ring-4 focus:ring-foreground/5 transition-all text-[10px] font-black uppercase tracking-widest w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] hover:bg-foreground/5"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {['user', 'rider', 'admin'].map(role => {
          const cfg = ROLE_CONFIG[role];
          const count = (query.data?.users || []).filter(u => u.role === role).length;
          return (
            <div key={role} className="bg-card rounded-[1.5rem] p-8 border border-border shadow-sm group hover:border-foreground/30 transition-all">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{cfg.label}s</p>
              <p className="text-3xl font-black text-foreground tracking-tighter">{count.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      {query.loading && users.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-card rounded-[2rem] animate-pulse border border-border" />)}
        </div>
      ) : (
        <div className="bg-card rounded-[2.5rem] border border-border shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Identity Manifest</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Communication Node</th>
                  <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Privilege Level</th>
                  <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Governance Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                  const isDelete = confirmDelete === user._id;
                  return (
                    <tr key={user._id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 ${roleCfg.bg} ${roleCfg.color} rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0 border ${roleCfg.border} shadow-sm`}>
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                              Network ID: {user._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-xs font-bold text-muted-foreground font-sans lowercase opacity-80">{user.email}</p>
                      </td>
                      <td className="px-10 py-6">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}>
                          {roleCfg.label}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {['user', 'rider', 'admin'].map(role => (
                            <Button
                              key={role}
                              variant="outline"
                              className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${user.role === role ? 'bg-foreground text-background border-foreground shadow-lg shadow-foreground/10' : 'hover:border-foreground/30 hover:bg-muted/40'}`}
                              onClick={() => updateRole(user._id, role)}
                              disabled={user.role === role}
                            >
                              {role}
                            </Button>
                          ))}
                          <div className="w-px h-6 bg-border mx-2" />
                          {!isDelete ? (
                            <Button
                              variant="outline"
                              className="h-10 px-4 rounded-xl text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-500/30 transition-all text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100"
                              onClick={() => setConfirmDelete(user._id)}
                            >
                              Expunge
                            </Button>
                          ) : (
                            <div className="flex items-center gap-3 animate-in slide-in-from-right-2 duration-300">
                              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Confirm?</span>
                              <Button
                                variant="outline"
                                className="h-10 px-4 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest"
                                onClick={() => removeUser(user._id)}
                              >
                                Commit
                              </Button>
                              <Button
                                variant="outline"
                                className="h-10 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest hover:bg-muted"
                                onClick={() => setConfirmDelete(null)}
                              >
                                Abort
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-10 py-6 bg-muted/20 border-t border-border flex justify-between items-center">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
              Security Protocol Active
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest font-mono">
              Identity_Registry_Size: {users.length}
            </p>
          </div>
        </div>
      )}

      {/* Warning Context */}
      <div className="mt-10 p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] flex flex-col gap-2">
        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Destructive Action Protocol</h4>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
          Identity expungement is irreversible. All associated transaction history, escrow funds, and audit records remain archived for regulatory compliance, but the user will permanently lose platform access.
        </p>
      </div>
    </div>
  );
};

export default AdminUsersPage;
