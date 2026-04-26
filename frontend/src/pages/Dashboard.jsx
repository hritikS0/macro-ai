import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import DietForm from "../components/DietForm";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  Flame,
  Utensils,
  Download,
  RefreshCw,
  Dumbbell,
  ChevronRight,
  Sparkles,
  Zap,
  LogOut,
  Sun,
  Moon,
  Scale,
  Calculator,
  ChevronLeft,
  Info,
  PanelRightClose,
  PanelRightOpen,
  TrendingUp,
  Activity,
  UserCircle,
  X
} from "lucide-react";


import { motion, AnimatePresence } from "framer-motion";
import AICoach from "../components/AICoach";
import RegenerateModal from "../components/RegenerateModal";
import { exportToPDF } from "../services/pdf.service";
import { useTheme } from "../context/ThemeContext";
import NavSidebar from "../components/NavSidebar";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activePlan, setActivePlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refiningSection, setRefiningSection] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Biometrics calculation for active plan
  const calculateBMI = () => {
    if (!activePlan) return null;
    const { weight, height } = activePlan;
    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
    let category = "Healthy";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";
    return { value: bmi, category };
  };

  const biometrics = calculateBMI();



  useEffect(() => {
    fetchActivePlan();
  }, []);

  const fetchActivePlan = async () => {
    try {
      const response = await api.get("/diet/active");
      setActivePlan(response.data);
    } catch (err) {
      console.error("Fetch Plan Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefineSection = async (instruction) => {
    if (!refiningSection) return;
    try {
      setLoading(true);
      const payload =
        refiningSection.type === "meal"
          ? { mealName: refiningSection.name, instruction }
          : { dayName: refiningSection.name, instruction };

      const response = await api.post("/diet/regenerate-meal", payload);
      setActivePlan(response.data);
      setRefiningSection(null);
    } catch (err) {
      alert(`Failed to refine ${refiningSection.type}. AI coach is busy.`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!activePlan) return;
    setIsExporting(true);
    try {
      await exportToPDF(activePlan);
    } catch (err) {
      alert("PDF export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading && !activePlan) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-brand-primary animate-spin" />
          <p className="text-sm font-bold uppercase tracking-widest text-text-muted">
            Loading Protocol...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* 0. Global Navigation Sidebar */}
      <NavSidebar />

      {/* 1. Content Area */}

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          id="diet-plan-content"
          className="max-w-6xl mx-auto p-4 md:p-10 space-y-10 pb-40"
        >
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-subtle">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary rounded-lg shadow-lg">
                  <Flame className="text-white w-6 h-6" />
                </div>
                <h1 className="text-3xl font-black text-text-primary tracking-tight">
                  Daily Commander
                </h1>
              </div>
              <p className="text-text-secondary font-medium max-w-md">
                Precision nutrition optimized for{" "}
                <span className="text-brand-primary font-bold uppercase">
                  {activePlan?.goal || "General Health"}
                </span>
                .
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={toggleTheme}
                className="w-10 h-10 p-0 flex items-center justify-center rounded-full shadow-sm"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-text-secondary" />
                ) : (
                  <Sun className="w-4 h-4 text-warning" />
                )}
              </Button>
               <Button
                variant="secondary"
                onClick={handleExportPDF}
                disabled={isExporting || !activePlan}
                className="shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>

              <Button
                variant="primary"
                onClick={() => setShowForm(true)}
                className="shadow-md"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Full Plan
              </Button>
            </div>
          </header>


          <AnimatePresence mode="wait">
            {showForm || !activePlan ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="max-w-2xl mx-auto border-dashed border-2 p-8 relative">
                  {activePlan && (
                    <button
                      onClick={() => setShowForm(false)}
                      className="absolute top-4 right-4 p-2 hover:bg-bg-muted rounded-full transition-colors text-text-muted hover:text-text-primary z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <div className="pt-4">
                    <DietForm
                      onPlanGenerated={(p) => {
                        setActivePlan(p);
                        setShowForm(false);
                      }}
                    />
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {/* Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                  <Card className="p-6 gradient-bg border-primary/10">
                    <div className="space-y-2">
                      <p className="text-xs font-black text-primary uppercase tracking-widest leading-none">
                        Daily Flux
                      </p>
                      <p className="text-3xl font-black tabular">
                        {Math.round(activePlan.ai_output.calories)}{" "}
                        <span className="text-sm font-medium">kcal</span>
                      </p>
                    </div>
                  </Card>

                  {["protein", "carbs", "fat"].map((macro) => (
                    <Card key={macro} className="p-6">
                      <div className="space-y-2">
                        <p className="text-xs font-black text-text-secondary uppercase tracking-widest leading-none">
                          {macro}
                        </p>
                        <p className="text-2xl font-black tabular">
                          {activePlan.ai_output.macros[macro]}g
                          <span className="text-[10px] ml-2 text-text-secondary">
                            Target
                          </span>
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Diet Section */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black tracking-tight">
                      Metabolic Units
                    </h2>
                    <div className="h-[2px] flex-1 bg-border-subtle" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activePlan.ai_output.meals.map((meal, idx) => (
                      <Card key={idx} className="group overflow-hidden">
                        <div className="flex justify-between items-center p-5 bg-bg-secondary border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-6 bg-brand-primary rounded-full" />
                            <h3 className="font-black uppercase tracking-widest text-sm">
                              {meal.name}
                            </h3>
                          </div>
                          <span className="text-xs font-bold bg-bg-elevated px-3 py-1 rounded-full border border-border-light shadow-sm tabular text-text-primary">
                            {meal.calories} kcal
                          </span>
                        </div>

                        <div className="p-5 space-y-4">
                          {meal.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="flex justify-between items-center border-b border-dashed pb-2 last:border-none last:pb-0"
                            >
                              <div>
                                <p className="font-bold text-sm text-text-primary">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                  {item.quantity}
                                </p>
                              </div>
                              <div className="text-[10px] font-black text-brand-primary tabular">
                                {item.calories} KCAL
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Workout Split */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black tracking-tight">
                      Tactical Split
                    </h2>
                    <div className="h-[2px] flex-1 bg-border-subtle" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activePlan.ai_output.workout_plan?.map((day, dIdx) => (
                      <Card key={dIdx} className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase text-brand-primary tracking-widest">
                            {day.day}
                          </p>
                          <Dumbbell className="w-4 h-4 text-text-muted" />
                        </div>
                        <h4 className="font-black text-sm uppercase">
                          {day.focus}
                        </h4>
                        <div className="space-y-2">
                          {day.exercises.map((ex, eIdx) => (
                            <div
                              key={eIdx}
                              className="flex items-start gap-2 text-xs"
                            >
                              <ChevronRight className="w-3 h-3 mt-0.5 text-text-muted" />
                              <div>
                                <span className="font-bold">{ex.name}</span>
                                <span className="text-brand-primary ml-1 font-black">
                                  {ex.sets}x{ex.reps}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 2. Side Panel */}
      <div className="relative flex">
        {/* Toggle Pulse (Visible when collapsed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full p-2 bg-bg-surface border border-r-0 border-border-light rounded-l-xl shadow-xl z-30 hover:text-brand-primary transition-colors"
            title="Expand AI Coach"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 384, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-bg-surface border-l border-border-light flex flex-col z-20 relative overflow-hidden"
            >
              <div className="w-96 h-full flex flex-col shrink-0">
              {/* Internal Sidebar Toggle */}
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-bg-surface border border-border-light rounded-full flex items-center justify-center shadow-md z-30 hover:text-brand-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-brand-primary w-5 h-5" />
                  <span className="font-black uppercase tracking-tighter text-lg">
                    BioCoach
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 hover:bg-bg-secondary rounded-lg transition-colors text-text-muted hover:text-danger"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              <AICoach activePlanId={activePlan?.id} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>



      {/* Modals */}
      <RegenerateModal
        isOpen={!!refiningSection}
        onClose={() => setRefiningSection(null)}
        title={refiningSection?.name}
        onConfirm={handleRefineSection}
      />
    </div>
  );
};

export default Dashboard;
