import { Link } from "react-router-dom";
import { Shield, Search, CheckCircle } from "lucide-react";
import Button from "../common/Button";

const LandingHero = ({ healthStatus, healthLoading, healthError }) => {
  return (
    <div className="relative bg-[#050505] rounded-[2.5rem] overflow-hidden border border-white/5">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-soft-cyan opacity-10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-green opacity-10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

      <div className="relative z-10 p-8 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-soft-cyan text-xs font-bold mb-6 font-sans">
              <Shield className="w-4 h-4" />
              {healthLoading ? "System Syncing..." : healthError ? "Verified Network" : "AI-Verified Network Active"}
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight font-serif text-white">
              India's First <span className="text-soft-cyan">AI-Verified</span> Medicine Resale
            </h1>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl font-sans">
              Buy and sell unused medicines securely. Every listing is AI-verified for authenticity, every transaction is escrow-protected, and every delivery is rider-certified.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse">
                <Button variant="primary" size="lg" className="w-full !bg-emerald-green hover:!bg-emerald-green/90 border-none shadow-lg shadow-emerald-green/20 !text-white">
                  Browse Medicines
                  <Search className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="outline" size="lg" className="w-full border-white/20 !text-white hover:bg-white/10 !bg-transparent">
                  Sell Your Medicines
                </Button>
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-white/10 font-sans">
              <div>
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Verified Items</div>
              </div>
              <div className="border-x border-white/10 px-8">
                <div className="text-2xl font-bold text-white mb-1">5K+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Trust Rate</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-soft-cyan/10 to-emerald-green/10 rounded-3xl blur-2xl transform rotate-2"></div>
            <div className="relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-4 shadow-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
                alt="Medical Verification"
                className="rounded-2xl w-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
