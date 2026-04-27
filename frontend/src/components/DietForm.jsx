import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, User, Ruler, Target, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import { Card } from './ui/Card';
import { Input, Select } from './ui/Input';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const steps = [
  { id: 1, title: 'Identity', icon: User },
  { id: 2, title: 'Metrics', icon: Ruler },
  { id: 3, title: 'Ambition', icon: Target },
];

const DietForm = ({ onPlanGenerated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [unitSystem, setUnitSystem] = useState('metric');
  const abortRef = React.useRef(null);
  const statusTimerRef = React.useRef(null);
  const toast = useToast();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    goal: 'Maintenance',
    dietType: 'Non-Vegetarian',
    preferences: '',
  });

  React.useEffect(() => {
    fetchProfileData();
  }, []);

  React.useEffect(() => {
    if (!loading) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [loading]);

  React.useEffect(() => {
    return () => {
      if (statusTimerRef.current) clearInterval(statusTimerRef.current);
    };
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data) {
        setUnitSystem(response.data.unit_system || 'metric');
        setFormData(prev => ({
          ...prev,
          age: response.data.age || '',
          gender: response.data.gender || 'male',
          weight: response.data.weight || '',
          height: response.data.height || '',
          preferences: response.data.preferences || '',
          goal: response.data.goal || 'Maintenance'
        }));
        
        if (response.data.age && response.data.weight && response.data.height) {
          setCurrentStep(2);
        }
      }
    } catch (err) {
      console.error('Failed to pre-fill form');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const generatePlan = async () => {
    if (loading) return;
    setLoading(true);
    if (document?.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    
    const statusMessages = [
      'Building your protocol…',
      'Calibrating calories & macros…',
      'Assembling meals & workout split…',
      'Final validation…',
    ];
    
    let i = 0;
    setStatusText(`${statusMessages[0]} (up to ~2 min)`);
    
    if (statusTimerRef.current) clearInterval(statusTimerRef.current);
    statusTimerRef.current = setInterval(() => {
      i = (i + 1) % statusMessages.length;
      setStatusText(`${statusMessages[i]} (up to ~2 min)`);
    }, 2500);
    
    try {
      const payload = { ...formData };
      if (unitSystem === 'imperial') {
        payload.weight = (formData.weight / 2.20462).toFixed(2);
        payload.height = (formData.height * 2.54).toFixed(2);
      }

      const controller = new AbortController();
      abortRef.current = controller;
      const response = await api.post('/diet/generate', payload, { timeout: 120000, signal: controller.signal });
      onPlanGenerated(response.data);
      toast.success('Your personalized diet protocol is ready!', 'Plan Generated');
    } catch (err) {
      if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') {
        setStatusText('Generation canceled.');
        toast.info('Generation was canceled.', 'Plan Generation');
        return;
      }
      if (err?.code === 'ECONNABORTED') {
        toast.warning('Generation timed out. Please try again.', 'Timeout');
        return;
      }
      toast.error('AI Engine is at capacity. Please try again in a moment.', 'Generation Failed');
    } finally {
      abortRef.current = null;
      if (statusTimerRef.current) {
        clearInterval(statusTimerRef.current);
        statusTimerRef.current = null;
      }
      setLoading(false);
    }
  };

  const cancelGeneration = () => {
    abortRef.current?.abort?.();
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      {loading && typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-md rounded-3xl border border-border bg-card/90 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border-subtle bg-card/70">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-text-secondary">Generating</p>
                    <h3 className="text-lg font-black mt-1">Building your protocol</h3>
                  </div>
                  <div className="p-2 rounded-full bg-primary/10">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="px-3 py-2 rounded-xl border border-border-subtle bg-white/5">
                  <div className="text-[11px] font-black uppercase tracking-widest text-text-secondary">
                    {statusText}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-[10px] rounded-full bg-white/5 overflow-hidden border border-border-subtle">
                    <div className="h-full w-[55%] bg-primary/40 animate-pulse" />
                  </div>
                  <div className="h-[10px] rounded-full bg-white/5 overflow-hidden border border-border-subtle">
                    <div className="h-full w-[72%] bg-accent/30 animate-pulse [animation-delay:120ms]" />
                  </div>
                  <div className="h-[10px] rounded-full bg-white/5 overflow-hidden border border-border-subtle">
                    <div className="h-full w-[45%] bg-white/10 animate-pulse [animation-delay:240ms]" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={cancelGeneration}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      }
      {/* Progress Stepper */}
      <div className="flex justify-between items-center mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
        {steps.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
              idx <= currentStep 
                ? 'bg-primary border-primary text-white shadow-lg' 
                : 'bg-card border-border text-text-secondary'
            }`}>
              <step.icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] uppercase font-black tracking-widest mt-3 transition-colors ${
              idx <= currentStep ? 'text-primary' : 'text-text-secondary'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="bg-card p-8 rounded-3xl shadow-xl border border-border">

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-8"
          >
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-black">Identity Core</h2>
                  <p className="text-text-secondary text-sm">Bio-logical baseline parameters.</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                  <Select
                    label="Gender Selection"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                    ]}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-black">Physical Metrics</h2>
                  <p className="text-text-secondary text-sm">Current metabolic mass variables.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Input
                    label={unitSystem === 'metric' ? "Mass (kg)" : "Mass (lb)"}
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label={unitSystem === 'metric' ? "Height (cm)" : "Height (in)"}
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-black">Goal Alignment</h2>
                  <p className="text-text-secondary text-sm">Define desired metabolic state.</p>
                </div>
                <div className="space-y-6">
                  <Select
                    label="Strategic Goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    options={[
                      { value: 'Weight Loss', label: 'Weight Loss' },
                      { value: 'Maintenance', label: 'Maintenance' },
                      { value: 'Muscle Gain', label: 'Muscle Gain' },
                    ]}
                  />
                  <Select
                    label="Primary Diet"
                    name="dietType"
                    value={formData.dietType}
                    onChange={handleChange}
                    options={[
                      { value: 'Vegetarian', label: 'Vegetarian' },
                      { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
                      { value: 'Vegan', label: 'Vegan' },
                    ]}
                  />
                  <Input
                    label="Preferences / Allergies"
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    placeholder="e.g. Nut Allergy, Low Sodium..."
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border-subtle">
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0 || loading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <div className="flex gap-4 items-center">
            {/* New wrapper div for action buttons to prevent them from shrinking */}
            <div className="flex-shrink-0 flex gap-4 items-center">
              {currentStep === steps.length - 1 ? (
                <>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={generatePlan}
                    loading={loading}
                    className="px-8"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Build Protocol
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  className="px-8"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DietForm;
