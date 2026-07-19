import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";

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
      subtitle="Join our platform to buy and sell medicines."
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

        <Button type="submit" loading={isSubmitting} className="w-full h-11 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all rounded-xl mt-4 shadow-lg shadow-foreground/5">
          Create Account
        </Button>

        <p className="text-[10px] text-muted-foreground/60 text-center font-bold uppercase tracking-widest px-4">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-foreground hover:text-primary transition-colors underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-foreground hover:text-primary transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="pt-6 border-t border-border/40 mt-2">
          <p className="text-xs text-center text-muted-foreground font-bold uppercase tracking-widest">
            Already registered? <Link className="text-foreground border-b border-foreground/20 hover:border-foreground transition-all ml-1" to="/login">Login</Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
