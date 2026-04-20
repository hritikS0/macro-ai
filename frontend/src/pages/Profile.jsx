import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  ChevronLeft, 
  Save, 
  Activity, 
  Target, 
  Scale, 
  Ruler, 
  Calendar,
  Zap,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    target_weight: '',
    activity_level: 'moderate',
    unit_system: 'metric',
    preferences: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.post('/profile', profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleUnit = () => {
    const isMetric = profile.unit_system === 'metric';
    const newUnit = isMetric ? 'imperial' : 'metric';
    
    // Simple conversions for the UI (storing in DB will still be handled)
    let newWeight = profile.weight;
    let newHeight = profile.height;
    let newTarget = profile.target_weight;

    if (newUnit === 'imperial') {
      newWeight = (profile.weight * 2.20462).toFixed(1);
      newHeight = (profile.height / 2.54).toFixed(1);
      newTarget = (profile.target_weight * 2.20462).toFixed(1);
    } else {
      newWeight = (profile.weight / 2.20462).toFixed(1);
      newHeight = (profile.height * 2.54).toFixed(1);
      newTarget = (profile.target_weight / 2.20462).toFixed(1);
    }

    setProfile(prev => ({ 
      ...prev, 
      unit_system: newUnit,
      weight: newWeight,
      height: newHeight,
      target_weight: newTarget
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent animate-spin rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-6 md:p-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="p-3 bg-bg-secondary/50 rounded-2xl hover:bg-bg-secondary transition-all text-text-muted hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-brand-primary animate-pulse" />
                <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Neural Identity</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">System Settings.</h1>
            </div>
          </div>
          
          <Button 
            onClick={handleSave} 
            loading={saving} 
            icon={success ? CheckCircle2 : Save}
            className={cn(
              "px-8 py-4 rounded-2xl transition-all",
              success ? "bg-success hover:bg-success" : ""
            )}
          >
            {success ? 'Identity Secured' : 'Save Identity'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Biometrics */}
          <div className="lg:col-span-2 space-y-8">
            <Card glass className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <User className="w-5 h-5 text-brand-primary" />
                  Biometric Parameters
                </h3>
                
                {/* Unit Toggle */}
                <div className="flex bg-bg-primary/50 p-1 rounded-xl border border-white/5">
                  <button 
                    onClick={() => profile.unit_system !== 'metric' && toggleUnit()}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      profile.unit_system === 'metric' ? "bg-brand-primary text-white" : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    Metric
                  </button>
                  <button 
                    onClick={() => profile.unit_system !== 'imperial' && toggleUnit()}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      profile.unit_system === 'imperial' ? "bg-brand-primary text-white" : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="Chronological Age" 
                  icon={Calendar} 
                  value={profile.age}
                  onChange={v => setProfile(p => ({ ...p, age: v }))}
                  placeholder="25"
                />
                <div className="space-y-3">
                   <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest px-1">Biological Gender</p>
                   <div className="flex gap-4">
                      {['male', 'female'].map(g => (
                        <button
                          key={g}
                          onClick={() => setProfile(p => ({ ...p, gender: g }))}
                          className={cn(
                            "flex-1 py-3 rounded-xl border transition-all text-sm font-bold capitalize",
                            profile.gender === g 
                              ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                              : "bg-bg-primary/30 border-white/5 text-text-muted hover:border-white/20"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                   </div>
                </div>

                <InputField 
                  label={profile.unit_system === 'metric' ? "Mass (kg)" : "Mass (lb)"} 
                  icon={Scale} 
                  value={profile.weight}
                  onChange={v => setProfile(p => ({ ...p, weight: v }))}
                  placeholder={profile.unit_system === 'metric' ? "80" : "175"}
                />
                <InputField 
                  label={profile.unit_system === 'metric' ? "Vertical (cm)" : "Vertical (in)"} 
                  icon={Ruler} 
                  value={profile.height}
                  onChange={v => setProfile(p => ({ ...p, height: v }))}
                  placeholder={profile.unit_system === 'metric' ? "180" : "71"}
                />
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest px-1 flex items-center gap-2">
                   <Activity className="w-3 h-3" />
                   Neural Activity Frequency
                 </p>
                 <select 
                    value={profile.activity_level}
                    onChange={e => setProfile(p => ({ ...p, activity_level: e.target.value }))}
                    className="w-full bg-bg-primary/50 border border-white/10 rounded-xl py-4 px-5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer"
                 >
                    <option value="sedentary">Sedentary (Little to no exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                    <option value="extra">Extra Active (Professional athlete)</option>
                 </select>
              </div>
            </Card>

            <Card glass className="p-8 space-y-6">
               <h3 className="text-lg font-bold flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-primary" />
                  Dietary Preferences & Neural Constraints
               </h3>
               <textarea 
                  value={profile.preferences}
                  onChange={e => setProfile(p => ({ ...p, preferences: e.target.value }))}
                  placeholder="Enter vegan, keto, allergies, or specific performance goals..."
                  className="w-full h-32 bg-bg-primary/50 border border-white/10 rounded-xl py-4 px-5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all resize-none custom-scrollbar"
               />
            </Card>
          </div>

          {/* Right Column: Objectives */}
          <div className="space-y-8">
             <Card glass className="p-8 border-brand-primary/20 bg-brand-primary/5">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-8">
                  <Target className="w-5 h-5 text-brand-primary" />
                  Primary Directive
                </h3>
                
                <div className="space-y-8">
                   <InputField 
                    label={profile.unit_system === 'metric' ? "Target Mass (kg)" : "Target Mass (lb)"} 
                    icon={Scale} 
                    value={profile.target_weight}
                    onChange={v => setProfile(p => ({ ...p, target_weight: v }))}
                    placeholder={profile.unit_system === 'metric' ? "75" : "165"}
                  />

                  <div className="p-6 rounded-2xl bg-bg-primary/50 border border-white/5 space-y-4">
                     <p className="text-[10px] uppercase font-black tracking-widest text-text-muted">Current Objective</p>
                     <p className="text-sm font-bold text-text-primary leading-relaxed">
                        Establishing a {profile.unit_system} neural baseline for optimized fat metabolism and muscle preservation.
                     </p>
                  </div>
                </div>
             </Card>

             <Card glass className="p-8 flex items-center justify-center text-center">
                <div className="space-y-4 opacity-50">
                   <CheckCircle2 className="w-10 h-10 text-brand-primary mx-auto" />
                   <p className="text-xs uppercase font-black tracking-widest leading-relaxed">
                      All data is encrypted <br /> and secured via RLS.
                   </p>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, value, onChange, placeholder }) => (
  <div className="space-y-3">
    <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest px-1">{label}</p>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
        <Icon className="w-4 h-4" />
      </div>
      <input 
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-primary/30 border border-white/10 rounded-xl py-4 pl-12 pr-5 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
      />
    </div>
  </div>
);

export default Profile;
