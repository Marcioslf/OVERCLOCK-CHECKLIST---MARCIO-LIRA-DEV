import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

/** Official Claude (Anthropic) Sunburst Asterisk Icon */
export const ClaudeLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M13.82 2.5a1.2 1.2 0 0 0-1.74-.92l-2.7 1.56a1.2 1.2 0 0 0-.58 1.04v3.1a1.2 1.2 0 0 1-.6 1.04l-2.68 1.55a1.2 1.2 0 0 0-.58 1.04v3.12a1.2 1.2 0 0 0 .58 1.04l2.68 1.55a1.2 1.2 0 0 1 .6 1.04v3.12c0 .44.24.84.62 1.04l2.66 1.54a1.2 1.2 0 0 0 1.74-.92v-3.12a1.2 1.2 0 0 1 .6-1.04l2.68-1.55a1.2 1.2 0 0 0 .58-1.04v-3.12a1.2 1.2 0 0 0-.58-1.04l-2.68-1.55a1.2 1.2 0 0 1-.6-1.04V2.5Z"
      fill="url(#claude-grad)"
    />
    <path
      d="M4.5 9.8 8 11.8v2.4L4.5 16.2a1 1 0 0 1-1.5-.86v-4.68a1 1 0 0 1 1.5-.86ZM19.5 9.8 16 11.8v2.4l3.5 2a1 1 0 0 0 1.5-.86v-4.68a1 1 0 0 0-1.5-.86Z"
      fill="url(#claude-grad)"
      opacity="0.9"
    />
    <defs>
      <linearGradient id="claude-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="0.5" stopColor="#D97706" />
        <stop offset="1" stopColor="#CC5500" />
      </linearGradient>
    </defs>
  </svg>
);

/** Official Google Gemini 4-Point Sparkle Icon */
export const GeminiLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 1C12 7.075 7.075 12 1 12C7.075 12 12 16.925 12 23C12 16.925 16.925 12 23 12C16.925 12 12 7.075 12 1Z"
      fill="url(#gemini-grad)"
    />
    <defs>
      <linearGradient id="gemini-grad" x1="1" y1="1" x2="23" y2="23" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4" />
        <stop offset="0.35" stopColor="#9B51E0" />
        <stop offset="0.7" stopColor="#EA4335" />
        <stop offset="1" stopColor="#FBBC04" />
      </linearGradient>
    </defs>
  </svg>
);

/** Official DeepSeek Whale & Tech Shape Icon */
export const DeepSeekLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M18.8 8.4C17.2 5.5 14.1 3.5 10.6 3.5C5.8 3.5 1.9 7.4 1.9 12.2C1.9 14.8 3.1 17.1 5 18.7L3.5 20.8C3.2 21.2 3.5 21.8 4 21.8H12.5C17.2 21.8 21.1 17.9 21.1 13.2C21.1 11.4 20.2 9.7 18.8 8.4Z"
      fill="url(#deepseek-grad)"
    />
    <path
      d="M7.8 11.8C8.5 11.8 9.1 11.2 9.1 10.5C9.1 9.8 8.5 9.2 7.8 9.2C7.1 9.2 6.5 9.8 6.5 10.5C6.5 11.2 7.1 11.8 7.8 11.8Z"
      fill="#FFFFFF"
    />
    <path
      d="M14.5 16.8C13.2 17.5 11.8 17.8 10.2 17.8C8.8 17.8 7.5 17.5 6.3 16.9C6 16.7 5.6 17 5.7 17.4C6.5 19.3 8.3 20.6 10.5 20.6C12.7 20.6 14.6 19.3 15.3 17.4C15.4 17 15 16.7 14.5 16.8Z"
      fill="#FFFFFF"
      opacity="0.9"
    />
    <defs>
      <linearGradient id="deepseek-grad" x1="2" y1="3.5" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" />
        <stop offset="0.5" stopColor="#0284C7" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
    </defs>
  </svg>
);

/** Official ChatGPT (OpenAI) Spiral Rosette Icon */
export const ChatGPTLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M21.5 10.3a5.3 5.3 0 0 0-.46-4.38 5.42 5.42 0 0 0-4.8-2.67 5.4 5.4 0 0 0-1.74.29 5.38 5.38 0 0 0-4.2-1.99 5.42 5.42 0 0 0-5.18 3.84 5.38 5.38 0 0 0-3.3 2.4 5.42 5.42 0 0 0 .68 5.46 5.38 5.38 0 0 0 .46 4.38 5.42 5.42 0 0 0 4.8 2.67c.6 0 1.18-.1 1.74-.29a5.38 5.38 0 0 0 4.2 1.99 5.42 5.42 0 0 0 5.18-3.84 5.38 5.38 0 0 0 3.3-2.4 5.42 5.42 0 0 0-.68-5.46Z"
      fill="#10A37F"
    />
    <path
      d="M10.3 19.35a3.67 3.67 0 0 1-2.43-.91l1.45-1.45a1.64 1.64 0 0 0 1.98.05l-.01 2.05a3.63 3.63 0 0 1-.99.26Zm5.6-1.55a3.67 3.67 0 0 1-2.07 1.62l-.01-2.05a1.64 1.64 0 0 0 .93-1.76l1.78.96c-.16.44-.38.85-.63 1.23Zm2.36-4.5a3.67 3.67 0 0 1-.36 2.6l-1.78-.96a1.64 1.64 0 0 0-.05-1.99l1.78-1.03c.27.42.42.9.41 1.38Zm-3.96-3.8a1.64 1.64 0 0 0-1.98-.05l.01-2.05a3.67 3.67 0 0 1 3.42.65l-1.45 1.45Zm-5.6 1.55a3.67 3.67 0 0 1 2.07-1.62l.01 2.05a1.64 1.64 0 0 0-.93 1.76l-1.78-.96c.16-.44.38-.85.63-1.23Zm-2.36 4.5c0-.48.14-.96.41-1.38l1.78 1.03a1.64 1.64 0 0 0 .05 1.99l-1.78.96c-.3-.72-.46-1.5-.46-2.6Z"
      fill="#FFFFFF"
    />
    <path
      d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
      fill="#FFFFFF"
    />
  </svg>
);

/** Apple macOS Style Notepad Icon */
export const MacNotesLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Base notepad back */}
    <rect x="3" y="2" width="18" height="20" rx="3.5" fill="url(#notes-bg)" />
    {/* Yellow paper body */}
    <rect x="4" y="6" width="16" height="15" rx="1.5" fill="#FFFBEB" />
    {/* Orange Header tab */}
    <path d="M4 6V4C4 3.17 4.67 2.5 5.5 2.5H18.5C19.33 2.5 20 3.17 20 4V6H4Z" fill="url(#notes-header)" />
    {/* Lined paper stripes */}
    <line x1="7" y1="10" x2="17" y2="10" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="7" y1="13.5" x2="17" y2="13.5" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="7" y1="17" x2="14" y2="17" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" />
    {/* Pencil detail */}
    <circle cx="17.5" cy="17.5" r="3" fill="#F59E0B" />
    <path d="M16.5 18.5L18.5 16.5M16 19L16.5 18.5" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="notes-bg" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="notes-header" x1="4" y1="2.5" x2="20" y2="6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
    </defs>
  </svg>
);
