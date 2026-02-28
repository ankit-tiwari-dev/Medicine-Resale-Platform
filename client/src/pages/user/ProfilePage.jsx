import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Container from "../../components/layout/Container";

import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateProfile, uploadUserAvatar } = useAuth();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      pincode: user?.address?.pincode || ""
    }
  });

  useEffect(() => {
    if (!isEditing && user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          pincode: user.address?.pincode || ""
        }
      });
    }
  }, [user, isEditing]);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(form);
    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    const result = await uploadUserAvatar(formData);
    setUploading(false);

    if (result.success) {
      toast.success("Profile photo updated");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[900px]">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
            Personal Security
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Account <span className="text-primary">Identity</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-sans font-medium">
            Manage your secure identity and clinical platform credentials.
          </p>
        </div>

        <div className="flex justify-end mb-6">
          {isEditing ? (
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave} loading={loading}>Save Changes</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Identity Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm text-center relative overflow-hidden group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/10" />
              <div
                className="relative inline-block cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="size-32 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center text-primary font-black text-4xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all">
                  {uploading ? (
                    <span className="text-xs uppercase tracking-widest animate-pulse">Wait</span>
                  ) : user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || "U"
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-foreground text-background rounded-xl shadow-lg border border-border group-hover:scale-110 transition-transform text-[9px] font-black uppercase tracking-widest">
                  Update
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground font-serif mb-1">{user?.name || "Verified User"}</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mb-6">{(user?.role || "standard").toUpperCase()} AUTHORIZATION</p>

              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Sync Status</span>
                  <span className="text-emerald-green">Active</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Joined</span>
                  <span className="text-foreground">{new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) || "FEB 2026"}</span>
                </div>
              </div>
            </div>

            <div className="bg-foreground rounded-2xl p-8 text-background shadow-2xl border border-border">
              <h3 className="text-sm font-black mb-2 uppercase tracking-tight">
                SafeAccount™
              </h3>
              <p className="text-[10px] opacity-70 leading-relaxed font-black uppercase tracking-widest">
                Your data is protected by AES-256 clinical-grade encryption and audited daily.
              </p>
            </div>
          </div>

          {/* Right: Details & Security */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-[2rem] p-8 lg:p-10 border border-border shadow-sm">
              <h3 className="text-lg font-black text-foreground font-serif uppercase tracking-tight mb-8">
                Personal Metadata
              </h3>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Legal Full Name</p>
                  {isEditing ? (
                    <FormInput
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter legal name"
                    />
                  ) : (
                    <div className="bg-muted/40 px-4 py-3 rounded-xl border border-border text-sm font-bold text-foreground">
                      {user?.name || "Not Set"}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Clinical Email</p>
                  <div className="bg-muted/40 px-4 py-3 rounded-xl border border-border text-xs font-black text-foreground flex items-center gap-2 opacity-60 cursor-not-allowed uppercase tracking-widest">
                    {user?.email || "Not Set"}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Mobile Number</p>
                  {isEditing ? (
                    <FormInput
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 00000 00000"
                    />
                  ) : (
                    <div className="bg-muted/40 px-4 py-3 rounded-xl border border-border text-sm font-bold text-foreground">
                      {user?.phone || "Not Set"}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Handover Address</p>
                  {isEditing ? (
                    <div className="space-y-4 pt-2">
                      <FormInput
                        label="Street"
                        value={form.address.street}
                        onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                        placeholder="Street"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput
                          label="City"
                          value={form.address.city}
                          onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                          placeholder="City"
                        />
                        <FormInput
                          label="Pincode"
                          value={form.address.pincode}
                          onChange={(e) => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })}
                          placeholder="Pincode"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/40 px-4 py-3 rounded-xl border border-border text-xs font-bold text-foreground leading-relaxed">
                      {user?.address ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.pincode || ""}` : "Address verification pending profile update."}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-border">
                <h3 className="text-lg font-black text-foreground font-serif uppercase tracking-tight mb-8">
                  Security Credentials
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-2xl group hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-foreground text-background rounded-xl flex items-center justify-center font-black text-[10px]">
                        KEY
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground uppercase tracking-tight">Update Passkey</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Modified: 2w ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 px-4 font-bold">Modify</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-2xl group hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-foreground text-background rounded-xl flex items-center justify-center font-black text-[10px]">
                        KYC
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground uppercase tracking-tight">Identity Verification</p>
                        <p className="text-[10px] text-emerald-foreground font-black uppercase tracking-widest">Certified & Verified</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 px-4 font-bold" disabled>Audit</Button>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="primary" className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/10 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center group">
              Synchronize Profile Data
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePage;
