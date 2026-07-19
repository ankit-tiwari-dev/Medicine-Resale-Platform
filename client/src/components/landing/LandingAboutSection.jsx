import { Link } from "react-router-dom";

const LandingAboutSection = () => {
  return (
    <section id="about" className="max-w-4xl mx-auto px-6 space-y-8">
      <div className="space-y-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          About MedAImart
        </p>
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground uppercase font-serif">
          What is MedAImart?
        </h2>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 lg:p-10 shadow-sm space-y-6 text-left">
        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
          <strong className="text-foreground">MedAImart</strong> is a web application that provides a
          secure marketplace for buying and selling verified medicines and medical supplies. The
          platform helps users list unused or surplus medicines, browse verified listings, place
          orders, manage payments through an integrated wallet, and coordinate delivery with trusted
          logistics partners.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          MedAImart is operated at{" "}
          <a
            href="https://medicine-resale-platform.vercel.app"
            className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
          >
            medicine-resale-platform.vercel.app
          </a>
          . Users can create an account with email and password, or sign in with their Google
          account to access buyer, seller, and delivery features securely.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">
              For buyers
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Browse verified medicine listings, add items to cart, checkout securely, and track
              delivery until it arrives.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-5 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">
              For sellers
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload medicine details, pass listing verification, receive orders, and manage
              payouts through the MedAImart wallet.
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          MedAImart is not a pharmacy and does not provide medical advice. It is a technology
          platform that connects verified buyers and sellers. By using MedAImart, you agree to our{" "}
          <Link to="/terms" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default LandingAboutSection;
