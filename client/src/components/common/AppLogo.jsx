export const AppLogo = ({ className = "" }) => {
  return (
    <div className={`text-lg font-black tracking-tighter text-foreground uppercase flex items-center gap-2 ${className}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background text-xs italic">M</div>
        <span>MedAImart</span>
    </div>
  );
};
