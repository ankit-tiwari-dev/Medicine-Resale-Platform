import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";
import { ChevronRight } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isSubmitting, rateLimit } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await register(form);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate("/verify-otp", { replace: true, state: { email: form.email } });
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join India's most trusted AI-verified medicine resale network."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && <AlertMessage variant="destructive" message={error} />}
        {rateLimit.active && <AlertMessage variant="warning" message={rateLimit.message} />}

        <FormInput
          id="register-name"
          name="name"
          label="Legal Full Name"
          value={form.name}
          onChange={onChange}
          required
          placeholder="e.g. Rahul Sharma"
          className="font-sans"
        />
        <FormInput
          id="register-email"
          name="email"
          label="Primary Email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          placeholder="your@email.com"
          className="font-sans"
        />
        <FormInput
          id="register-password"
          name="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          placeholder="Minimum 8 characters"
          minLength={8}
          className="font-sans"
        />

        <Button type="submit" loading={isSubmitting} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
          Create Account
        </Button>

        <p className="text-[10px] text-muted-foreground text-center font-medium leading-relaxed px-4">
          By creating an account, you agree to our clinical compliance standards and escrow safety protocols.
        </p>

        <div className="pt-6 border-t border-border mt-2">
          <p className="text-sm text-center text-muted-foreground font-sans">
            Already registered? <Link className="font-bold text-primary hover:text-emerald-green transition-colors inline-flex items-center gap-1" to="/login">Sign in to Session <ChevronRight size={14} /></Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
