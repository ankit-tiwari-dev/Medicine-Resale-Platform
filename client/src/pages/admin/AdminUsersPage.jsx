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
      <div className="mb-8">
        <Link to="/admin" className="inline-flex items-center text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
          Back to Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-60 font-sans">
              Privileged Identity Registry
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
              Participant <span className="text-primary">Management</span>
            </h1>
            <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium max-w-2xl leading-relaxed opacity-70">
              Auditing privileges, identity lifecycle, and network access controls.
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search Identity Registry..."
                className="h-10 pl-4 pr-4 rounded-xl bg-card border border-border outline-none focus:border-primary/30 transition-all text-[11px] font-bold tracking-tight w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-10 px-6 rounded-xl border border-border font-bold uppercase tracking-widest text-[9px] hover:bg-muted/30 transition-all"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {['user', 'rider', 'admin'].map(role => {
          const cfg = ROLE_CONFIG[role];
          const count = (query.data?.users || []).filter(u => u.role === role).length;
          return (
            <div key={role} className="bg-card rounded-xl p-6 border border-border shadow-sm group hover:border-primary/20 transition-all flex items-center justify-between font-sans">
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 opacity-50">{cfg.label}s</p>
                <p className="text-xl font-bold text-foreground tracking-tight">{count.toLocaleString()}</p>
              </div>
              <div className={`w-10 h-10 ${cfg.bg} ${cfg.color} rounded-xl flex items-center justify-center border ${cfg.border} opacity-80`}>
                <span className="font-bold text-xs">{role.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      {query.loading && users.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-border" />)}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Identity Manifest</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Communication Node</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Privilege Level</th>
                  <th className="px-6 py-4 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Governance Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                  const isDelete = confirmDelete === user._id;
                  return (
                    <tr key={user._id} className="hover:bg-muted/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 font-sans">
                          <div className={`w-10 h-10 ${roleCfg.bg} ${roleCfg.color} rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 border ${roleCfg.border}`}>
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{user.name}</p>
                            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-50">
                              ID: {user._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-bold text-muted-foreground font-sans lowercase opacity-60 tracking-tight">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[7px] font-bold uppercase tracking-widest font-sans ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border} opacity-80`}>
                          {roleCfg.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 font-sans">
                          {['user', 'rider', 'admin'].map(role => (
                            <button
                              key={role}
                              className={`h-7 px-3 rounded-lg text-[8px] font-bold uppercase tracking-widest border transition-all ${user.role === role ? 'bg-foreground text-background border-foreground' : 'text-muted-foreground hover:border-foreground/30 hover:bg-muted/30 border-border opacity-60'}`}
                              onClick={() => updateRole(user._id, role)}
                              disabled={user.role === role}
                            >
                              {role}
                            </button>
                          ))}
                          <div className="w-px h-4 bg-border mx-1" />
                          {!isDelete ? (
                            <button
                              className="h-7 px-3 rounded-lg text-red-500 hover:bg-red-500/10 border border-transparent transition-all text-[8px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100"
                              onClick={() => setConfirmDelete(user._id)}
                            >
                              Expunge
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 animate-in slide-in-from-right-1 duration-200">
                              <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Sure?</span>
                              <button
                                className="h-7 px-3 rounded-lg bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest shadow-sm"
                                onClick={() => removeUser(user._id)}
                              >
                                Commit
                              </button>
                              <button
                                className="h-7 px-2 rounded-lg border border-border text-[8px] font-bold uppercase tracking-widest hover:bg-muted"
                                onClick={() => setConfirmDelete(null)}
                              >
                                X
                              </button>
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
          <div className="px-6 py-3 bg-muted/30 border-t border-border flex justify-between items-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="opacity-60">Security Protocol Active</div>
            <div className="opacity-60 font-mono">Registry_Size: {users.length}</div>
          </div>
        </div>
      )}

      {/* Warning Context */}
      <div className="mt-8 p-6 bg-red-500/5 border border-red-500/10 rounded-xl flex flex-col gap-1.5">
        <h4 className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Destructive Action Protocol</h4>
        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed opacity-80">
          Identity expungement is irreversible. Transaction history, escrow funds, and audit records remain archived for compliance, but the user will permanently lose platform access.
        </p>
      </div>
    </div>
  );
};

export default AdminUsersPage;
