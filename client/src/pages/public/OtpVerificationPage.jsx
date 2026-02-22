import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";
import { ChevronRight, KeyRound } from "lucide-react";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { otpSession, submitOtp, resendVerificationOtp, isSubmitting, rateLimit } = useAuth();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(location.state?.email || otpSession?.email || "");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const canSubmit = useMemo(() => otp.trim().length === 6 && email, [otp, email]);

  const onVerify = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");

    const payload = otpSession?.userId
      ? { userId: otpSession.userId, userOtp: otp }
      : { email, otp };

    const result = await submitOtp(payload);
    if (!result.success) {
      setError(result.message);
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

  const onResend = async () => {
    setError("");
    setInfo("");
    const result = await resendVerificationOtp({ email });
    if (!result.success) {
      setError(result.message);
      return;
    }
    setInfo("A new clinical security OTP has been dispatched.");
  };

  return (
    <AuthCard
      title="Verify Session"
      subtitle={`A unique 6-digit medical authorization code was sent to ${email}.`}
    >
      <form onSubmit={onVerify} className="space-y-6" noValidate>
        <div className="space-y-2">
          {error && <AlertMessage variant="destructive" message={error} />}
          {(rateLimit.active || info) && (
            <AlertMessage variant="warning" message={rateLimit.message || info} />
          )}
        </div>

        <div className="relative group">
          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <FormInput
            id="otp-code"
            name="otp"
            label="Clinical Authorization Code"
            labelClassName="hidden"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            placeholder="000000"
            className="text-center text-3xl lg:text-4xl tracking-[0.4em] font-sans font-black h-16 lg:h-20 pl-0 border-2 border-primary/20 focus:border-primary transition-all rounded-2xl bg-surface-muted/50"
          />
        </div>

        <div className="space-y-3">
          <Button type="submit" loading={isSubmitting} disabled={!canSubmit} className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20">
            Authorize Access
          </Button>
          <button
            type="button"
            onClick={onResend}
            disabled={isSubmitting}
            className="w-full text-xs font-bold text-primary hover:text-emerald-green transition-colors uppercase tracking-[0.2em] py-2"
          >
            Request New Code
          </button>
        </div>

        <div className="pt-6 border-t border-border text-center">
          <Link className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group" to="/login">
            Back to Secure Login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default OtpVerificationPage;
