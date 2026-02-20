import LandingSectionTitle from "./LandingSectionTitle";
import { Shield, CheckCircle, Truck, TrendingUp, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const processSteps = [
  {
    title: "AI Visual Scanning",
    description: "Advanced AI scans packaging, batch numbers, and expiry dates to detect tampering and counterfeit products.",
    icon: CheckCircle,
    color: "text-emerald-green",
    bg: "bg-emerald-green/10",
    border: "hover:border-emerald-green/20",
    status: "Enabled"
  },
  {
    title: "Escrow Protection",
    description: "Your funds are held securely. The seller only receives payment after the medicine is delivered and verified.",
    icon: Shield,
    color: "text-soft-cyan",
    bg: "bg-soft-cyan/10",
    border: "hover:border-soft-cyan/20",
    status: "Secured"
  },
  {
    title: "Physical Verification",
    description: "Our certified riders inspect medicine condition and packaging at pickup to ensure compliance with standards.",
    icon: Truck,
    color: "text-muted-amber",
    bg: "bg-muted-amber/10",
    border: "hover:border-muted-amber/20",
    status: "Certified"
  }
];

const LandingTrustSections = () => {
  return (
    <div className="space-y-32">
      {/* 1. Protocol Section */}
      <section className="space-y-16">
        <div className="text-center">
          <LandingSectionTitle
            eyebrow="Verification Protocol"
            title={<span>Trust Protocol <span className="text-soft-cyan">Layers</span></span>}
            subtitle="Every medicine goes through our rigorous 3-step verification process ensuring 100% authenticity and safety."
            className="flex flex-col items-center"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {processSteps.map((step) => (
            <article
              key={step.title}
              className={`bg-card rounded-2xl p-10 shadow-sm border border-border/50 ${step.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
            >
              <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mb-8`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <h3 className="text-xl font-black text-foreground mb-4 font-serif">
                {step.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed font-sans">
                {step.description}
              </p>
              <div className="mt-auto">
                <div className={`flex items-center gap-2 py-2 px-3 ${step.bg} rounded-lg w-fit`}>
                  <div className={`w-2 h-2 ${step.color.replace('text-', 'bg-')} rounded-full`}></div>
                  <span className={`text-[10px] font-bold ${step.color} uppercase tracking-wider`}>{step.status}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 2. Scale Banner */}
      <section className="bg-clinical-navy rounded-[3rem] p-12 lg:p-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-soft-cyan opacity-10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-bold mb-16 font-serif">Trust at <span className="text-soft-cyan">Scale</span></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "100% Authentic", icon: CheckCircle, value: "Verified", color: "text-emerald-green" },
              { label: "Escrow Protected", icon: Shield, value: "Secured", color: "text-soft-cyan" },
              { label: "2-Hour Delivery", icon: Clock, value: "Active", color: "text-muted-amber" },
              { label: "5K+ Trusted Users", icon: Users, value: "Community", color: "text-white" }
            ].map((item, idx) => (
              <div key={idx} className="group flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-white/10 transition-all">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Final CTA */}
      <section className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-gradient-to-br from-emerald-green to-emerald-green-dark rounded-[2.5rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 font-serif">
              Revolutionize How You <br className="hidden md:block" /> Handle Medicines
            </h2>
            <p className="text-lg text-emerald-green-light mb-10 max-w-xl mx-auto font-sans">
              Join the most secure resale network and help reduce medical waste while saving on your healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button className="w-full bg-white !text-emerald-green-dark hover:bg-slate-100 border-none px-8 h-14 text-lg font-bold rounded-xl shadow-xl">
                  Browse Store
                </Button>
              </Link>
              <Link to="/sell">
                <Button className="w-full bg-clinical-navy !text-white hover:bg-clinical-navy/90 border-none px-8 h-14 text-lg font-bold rounded-xl shadow-xl">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingTrustSections;
