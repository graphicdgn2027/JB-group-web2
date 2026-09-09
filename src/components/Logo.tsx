import React from "react";
import relianceLogo from "@/assets/reliance_logo.png";
import fullRelianceLogo from "@/assets/full_reliance_logo.png";

interface LogoProps {
  /**
   * 'dark' = for dark backgrounds (Hero, Footer, unscrolled header) -> Full white/red logo
   * 'light' = for light backgrounds (scrolled header) -> Full logo adapted for light background
   */
  variant?: "dark" | "light" | "auto";
  scrolled?: boolean;
  className?: string;
  heightClass?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "auto",
  scrolled = false,
  className = "",
  heightClass = "h-8 md:h-9",
}) => {
  // If variant is explicitly set, we use that. Otherwise, we determine it via CSS.
  const forceLight = variant === "light";
  const forceDark = variant === "dark";

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {forceLight && (
        <div className="flex items-center cursor-pointer select-none group">
          <img
            src={fullRelianceLogo}
            alt="Reliance Trade International"
            className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
          />
        </div>
      )}
      {forceDark && (
        <div className="flex items-center cursor-pointer select-none group">
          <img
            src={relianceLogo}
            alt="Reliance Trade International"
            className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]`}
          />
        </div>
      )}
      {!forceLight && !forceDark && (
        <div className="flex items-center cursor-pointer select-none group relative">
          {/* Light Mode Logo (Blue Text) - Shown when scrolled OR when in light theme */}
          <img
            src={fullRelianceLogo}
            alt="Reliance Trade International"
            className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] ${
              scrolled ? "block" : "block dark:hidden"
            }`}
          />
          {/* Dark Mode Logo (White Text) - Shown only when not scrolled AND in dark theme */}
          <img
            src={relianceLogo}
            alt="Reliance Trade International"
            className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${
              scrolled ? "hidden" : "hidden dark:block"
            } absolute top-0 left-0`}
          />
        </div>
      )}
    </div>
  );
};

export default Logo;
