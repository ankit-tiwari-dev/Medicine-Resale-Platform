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
          <div className="lg:col-span-3 border-b border-border/40 pb-12">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-foreground uppercase">
              How It Works
            </h2>
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="p-10 border border-border rounded-3xl space-y-4 hover:border-foreground/40 transition-all bg-muted/50 shadow-sm">
              <h3 className="text-xl font-bold tracking-tight text-foreground uppercase">
                {idx + 1}. {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & CTA Section */}
      <section className="max-w-4xl mx-auto px-6 text-center py-20 border-t border-border/40">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase leading-tight">
              Safety First
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
              We care about your health. Our team verifies every seller and every medicine.
              You can buy and sell with peace of mind.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-foreground text-background px-16 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-foreground/90 transition-all">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingTrustSections;
