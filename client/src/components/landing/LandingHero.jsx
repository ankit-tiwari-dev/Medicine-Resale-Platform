import { Link } from "react-router-dom";
import Button from "../common/Button";

const LandingHero = () => {
  return (
    <div className="relative py-32 lg:py-56 overflow-hidden bg-background flex flex-col items-center text-center px-6">
      <div className="max-w-4xl space-y-10">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">
          MedAImart
        </p>

        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] uppercase font-serif">
          MedAImart
        </h1>

        <p className="text-xl lg:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          Secure marketplace for buying and selling verified medicines.
        </p>

        <p className="text-base lg:text-lg text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
          MedAImart is a web application that connects buyers, sellers, and delivery partners to
          trade verified medical supplies safely. List medicines, browse verified inventory,
          place orders, and manage payments in one trusted platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link to="/browse">
            <Button className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 px-10 h-12 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-foreground/5">
              Start Buying
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="w-full sm:w-auto border-border hover:border-foreground/20 text-foreground px-10 h-12 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all">
              Start Selling
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
