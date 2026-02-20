import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";
import { ChevronRight, ShieldCheck } from "lucide-react";

const RiderRegisterPage = () => {
  const navigate = useNavigate();
  const { register, isSubmitting, rateLimit } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      role: "rider"
    };

    const result = await register(payload);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/verify-otp", { replace: true, state: { email: form.email } });
  };

  return (
    <AuthCard
      title="Rider Network"
      subtitle="Join India's first forensic-verified rider fleet. Secure healthcare logistics start here."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && <AlertMessage variant="destructive" message={error} />}
        {rateLimit.active && <AlertMessage variant="warning" message={rateLimit.message} />}

        <div className="bg-emerald-green/5 border border-emerald-green/20 rounded-2xl p-4 flex gap-3 mb-2 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-green flex-shrink-0" />
          <p className="text-[11px] text-emerald-green font-bold uppercase tracking-widest leading-relaxed">
            Certified riders undergo mandatory document verification and compliance training.
          </p>
        </div>

        <FormInput
          id="rider-name"
          name="name"
          label="Legal Full Name"
          value={form.name}
          onChange={onChange}
          required
          placeholder="As per Government ID"
          className="font-sans"
        />
        <FormInput
          id="rider-email"
          name="email"
          label="Work Email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          placeholder="rider@provider.com"
          className="font-sans"
        />
        <FormInput
          id="rider-phone"
          name="phone"
          label="Mobile Number"
          value={form.phone}
          onChange={onChange}
          required
          placeholder="+91 00000 00000"
          className="font-sans"
        />
        <FormInput
          id="rider-password"
          name="password"
          label="Account Password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          minLength={8}
          placeholder="••••••••"
          className="font-sans"
        />

        <Button type="submit" loading={isSubmitting} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
          Register for Certification
        </Button>

        <div className="pt-6 border-t border-border mt-2">
          <p className="text-sm text-center text-muted-foreground font-sans">
            Already a network rider? <Link className="font-bold text-primary hover:text-emerald-green transition-colors inline-flex items-center gap-1" to="/login">Secure Sign In <ChevronRight size={14} /></Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default RiderRegisterPage;
