
import React, { PropsWithChildren } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-6 rounded-2xl shadow-lg ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};