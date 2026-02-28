import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertMessage } from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import { FormInput } from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/layout/AuthCard";

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
      ? { sessionId: otpSession.userId, userOtp: otp }
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
      title="Enter Code"
      subtitle={`Enter the 6-digit code sent to ${email}.`}
    >
      <form onSubmit={onVerify} className="space-y-8" noValidate>
        <div className="space-y-2">
          {error && <AlertMessage variant="destructive" message={error} />}
          {(rateLimit.active || info) && (
            <AlertMessage variant="warning" message={rateLimit.message || info} />
          )}
        </div>

        <div className="relative">
          <FormInput
            id="otp-code"
            name="otp"
            label="6-digit Code"
            labelClassName="hidden"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            placeholder="000000"
            className="text-center text-4xl lg:text-5xl tracking-[0.4em] font-black h-20 lg:h-24 pb-2 border-border/40 focus:border-foreground transition-all rounded-3xl bg-muted/50"
          />
        </div>

        <div className="space-y-4">
          <Button type="submit" loading={isSubmitting} disabled={!canSubmit} className="w-full h-14 text-sm font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all rounded-full">
            Verify
          </Button>
          <button
            type="button"
            onClick={onResend}
            disabled={isSubmitting}
            className="w-full text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest py-2"
          >
            Resend Code
          </button>
        </div>

        <div className="pt-8 border-t border-border/40 text-center">
          <Link className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest" to="/login">
            Back to Login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default OtpVerificationPage;
