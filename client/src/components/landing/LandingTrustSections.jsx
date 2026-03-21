const LandingTrustSections = () => {
  const steps = [
    {
      title: "Register",
      description: "Create your account as a buyer or seller in minutes."
    },
    {
      title: "Verify",
      description: "Every medicine is checked for quality and safety by our team."
    },
    {
      title: "Delivery",
      description: "Fast and secure shipping directly to your location."
    }
  ];

  return (
    <div className="space-y-40 py-20 bg-background">

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-20">
          <div className="lg:col-span-3 border-b border-border pb-8">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground uppercase font-serif">
              How It Works
            </h2>
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="p-8 border border-border rounded-xl space-y-3 hover:border-primary/30 transition-all bg-card shadow-sm">
              <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">
                {idx + 1}. {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & CTA Section */}
      <section className="max-w-4xl mx-auto px-6 text-center py-20 border-t border-border">
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight uppercase leading-tight font-serif">
              Safety <span className="text-primary font-serif">First</span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
              We care about your health. Our team verifies every seller and every medicine.
              You can buy and sell with peace of mind.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-foreground text-background px-12 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-foreground/90 transition-all shadow-lg shadow-foreground/5">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingTrustSections;
