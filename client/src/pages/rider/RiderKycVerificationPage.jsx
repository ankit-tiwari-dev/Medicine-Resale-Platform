import { useState } from "react";
import { verifyAadhar, verifyKycDoc, verifyPayout } from "../../api/kycApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Landmark, FileScan, Building2, CheckCircle2, LockKeyhole } from "lucide-react";

const RiderKycVerificationPage = () => {
  const [docType, setDocType] = useState("pan");
  const [loading, setLoading] = useState(false);
  const [verificationState, setVerificationState] = useState({
    aadhar: 'idle', // idle, pending, success
    doc: 'idle',
    payout: 'idle'
  });

  const runAction = async (action) => {
    setLoading(true);
    setVerificationState(prev => ({ ...prev, [action]: 'pending' }));
    try {
      if (action === "aadhar") await verifyAadhar({});
      if (action === "doc") await verifyKycDoc({ docType });
      if (action === "payout") await verifyPayout({});

      setVerificationState(prev => ({ ...prev, [action]: 'success' }));
      toast.success(`Digital ${action} verification finalized.`);
    } catch (error) {
      setVerificationState(prev => ({ ...prev, [action]: 'idle' }));
      toast.error("Verification engine mismatch. Manual review triggered.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'aadhar', label: 'E-KYC Aadhaar Link', icon: Landmark, desc: 'Biometric and OTP-based identity bridge.' },
    { key: 'doc', label: 'PAN/License OCR', icon: FileScan, desc: 'Optical character matching and forgery scan.' },
    { key: 'payout', label: 'Financial Channel', icon: Building2, desc: 'Escrow account link and bank verification.' }
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[900px]">
        {/* Header */}
        <div className="mb-10 font-sans">
          <Link to="/rider" className="inline-flex items-center gap-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            <span className="tracking-widest opacity-60">BACK TO</span> COMMAND
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 opacity-60">
                Forensic Engine Active
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground tracking-tight">
                Active <span className="text-primary">E-Verification</span>
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-sans font-medium opacity-70">
                Execute real-time digital verification sequences for instant network access.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-8 lg:p-10 border border-border shadow-lg shadow-black/5 font-sans">
              <div className="space-y-10">
                {steps.map((step) => (
                  <div key={step.key} className="flex gap-6 relative group lg:items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${verificationState[step.key] === 'success'
                      ? 'bg-emerald-green text-white'
                      : 'bg-muted/50 text-primary border border-primary/10 group-hover:bg-primary/5'
                      }`}>
                      {verificationState[step.key] === 'success' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <step.icon size={18} strokeWidth={2.5} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-foreground font-serif leading-tight tracking-tight">{step.label}</h3>
                        {verificationState[step.key] === 'success' && (
                          <span className="text-[8px] font-bold text-emerald-green uppercase tracking-widest bg-emerald-green/10 px-2 py-1 rounded-md">Verified</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed mb-4 opacity-70">{step.desc}</p>
 
                      {verificationState[step.key] === 'idle' && (
                        <Button
                          variant="outline"
                          className="h-9 px-6 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-border hover:bg-primary hover:text-white transition-all shadow-sm"
                          onClick={() => runAction(step.key)}
                          loading={loading && verificationState[step.key] === 'pending'}
                        >
                          Initialize Digital Audit
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-clinical-navy rounded-xl text-white flex items-center gap-6 shadow-xl shadow-clinical-navy/5 relative overflow-hidden group font-sans">
              <div className="absolute top-0 right-0 w-48 h-48 bg-soft-cyan opacity-[0.03] rounded-full blur-[80px] -mr-24 -mt-24"></div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-md text-soft-cyan">
                <LockKeyhole size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif mb-1 leading-tight tracking-tight">Administrative Lock</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic opacity-80">
                  Tasks are locked until a minimum trust coefficient of 0.85 is achieved.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar context */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-8 border border-border shadow-lg shadow-black/5 font-sans">
              <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-6 opacity-40">
                Audit Velocity
              </h3>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Estimated Time</p>
                  <p className="text-[11px] font-bold text-foreground">24-48 Clinical Hours</p>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1 opacity-60">Manual Queue</p>
                  <p className="text-[11px] font-bold text-foreground">Priority Track Active</p>
                </div>
              </div>
            </div>

            <div className="bg-muted-amber rounded-xl p-8 text-amber-950 flex flex-col gap-2 shadow-lg shadow-muted-amber/10 font-sans">
              <div className="text-[9px] font-bold uppercase tracking-widest bg-amber-950/10 w-fit px-2 py-1 rounded-md mb-1">Risk Sync</div>
              <p className="text-[10px] font-bold opacity-80 leading-relaxed italic uppercase tracking-tight">
                Any inconsistency will trigger a manual forensic interview.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderKycVerificationPage;
