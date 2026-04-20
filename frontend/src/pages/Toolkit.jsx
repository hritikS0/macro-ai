import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calculator, 
  Activity, 
  Scale, 
  Droplets, 
  Zap, 
  Target,
  Info,
  User,
  Ruler,
  TrendingUp,
  History,
  Activity as ActivityIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { 
  calculateBMI, 
  getBMICategory, 
  calculateBMR, 
  calculateTDEE, 
  calculateIdealWeightRange, 
  calculateWaterIntake 
} from '../utils/health';
import { cn } from '../utils/cn';
import WeightChart from '../components/ui/WeightChart';
import { HydrationGauge } from '../components/ui/Chart';

const Toolkit = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weightHistory, setWeightHistory] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [water, setWater] = useState(() => Number(localStorage.getItem('daily_water')) || 0);

  // Interactive Simulator State
  const [simData, setSimData] = useState({
    weight: 0,
    height: 0,
    age: 0,
    gender: 'male',
    activityLevel: 'Moderate'
  });

  useEffect(() => {
    fetchProfile();
    fetchWeightHistory();
    fetchLatestPlan();
    localStorage.setItem('daily_water', water);
  }, [water]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data) {
        setProfile(response.data);
        setSimData({
          weight: response.data.weight || 75,
          height: response.data.height || 175,
          age: response.data.age || 25,
          gender: response.data.gender || 'male',
          activityLevel: response.data.activity_level || 'Moderate'
        });
      }
    } catch (err) {
      console.error('Profile fetch error');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeightHistory = async () => {
    try {
      const response = await api.get('/profile/history');
      setWeightHistory(response.data);
    } catch (err) {
      console.error('History fetch error');
    }
  };

  const fetchLatestPlan = async () => {
    try {
      const response = await api.get('/diet/history');
      if (response.data.length > 0) {
        setActivePlan(response.data[0]);
      }
    } catch (err) {
      console.error('Plan fetch error');
    }
  };

  const bmi = calculateBMI(simData.weight, simData.height);
  const bmiCat = getBMICategory(bmi);
  const bmr = calculateBMR(simData.weight, simData.height, simData.age, simData.gender);
  const tdee = calculateTDEE(bmr, simData.activityLevel);
  const idealWeight = calculateIdealWeightRange(simData.height);
  const recommendedWater = calculateWaterIntake(simData.weight);

  const handleSimChange = (e) => {
    const { name, value } = e.target;
    setSimData(prev => ({ ...prev, [name]: name === 'activityLevel' || name === 'gender' ? value : Number(value) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans">
      {/* 1. Header Navigation */}
      <header className="h-16 border-b border-border-subtle bg-bg-secondary px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-text-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-px bg-border-subtle" />
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-primary" />
            <h1 className="text-xs font-black uppercase tracking-widest">Neural Toolkit</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] items-center font-bold text-text-muted uppercase tracking-widest">
           <Activity className="w-3.5 h-3.5" />
           <span>Pro Mode Active</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-12 space-y-24">
        
        {/* Section 1: Weight & Trends */}
        <section className="space-y-12">
            <div className="flex items-center gap-4">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted">Weight Analysis</h3>
               <div className="h-px flex-1 bg-border-subtle" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-8">
                  <Card className="p-8 h-[400px] flex flex-col">
                     <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Weight Gradient</p>
                          <h4 className="text-2xl font-black">Kilogram Trends</h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-black tabular">{weightHistory.length > 0 ? weightHistory[weightHistory.length-1].weight : '--'}</span>
                           <span className="text-xs font-bold text-text-muted uppercase tracking-widest">kg current</span>
                        </div>
                     </div>
                     <div className="flex-1">
                        <WeightChart data={weightHistory} />
                     </div>
                  </Card>
               </div>
               <div className="lg:col-span-4 space-y-6">
                  <Card className="p-8 space-y-6">
                     <div className="flex items-center gap-3 mb-2">
                        <Droplets className="w-5 h-5 text-accent" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Hydration Node</h4>
                     </div>
                     <div className="flex justify-center">
                        <HydrationGauge value={water} goal={recommendedWater} size={150} />
                     </div>
                     <div className="space-y-4 pt-6">
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-text-muted font-medium">Logged today</span>
                           <span className="font-black tabular">{water} / {recommendedWater}ml</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => setWater(w => w + 250)} className="py-2 bg-white/5 border border-border-subtle rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-all">+250ml</button>
                           <button onClick={() => setWater(0)} className="py-2 bg-white/5 border border-border-subtle rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-all text-danger/50 hover:text-danger">Reset</button>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>
        </section>

        {/* Section 2: Metabolic Simulator */}
        <section className="space-y-12">
            <div className="flex items-center gap-4">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted">Bio-Identity Simulator</h3>
               <div className="h-px flex-1 bg-border-subtle" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
               <div className="xl:col-span-4">
                  <Card className="p-8 space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Weight Simulation</label>
                      <input type="range" name="weight" min="40" max="150" value={simData.weight} onChange={handleSimChange} className="w-full accent-brand-primary h-1.5" />
                      <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase"><span>40kg</span><span className="text-white">{simData.weight}kg</span><span>150kg</span></div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Height Simulation</label>
                      <input type="range" name="height" min="120" max="220" value={simData.height} onChange={handleSimChange} className="w-full accent-accent h-1.5" />
                      <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase"><span>120cm</span><span className="text-white">{simData.height}cm</span><span>220cm</span></div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 pt-4 border-t border-border-subtle">
                        <Select label="Activity" name="activityLevel" value={simData.activityLevel} onChange={handleSimChange} options={[{value:'Sedentary', label:'Sedentary'}, {value:'Light', label:'Light'}, {value:'Moderate', label:'Moderate'}, {value:'Very', label:'Very Active'}]} />
                    </div>
                  </Card>
               </div>
               <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 flex flex-col justify-between">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">BMI Index</p>
                     <h5 className="text-4xl font-black mb-1">{bmi}</h5>
                     <div className="pt-4 border-t border-border-subtle mt-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: bmiCat.color }}>{bmiCat.label}</span>
                        <p className="text-xs text-text-muted mt-2">{bmiCat.description}</p>
                     </div>
                  </Card>
                  <Card className="p-8 flex flex-col justify-between">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">BMR Level</p>
                     <h5 className="text-4xl font-black mb-1">{bmr} <span className="text-xs text-text-muted">kcal</span></h5>
                     <div className="pt-4 border-t border-border-subtle mt-4 text-xs text-text-muted italic">
                        The energy your body consumes at complete rest.
                     </div>
                  </Card>
                  <Card className="p-8 flex flex-col justify-between">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Daily TDEE</p>
                     <h5 className="text-4xl font-black mb-1">{tdee} <span className="text-xs text-text-muted">kcal</span></h5>
                     <div className="pt-4 border-t border-border-subtle mt-4 text-xs text-text-muted">
                        Expenditure including <span className="font-bold text-white uppercase">{simData.activityLevel}</span> activity level.
                     </div>
                  </Card>
                  <Card className="p-8 flex flex-col justify-between">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Ideal Range</p>
                     <h5 className="text-3xl font-black mb-1">{idealWeight.min}-{idealWeight.max} <span className="text-xs text-text-muted">kg</span></h5>
                     <div className="pt-4 border-t border-border-subtle mt-4 text-xs text-text-muted">
                        Target weight range optimized for height standards.
                     </div>
                  </Card>
               </div>
            </div>
        </section>

        {/* Section 3: Activity module */}
        {activePlan?.ai_output?.workouts && (
          <section className="space-y-12 pb-24">
             <div className="flex items-center gap-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-text-muted">Neural Activity module</h3>
                <div className="h-px flex-1 bg-border-subtle" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activePlan.ai_output.workouts.map((w, idx) => (
                  <Card key={idx} className="p-6 space-y-4 hover:border-brand-primary/20 transition-all group">
                     <div className="flex justify-between items-start">
                        <ActivityIcon className="w-5 h-5 text-brand-primary/50 group-hover:text-brand-primary transition-colors" />
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded",
                          w.intensity === 'high' ? "bg-danger/10 text-danger" : 
                          w.intensity === 'medium' ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"
                        )}>{w.intensity}</span>
                     </div>
                     <h4 className="font-black text-sm uppercase tracking-tight">{w.name}</h4>
                     <p className="text-[10px] font-medium text-text-muted">{w.duration} • {w.benefit}</p>
                  </Card>
                ))}
             </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Toolkit;

const AnalyzerIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
