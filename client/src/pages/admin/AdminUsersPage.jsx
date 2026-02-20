import { useState, useCallback } from "react";
import { deleteAdminUser, getAdminUsers, updateAdminUser } from "../../api/adminApi";
import Button from "../../components/common/Button";
import { useApiQuery } from "../../hooks/useApiQuery";
import { extractErrorMessage } from "../../utils/errors";
import {
  Users,
  ChevronLeft,
  Search,
  Trash2,
  ShieldCheck,
  Crown,
  Truck,
  User,
  RefreshCw,
  AlertTriangle,
  MoreHorizontal
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ROLE_CONFIG = {
  admin: { icon: Crown, color: 'text-muted-amber', bg: 'bg-muted-amber/10', border: 'border-muted-amber/20', label: 'Administrator' },
  rider: { icon: Truck, color: 'text-soft-cyan', bg: 'bg-soft-cyan/10', border: 'border-soft-cyan/20', label: 'Logistics Partner' },
  user: { icon: User, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', label: 'Platform User' }
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
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6">
          <ChevronLeft className="w-4 h-4" />
          Admin Terminal
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <Users size={12} />
              Network Identity Registry
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Participant <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground mt-2 font-sans font-medium">
              Auditing privileges, identity lifecycle, and network access controls.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Name, Email, or Role..."
                className="h-14 pl-12 pr-6 rounded-2xl bg-card border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-xs font-bold uppercase tracking-widest w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-14 w-14 rounded-2xl border-2 p-0 flex items-center justify-center"
              onClick={() => query.execute()}
              loading={query.loading}
            >
              <RefreshCw size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {['user', 'rider', 'admin'].map(role => {
          const cfg = ROLE_CONFIG[role];
          const count = (query.data?.users || []).filter(u => u.role === role).length;
          return (
            <div key={role} className={`bg-card rounded-[1.5rem] p-6 border border-border shadow-sm flex items-center gap-4`}>
              <div className={`w-12 h-12 ${cfg.bg} ${cfg.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <cfg.icon size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cfg.label}s</p>
                <p className="text-2xl font-black text-foreground">{count}</p>
              </div>
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
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Identity</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contact Node</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Privilege Level</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">Governance Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                  const isDelete = confirmDelete === user._id;
                  return (
                    <tr key={user._id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${roleCfg.bg} ${roleCfg.color} rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0`}>
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-0.5">
                              ID #{user._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs font-bold text-muted-foreground italic">{user.email}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}>
                          <roleCfg.icon size={10} />
                          {roleCfg.label}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {['user', 'rider', 'admin'].map(role => (
                            <Button
                              key={role}
                              variant="outline"
                              className={`h-9 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${user.role === role ? 'bg-primary text-white border-primary' : 'hover:border-primary/30'}`}
                              onClick={() => updateRole(user._id, role)}
                              disabled={user.role === role}
                            >
                              {role}
                            </Button>
                          ))}
                          <div className="w-px h-6 bg-border mx-1" />
                          {!isDelete ? (
                            <Button
                              variant="outline"
                              className="h-9 w-9 p-0 rounded-xl text-red-500 hover:bg-red-500 hover:text-white border-2 transition-all"
                              onClick={() => setConfirmDelete(user._id)}
                              title="Expunge Identity"
                            >
                              <Trash2 size={16} />
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-red-500 italic">Confirm?</span>
                              <Button
                                variant="outline"
                                className="h-9 px-3 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black"
                                onClick={() => removeUser(user._id)}
                              >
                                Yes
                              </Button>
                              <Button
                                variant="outline"
                                className="h-9 px-3 rounded-xl border-2 text-[10px] font-black"
                                onClick={() => setConfirmDelete(null)}
                              >
                                No
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
          <div className="px-8 py-5 bg-muted/20 border-t border-border flex justify-between items-center">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <ShieldCheck size={14} className="text-primary" />
              Identity Audit Trail Active
            </div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              {users.length} identities in registry
            </p>
          </div>
        </div>
      )}

      {/* Warning Context */}
      <div className="mt-10 p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] flex items-start gap-5">
        <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-foreground uppercase tracking-widest mb-1">Destructive Action Protocol</h4>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
            Identity expungement is irreversible. All associated transaction history, escrow funds, and audit records remain archived for regulatory compliance, but the user will permanently lose platform access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
