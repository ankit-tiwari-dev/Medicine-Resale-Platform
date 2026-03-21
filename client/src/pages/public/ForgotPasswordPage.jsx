import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../api/authApi";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";
import { toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPassword: resetPasswordAuth } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [form, setForm] = useState({ 
    email: "", 
    otp: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword({ email: form.email });
      if (response.data.success) {
        toast.success("Verification code sent to your email");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPasswordAuth({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword
      });

      if (result.success) {
        toast.success("Password reset successfully!");
        
        const user = result.user;
        const redirectPath = user.role === 'admin' ? '/admin' : '/rider' ? '/rider' : '/dashboard';
        
        // Small delay to let the toast be seen and state to settle
        setTimeout(() => {
            navigate(redirectPath, { replace: true });
        }, 800);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle={step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
    >
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          {error && <AlertMessage variant="destructive" message={error} />}
          
          <FormInput
            id="forgot-email"
            name="email"
            label="Email Address"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="your@email.com"
          />

          <Button type="submit" loading={loading} className="w-full h-11 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all rounded-xl mt-4">
            Send Reset Code
          </Button>

          <div className="pt-4 text-center">
            <Link to="/login" className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest">
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && <AlertMessage variant="destructive" message={error} />}

          <div className="bg-muted/30 p-3 rounded-xl border border-border/50 mb-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
              Code sent to: <span className="text-foreground">{form.email}</span>
            </p>
          </div>

          <FormInput
            id="reset-otp"
            name="otp"
            label="Verification Code"
            type="text"
            required
            value={form.otp}
            onChange={onChange}
            placeholder="6-digit code"
          />

          <FormInput
            id="new-password"
            name="newPassword"
            label="New Password"
            type="password"
            required
            value={form.newPassword}
            onChange={onChange}
            placeholder="••••••••"
          />

          <FormInput
            id="confirm-password"
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            required
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="••••••••"
          />

          <Button type="submit" loading={loading} className="w-full h-11 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-xl mt-4">
            Update Password
          </Button>

          <button 
            type="button" 
            onClick={() => setStep(1)}
            className="w-full text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest pt-2"
          >
            Change Email
          </button>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
