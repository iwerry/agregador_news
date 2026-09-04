import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text?: string;
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text = 'AGREGADOR DE NOTÍCIAS',
  className = 'text-[9px] sm:text-[10px] font-mono tracking-widest text-[#00e5ff] uppercase font-bold',
  speed = 85,
  deleteSpeed = 40,
  pauseDuration = 2200
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, text, speed, deleteSpeed, pauseDuration]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      <span className="inline-block w-[1.5px] h-[0.9em] bg-current ml-0.5 animate-pulse" />
    </span>
  );
};
