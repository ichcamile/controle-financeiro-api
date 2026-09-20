import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getCycleLabel } from '../../utils/cycles';

interface HeaderProps {
  currentCycle: string;
  availableCycles: string[];
  onCycleChange: (cycle: string) => void;
  onNewTransaction: () => void;
}

export function Header({ currentCycle, availableCycles, onCycleChange, onNewTransaction }: HeaderProps) {
  const currentIdx = availableCycles.indexOf(currentCycle);

  const handlePrev = () => {
    if (currentIdx > 0) onCycleChange(availableCycles[currentIdx - 1]);
  };

  const handleNext = () => {
    if (currentIdx < availableCycles.length - 1) onCycleChange(availableCycles[currentIdx + 1]);
  };

  return (
    <header className="h-20 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
      {/* Seletor de ciclo */}
      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="px-4 font-bold text-blue-400 min-w-[130px] text-center">
          Ciclo {getCycleLabel(currentCycle)}
        </div>
        <button
          onClick={handleNext}
          disabled={currentIdx === availableCycles.length - 1}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Botão novo lançamento */}
      <button
        onClick={onNewTransaction}
        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all transform active:scale-95"
      >
        <Plus size={20} /> Novo Lançamento
      </button>
    </header>
  );
}
