import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/Card";
import { Flame, Scale, TrendingDown, TrendingUp, Zap } from "lucide-react";
import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateIdealWeightRange,
} from "../utils/health";

const HealthSandbox = () => {
  const [stats, setStats] = useState({
    weight: 75,
    height: 175,
    age: 25,
    gender: "male",
    activity: "Moderate",
  });

  const bmiRaw = calculateBMI(stats.weight, stats.height);
  const bmiCategory = getBMICategory(Number(bmiRaw));
  const bmr = calculateBMR(stats.weight, stats.height, stats.age, stats.gender);
  const tdee = calculateTDEE(bmr, stats.activity);
  const idealRange = calculateIdealWeightRange(stats.height);

  const updateStat = (key, val) => {
    setStats((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* BMI Section */}
      <div className="bg-surface rounded-2xl border border-border-light overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
        <div className="p-6 border-b border-border-light bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              BMI Calculator
            </h2>
            <span className="text-xs text-text-muted ml-auto">
              Body Mass Index
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              {/* Weight */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text-secondary">
                    Weight
                  </label>
                  <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg">
                    <input
                      type="number"
                      value={stats.weight}
                      onChange={(e) =>
                        updateStat("weight", Number(e.target.value))
                      }
                      className="w-20 bg-transparent text-right font-semibold text-text-primary focus:outline-none"
                    />
                    <span className="text-xs text-text-muted">kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={stats.weight}
                  onChange={(e) => updateStat("weight", Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((stats.weight - 40) / 160) * 100}%, var(--bg-muted) ${((stats.weight - 40) / 160) * 100}%, var(--bg-muted) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>40kg</span>
                  <span>120kg</span>
                  <span>200kg</span>
                </div>
              </div>

              {/* Height */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text-secondary">
                    Height
                  </label>
                  <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-lg">
                    <input
                      type="number"
                      value={stats.height}
                      onChange={(e) =>
                        updateStat("height", Number(e.target.value))
                      }
                      className="w-20 bg-transparent text-right font-semibold text-text-primary focus:outline-none"
                    />
                    <span className="text-xs text-text-muted">cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="120"
                  max="230"
                  value={stats.height}
                  onChange={(e) => updateStat("height", Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((stats.height - 120) / 110) * 100}%, var(--bg-muted) ${((stats.height - 120) / 110) * 100}%, var(--bg-muted) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>120cm</span>
                  <span>175cm</span>
                  <span>230cm</span>
                </div>
              </div>
            </div>

            {/* BMI Result */}
            <div className="bg-muted rounded-xl p-6 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{ backgroundColor: bmiCategory.color }}
              />
              <div className="relative z-10">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-2">
                  Your BMI
                </p>
                <p className="text-5xl font-bold text-text-primary mb-3 tabular-nums">
                  {bmiRaw}
                </p>
                <motion.div
                  key={bmiCategory.label}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                  style={{
                    backgroundColor: `${bmiCategory.color}15`,
                    color: bmiCategory.color,
                  }}
                >
                  {bmiCategory.label}
                </motion.div>
                <div className="mt-6 pt-6 border-t border-border-light">
                  <p className="text-xs text-text-muted mb-1">
                    Ideal Weight Range
                  </p>
                  <p className="text-lg font-semibold text-text-primary">
                    {idealRange.min} — {idealRange.max} kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TDEE Section */}
      <div className="bg-surface rounded-2xl border border-border-light overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
        <div className="p-6 border-b border-border-light bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-warning/10">
              <Flame className="w-5 h-5 text-warning" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Metabolic Targets
            </h2>
            <span className="text-xs text-text-muted ml-auto">
              Daily Energy Needs
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Age
              </label>
              <input
                type="number"
                value={stats.age}
                onChange={(e) => updateStat("age", Number(e.target.value))}
                className="w-full bg-muted border border-border-light rounded-xl px-4 py-2.5 font-medium text-text-primary focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Gender
              </label>
              <select
                value={stats.gender}
                onChange={(e) => updateStat("gender", e.target.value)}
                className="w-full bg-muted border border-border-light rounded-xl px-4 py-2.5 font-medium text-text-primary focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Activity Level
              </label>
              <select
                value={stats.activity}
                onChange={(e) => updateStat("activity", e.target.value)}
                className="w-full bg-muted border border-border-light rounded-xl px-4 py-2.5 font-medium text-text-primary focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Sedentary">Sedentary</option>
                <option value="Light">Light Activity</option>
                <option value="Moderate">Moderate Activity</option>
                <option value="Very">Very Active</option>
                <option value="Extra">Extra Active</option>
              </select>
            </div>
          </div>

          {/* Calorie Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {/* Maintenance */}
            <div className="bg-muted rounded-xl p-5 text-center group hover:bg-muted/80 transition-all cursor-default">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">
                Maintenance
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {tdee}{" "}
                <span className="text-sm font-normal text-text-muted">
                  kcal
                </span>
              </p>
              <p className="text-xs text-text-muted mt-2">Daily baseline</p>
            </div>

            {/* Weight Loss */}
            <div className="bg-muted rounded-xl p-5 text-center group hover:bg-muted/80 transition-all cursor-default">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-5 h-5 text-success" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">
                Weight Loss
              </p>
              <p className="text-2xl font-bold text-success">
                {tdee - 500}{" "}
                <span className="text-sm font-normal text-text-muted">
                  kcal
                </span>
              </p>
              <p className="text-xs text-text-muted mt-2">-0.5kg per week</p>
            </div>

            {/* Muscle Gain */}
            <div className="bg-muted rounded-xl p-5 text-center group hover:bg-muted/80 transition-all cursor-default">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">
                Muscle Gain
              </p>
              <p className="text-2xl font-bold text-warning">
                {tdee + 300}{" "}
                <span className="text-sm font-normal text-text-muted">
                  kcal
                </span>
              </p>
              <p className="text-xs text-text-muted mt-2">+0.25kg per week</p>
            </div>
          </div>

          {/* BMR Info */}
          <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/10">
            <p className="text-xs text-text-muted">
              Basal Metabolic Rate (BMR)
            </p>
            <p className="text-lg font-semibold text-primary">{bmr} kcal/day</p>
            <p className="text-xs text-text-muted mt-1">
              Calories burned at complete rest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSandbox;
