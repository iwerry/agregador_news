import React from 'react';

interface DraftLogoProps {
  className?: string;
  height?: number | string;
}

export const DraftLogo: React.FC<DraftLogoProps> = ({
  className = 'h-10 w-auto',
}) => {
  return (
    <img
      src="/draftlogo.svg"
      alt="DRAFT CREATIVE STUDIO"
      className={`select-none object-contain ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};
