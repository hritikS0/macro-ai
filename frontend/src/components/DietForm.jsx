import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, User, Ruler, Target } from 'lucide-react';
import Button from './ui/Button';
import { Card } from './ui/Card';
import { Input, Select } from './ui/Input';
import api from '../services/api';

const steps = [
  { id: 1, title: 'Identity', icon: User },
  { id: 2, title: 'Metrics', icon: Ruler },
  { id: 3, title: 'Ambition', icon: Target },
];

const DietForm = ({ onPlanGenerated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [unitSystem, setUnitSystem] = useState('metric');
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
    setLoading(true);
    try {
      const payload = { ...formData };
      if (unitSystem === 'imperial') {
        payload.weight = (formData.weight / 2.20462).toFixed(2);
        payload.height = (formData.height * 2.54).toFixed(2);
      }

      const response = await api.post('/diet/generate', payload);
      onPlanGenerated(response.data);
    } catch (err) {
      alert('Generation Error: AI Engine is at capacity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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

          <div className="flex gap-4">
            {currentStep === steps.length - 1 ? (
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
      </form>
    </div>
  );
};

export default DietForm;
