import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({ children, className, hover = true, glass = false }) => {
  return (
    <div
      className={cn(
        'card',
        glass && 'card-glass',
        className
      )}
    >
      {children}
    </div>
  );
};



const CardHeader = ({ title, subtitle, icon: Icon, className }) => (
  <div className={cn('flex items-center gap-4 mb-6 pb-4 border-b border-white/5', className)}>
    {Icon && (
      <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
        <Icon className="w-6 h-6" />
      </div>
    )}
    <div>
      <h3 className="text-xl font-bold text-text-primary leading-tight">{title}</h3>
      {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
    </div>
  </div>
);

export { Card, CardHeader };
