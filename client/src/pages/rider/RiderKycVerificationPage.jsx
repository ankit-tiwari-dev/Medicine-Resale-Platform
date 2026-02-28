import { useState } from "react";
import { verifyAadhar, verifyKycDoc, verifyPayout } from "../../api/kycApi";
import Button from "../../components/common/Button";
import Container from "../../components/layout/Container";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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
    { key: 'aadhar', label: 'E-KYC Aadhaar Link', type: 'GOVT', desc: 'Biometric and OTP-based identity bridge.' },
    { key: 'doc', label: 'PAN/License OCR', type: 'DOCS', desc: 'Optical character matching and forgery scan.' },
    { key: 'payout', label: 'Financial Channel', type: 'BANK', desc: 'Escrow account link and bank verification.' }
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <Container className="py-8 lg:py-12 max-w-[900px]">
        {/* Header */}
        <div className="mb-10">
          <Link to="/rider" className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] mb-6">
            BACK TO COMMAND
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                Forensic Engine Active
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                Active <span className="text-primary">E-Verification</span>
              </h1>
              <p className="text-muted-foreground mt-2 font-sans font-medium">
                Execute real-time digital verification sequences for instant network access.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-[2.5rem] p-8 lg:p-10 border border-border shadow-sm">
              <div className="space-y-10">
                {steps.map((step) => (
                  <div key={step.key} className="flex gap-6 relative group">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-md font-black text-[10px] ${verificationState[step.key] === 'success'
                      ? 'bg-emerald-green text-white'
                      : 'bg-muted/50 text-primary border border-primary/10 group-hover:bg-primary/5'
                      }`}>
                      {verificationState[step.key] === 'success' ? "DONE" : step.type}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-foreground font-serif">{step.label}</h3>
                        {verificationState[step.key] === 'success' && (
                          <span className="text-[10px] font-bold text-emerald-green uppercase tracking-widest bg-emerald-green/10 px-2 py-1 rounded-lg">Verified</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6">{step.desc}</p>

                      {verificationState[step.key] === 'idle' && (
                        <Button
                          variant="outline"
                          className="h-10 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest border-2 hover:bg-primary hover:text-white transition-all"
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

            <div className="p-8 bg-clinical-navy rounded-[2.5rem] text-white flex items-center gap-6 shadow-xl shadow-clinical-navy/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-soft-cyan opacity-[0.05] rounded-full blur-[80px] -mr-24 -mt-24"></div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md font-black text-[10px] text-soft-cyan">
                SECURE
              </div>
              <div>
                <h4 className="text-lg font-bold font-serif mb-1">Administrative Lock</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                  AllDistribution assignments are locked until a minimum trust coefficient of 0.85 is achieved through digital verification.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar context */}
          <div className="space-y-6">
            <div className="bg-card rounded-[2rem] p-8 border border-border shadow-md">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">
                Audit Velocity
              </h3>
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-2xl">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Estimated Time</p>
                  <p className="text-sm font-bold text-foreground">24-48 Clinical Hours</p>
                </div>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Manual Queue</p>
                  <p className="text-sm font-bold text-foreground">Priority Track Active</p>
                </div>
              </div>
            </div>

            <div className="bg-muted-amber rounded-[2rem] p-8 text-amber-950 flex flex-col gap-2 shadow-lg shadow-muted-amber/10">
              <div className="text-[10px] font-black uppercase tracking-widest bg-amber-950/10 w-fit px-2 py-1 rounded-lg mb-1">Risk Sync</div>
              <p className="text-[10px] font-bold opacity-80 leading-relaxed italic">
                Any archival inconsistency between Aadhaar and PAN will trigger a mandatory manual forensic interview with MedAImart compliance.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RiderKycVerificationPage;
