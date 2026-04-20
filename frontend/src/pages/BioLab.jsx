import React from 'react';
import NavSidebar from '../components/NavSidebar';
import HealthSandbox from '../components/HealthSandbox';

const BioLab = () => {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <NavSidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
        <div className="max-w-3xl mx-auto space-y-10 pb-32">
          
          {/* Header */}
          <div className="pb-6 border-b border-border-subtle text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Health Tools</h1>
            <p className="text-text-muted font-medium text-sm">Track and calculate your key fitness metrics</p>
          </div>

          {/* Sandbox Mount */}
          <HealthSandbox />

        </div>
      </main>
    </div>
  );
};

export default BioLab;

