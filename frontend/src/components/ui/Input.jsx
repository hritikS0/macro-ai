import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({ label, error, className, icon: Icon, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-text-secondary ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-brand-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={cn(
            'input',
            Icon ? 'pl-12 pr-5' : 'px-5',
            error && 'border-danger/50 focus:border-danger/50 focus:ring-danger/10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger font-medium ml-1">{error}</p>}
    </div>
  );
};

const Select = ({ label, options, error, className, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-text-secondary ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'input appearance-none px-5 pr-12',
            error && 'border-danger/50 focus:border-danger/50',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bg-surface text-text-primary">

              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-danger font-medium ml-1">{error}</p>}
    </div>
  );
};

export { Input, Select };
