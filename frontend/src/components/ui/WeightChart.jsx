import React from 'react';
import { motion } from 'framer-motion';

const WeightChart = ({ data, unit = 'kg' }) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-[10px] items-center uppercase font-black tracking-widest text-text-muted bg-white/[0.02] rounded-2xl border border-dashed border-white/5">
        Insufficient Data for Trend
      </div>
    );
  }

  const padding = 20;
  const width = 300;
  const height = 120;
  
  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights) - 2;
  const maxWeight = Math.max(...weights) + 2;
  const range = maxWeight - minWeight;

  const getX = (index) => padding + (index * (width - 2 * padding)) / (data.length - 1);
  const getY = (weight) => height - padding - ((weight - minWeight) * (height - 2 * padding)) / range;

  const points = data.map((d, i) => `${getX(i)},${getY(d.weight)}`).join(' ');
  
  // Area path
  const areaPoints = [
    `${getX(0)},${height}`,
    ...data.map((d, i) => `${getX(i)},${getY(d.weight)}`),
    `${getX(data.length - 1)},${height}`
  ].join(' ');

  return (
    <div className="relative group">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <motion.polygon
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          points={areaPoints}
          fill="url(#chartGradient)"
        />

        {/* Line */}
        <motion.polyline
          fill="none"
          stroke="var(--color-brand-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data points */}
        {data.map((d, i) => (
          <motion.circle
            key={i}
            cx={getX(i)}
            cy={getY(d.weight)}
            r="4"
            fill="var(--color-bg-primary)"
            stroke="var(--color-brand-primary)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 + 0.5 }}
          />
        ))}
      </svg>
      
      <div className="flex justify-between mt-2 px-1">
         <span className="text-[10px] items-center uppercase font-black tracking-widest text-text-muted">{new Date(data[0].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
         <span className="text-[10px] items-center uppercase font-black tracking-widest text-text-muted">{new Date(data[data.length-1].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
};

export default WeightChart;
