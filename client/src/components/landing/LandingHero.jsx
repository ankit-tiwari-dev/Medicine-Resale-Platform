import { Link } from "react-router-dom";
import Button from "../common/Button";

const LandingHero = () => {
  return (
    <div className="relative py-32 lg:py-56 overflow-hidden bg-background flex flex-col items-center text-center px-6">
      <div className="max-w-4xl space-y-10">
        <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.85] uppercase">
          Buy and sell <br />
          <span className="text-secondary-foreground/20">verified medicines.</span>
        </h1>

        <p className="text-lg lg:text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
          A secure platform to trade medical supplies with trust.
          Every item is verified for quality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link to="/browse">
            <Button className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 px-12 h-14 text-sm font-bold uppercase tracking-widest rounded-full transition-all">
              Start Buying
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="w-full sm:w-auto border-foreground/10 hover:border-foreground/40 text-foreground px-12 h-14 text-sm font-bold uppercase tracking-widest rounded-full transition-all">
              Start Selling
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
