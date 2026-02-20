import { useTheme } from "../../theme/ThemeContext";
import blackLogo from "../../assets/black-theme-logo.png";
import whiteLogo from "../../assets/white-theme-logo.png";

export const AppLogo = () => {
  const { isDarkMode } = useTheme();
  const logoSrc = isDarkMode ? blackLogo : whiteLogo;

  return (
    <div className="inline-flex items-center gap-3">
      <img src={logoSrc} alt="MedAImart Logo" className="h-8 w-auto" />
      <div>
        <p className="text-sm font-semibold text-primary">MedAImart</p>
        <p className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Verified Exchange</p>
      </div>
    </div>
  );
};
