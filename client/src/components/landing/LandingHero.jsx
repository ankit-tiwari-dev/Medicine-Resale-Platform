import { Link } from "react-router-dom";
import Button from "../common/Button";

const LandingHero = () => {
  return (
    <div className="relative py-32 lg:py-56 overflow-hidden bg-background flex flex-col items-center text-center px-6">
      <div className="max-w-4xl space-y-10">
        <p className="text-xs font-bold tracking-[0.35em] text-primary normal-case">
          MedAImart
        </p>

        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] normal-case font-serif">
          MedAImart
        </h1>

        <p className="text-xl lg:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
          A secure peer-to-peer marketplace for buying, selling, and redistributing verified surplus medicines.
        </p>

        <p className="text-base lg:text-lg text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
          MedAImart is a web application and technology platform that connects verified buyers, sellers, and delivery partners.
          It provides a structured environment to list unexpired, surplus medicines, browse quality-checked inventory, complete transactions via secure wallet escrows, and coordinate deliveries with registered logistics riders, thereby reducing pharmaceutical waste and improving access to affordable healthcare.
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
