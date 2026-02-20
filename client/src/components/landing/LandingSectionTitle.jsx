const LandingSectionTitle = ({ eyebrow, title, subtitle, className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-green font-sans px-3 py-1 bg-emerald-green/5 rounded-full border border-emerald-green/10">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl lg:text-5xl font-bold text-foreground font-serif">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans mt-4">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default LandingSectionTitle;
