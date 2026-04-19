import React, { useState } from 'react';
import { Home, RotateCcw, HelpCircle, Volume2, Settings, Trophy } from 'lucide-react';

interface StyledCircularIconProps {
  iconId: string;
  fallback: React.ElementType;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const iconSizeMap = {
  sm: 16,
  md: 20,
  lg: 28,
};

const getDriveThumbnail = (id: string) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

const StyledCircularIcon: React.FC<StyledCircularIconProps> = ({
  iconId,
  fallback: FallbackIcon,
  color = 'hsl(var(--amit-navy))',
  size = 'md',
  onClick,
}) => {
  const [error, setError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`${sizeMap[size]} rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer`}
      style={{ backgroundColor: color }}
    >
      {!error ? (
        <img
          src={getDriveThumbnail(iconId)}
          className="w-3/5 h-3/5 object-contain"
          onError={() => setError(true)}
          alt="icon"
          crossOrigin="anonymous"
        />
      ) : (
        <FallbackIcon className="text-primary-foreground" size={iconSizeMap[size]} />
      )}
    </button>
  );
};

export { StyledCircularIcon, getDriveThumbnail };
export type { StyledCircularIconProps };
