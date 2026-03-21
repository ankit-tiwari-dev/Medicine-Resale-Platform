import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getGoogleOAuthUrl } from "../../api/authApi";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";

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
    if (location.state?.from?.search) {
      nextPath += location.state?.from?.search;
    }
    if (result.user?.role === 'admin') {
      nextPath = "/admin";
    }
    navigate(nextPath, { replace: true });
  };

  return (
    <AuthCard
      title="Login"
      subtitle="Login to your account."
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
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            className="font-sans"
          />
          <div className="flex justify-end pr-1">
            <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full h-11 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all rounded-xl mt-4 shadow-lg shadow-foreground/5">
          Login
        </Button>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/40">
            <span className="bg-background px-4 font-bold">OR</span>
          </div>
        </div>

        <a
          className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-muted transition-all active:scale-95"
          href={getGoogleOAuthUrl()}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="mr-3 h-4 w-4" />
          Google Account
        </a>

        <div className="pt-6 space-y-4 border-t border-border/40 mt-2">
          <p className="text-xs text-center text-muted-foreground font-bold uppercase tracking-widest">
            New here? <Link className="text-foreground border-b border-foreground/20 hover:border-foreground transition-all ml-1" to="/register">Create Account</Link>
          </p>
          <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-40">
            Are you a rider? <Link className="text-foreground hover:underline" to="/register-rider">Join here</Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
