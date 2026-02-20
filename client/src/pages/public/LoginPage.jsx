import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getGoogleOAuthUrl } from "../../api/authApi";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";
import { ChevronRight } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isSubmitting, rateLimit } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(form);
    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.otpRequired) {
      navigate("/verify-otp", { replace: true, state: { email: form.email } });
      return;
    }

    let nextPath = location.state?.from?.pathname || "/dashboard";
    if (result.user?.role === 'admin') {
      nextPath = "/admin";
    }
    navigate(nextPath, { replace: true });
  };

  return (
    <AuthCard
      title="Secure Login"
      subtitle="Access your clinical dashboard, wallet, and verified medicine listings."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && <AlertMessage variant="destructive" message={error} />}
        {rateLimit.active && <AlertMessage variant="warning" message={rateLimit.message} />}

        <FormInput
          id="login-email"
          name="email"
          label="Email Address"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          placeholder="your@email.com"
          className="font-sans"
        />

        <div className="space-y-1">
          <FormInput
            id="login-password"
            name="password"
            label="Account Password"
            type="password"
            required
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            className="font-sans"
          />
          <div className="flex justify-end pr-1">
            <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-primary hover:text-emerald-green transition-colors uppercase tracking-widest">
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
          Sign In to MedAImart
        </Button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
            <span className="bg-card px-3 text-muted-foreground">Certified Auth</span>
          </div>
        </div>

        <a
          className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted transition-all shadow-sm active:scale-95"
          href={getGoogleOAuthUrl()}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="mr-3 h-5 w-5" />
          Google Account
        </a>

        <div className="pt-6 space-y-3 border-t border-border mt-2">
          <p className="text-sm text-center text-muted-foreground font-sans">
            New here? <Link className="font-bold text-primary hover:text-emerald-green transition-colors inline-flex items-center gap-1" to="/register">Create Account <ChevronRight size={14} /></Link>
          </p>
          <p className="text-[11px] text-center text-muted-foreground uppercase tracking-widest font-bold">
            Rider? <Link className="text-soft-cyan hover:text-soft-cyan-light transition-colors" to="/register-rider">Join Fleet</Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
