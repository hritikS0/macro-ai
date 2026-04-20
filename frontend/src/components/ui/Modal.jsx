import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';
import { Card } from './Card';
import { cn } from '../../utils/cn';

const Modal = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn('relative w-full max-w-lg z-10', className)}
          >
            <Card glass className="p-0 border-white/10 shadow-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight text-white">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 pb-8">
                {children}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'danger', isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
          variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-brand-primary/10 text-brand-primary'
        )}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-text-secondary leading-relaxed mb-10">
          {message}
        </p>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant={variant} 
            onClick={onConfirm} 
            isLoading={isLoading}
            className={cn(variant === 'danger' && 'bg-danger text-white hover:bg-danger/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]')}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { Modal, ConfirmModal };
