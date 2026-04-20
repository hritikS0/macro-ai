import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { cn } from '../../utils/cn';

const DonutChart = ({ protein, carbs, fat, size = 160 }) => {
  const total = protein + carbs + fat;
  const radius = size * 0.4;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const data = [
    { value: protein, color: 'var(--color-brand-primary)', label: 'Protein' },
    { value: carbs, color: 'var(--color-accent)', label: 'Carbs' },
    { value: fat, color: 'var(--color-warning)', label: 'Fat' },
  ];

  let currentOffset = 0;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={size * 0.12}
        />
        {data.map((item, idx) => {
          const strokeDasharray = (item.value / total) * circumference;
          const strokeDashoffset = circumference - strokeDasharray;
          const rotation = (currentOffset / total) * 360;
          currentOffset += item.value;

          return (
            <motion.circle
              key={idx}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={size * 0.12}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
              strokeLinecap="round"
              style={{ originX: `${center}px`, originY: `${center}px`, rotate: rotation }}
            />
          );
        })}
      </svg>
    </div>
  );
};

const ProgressBar = ({ label, value, max, color, unit = 'g' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full space-y-2.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.15em]">{label}</span>
        <span className="text-sm font-black tabular">
          {value}{unit} <span className="text-text-muted font-bold opacity-30">/ {max}{unit}</span>
        </span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="h-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const HydrationGauge = ({ value, goal = 2500, size = 120 }) => {
  const percentage = Math.min((value / goal) * 100, 100);
  
  return (
    <div className="relative inline-flex flex-col items-center group">
      <div 
        className="rounded-full border-2 border-white/5 relative overflow-hidden bg-white/[0.02] shadow-inner"
        style={{ width: size, height: size }}
      >
        <motion.div 
          initial={{ y: size }}
          animate={{ y: size - (size * (percentage / 100)) }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm"
        >
          {/* Wave Animation */}
          <motion.div 
            animate={{ x: [-20, 0, -20] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute top-0 left-0 w-[200%] h-4 bg-brand-primary/30 -translate-y-1/2 rounded-[40%]"
          />
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="text-xl font-black tabular">{value}</span>
          <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">ml / {goal}</span>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subvalue, trend, color = 'var(--color-brand-primary)' }) => (
  <Card className="p-5 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">{label}</p>
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-black tabular">{value}</span>
      {subvalue && <span className="text-[10px] uppercase font-bold text-text-muted">{subvalue}</span>}
    </div>
  </Card>
);

export { DonutChart, ProgressBar, HydrationGauge, StatCard };
