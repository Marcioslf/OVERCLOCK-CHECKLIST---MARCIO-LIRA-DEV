import React from 'react';
import logoImg from '../assets/images/project_logo_1787201165452.jpg';

interface ProjectLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isBlinking?: boolean;
  withGlow?: boolean;
}

export const ProjectLogo: React.FC<ProjectLogoProps> = ({
  className = '',
  size = 'md',
  isBlinking = true,
  withGlow = true,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-md',
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
    '2xl': 'w-32 h-32 rounded-3xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-black ${
        sizeClasses[size]
      } ${isBlinking ? 'animate-mascot-blink' : ''} ${
        withGlow ? 'shadow-[0_0_20px_rgba(255,23,68,0.5)]' : ''
      } ${className}`}
      id="project-brand-logo"
    >
      <img
        src={logoImg}
        alt="Overclock Flame Mascot Logo"
        className="w-full h-full object-cover select-none pointer-events-none"
        referrerPolicy="no-referrer"
      />
      {/* Scanline CRT overlay subtle effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 pointer-events-none" />
    </div>
  );
};
