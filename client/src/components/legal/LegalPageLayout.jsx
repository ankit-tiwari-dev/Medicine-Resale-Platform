import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Section from "../layout/Section";
import Container from "../layout/Container";

const LegalPageLayout = ({ title, subtitle, lastUpdated, children }) => {
  return (
    <Section className="py-16 lg:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <header className="space-y-4 border-b border-border pb-10 mb-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Legal</p>
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground uppercase font-serif">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base lg:text-lg text-muted-foreground font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
            {lastUpdated && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Last updated: {lastUpdated}
              </p>
            )}
          </header>

          <article className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            {children}
          </article>
        </div>
      </Container>
    </Section>
  );
};

export const LegalSection = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-lg font-bold tracking-tight text-foreground uppercase font-serif">
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export default LegalPageLayout;
