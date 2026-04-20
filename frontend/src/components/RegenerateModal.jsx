import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send } from 'lucide-react';
import Button from './ui/Button';

const RegenerateModal = ({ isOpen, onClose, title, onConfirm }) => {
  const [instruction, setInstruction] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    onConfirm(instruction);
    setInstruction('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="card shadow-2xl w-full max-w-lg overflow-hidden p-0"
        >
          <div className="p-6 border-b flex justify-between items-center bg-bg-elevated border-border-light">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-widest text-sm text-text-primary">Refine {title}</h3>
                <p className="text-[10px] font-bold text-text-secondary uppercase">Gemma Intelligent Refinement</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-full transition-colors text-text-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">AI Instruction</label>
              <textarea
                autoFocus
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. 'Make Day 1 more home-workout focused'"
                className="input h-32 p-4 resize-none"
              />
              <p className="text-[10px] text-text-muted italic">
                * Other sections of your protocol will remain protected and unchanged.
              </p>
            </div>


            <div className="flex gap-4 pt-4">
              <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-[2]" disabled={!instruction.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Refine Section
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


export default RegenerateModal;
