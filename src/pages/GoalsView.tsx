import React from 'react';
import { Target } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface Goal {
  name: string;
  current: number;
  target: number;
  color: string;
}

const GOALS: Goal[] = [
  { name: 'Reserva da Casa',       current: 18000, target: 50000, color: '#3b82f6' },
  { name: 'Reserva Cirurgia',      current: 12000, target: 15000, color: '#10b981' },
  { name: 'Reserva de Emergência', current: 8000,  target: 20000, color: '#8b5cf6' },
];

export function GoalsView() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Target size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Metas & Reservas Financeiras</h2>
          <p className="text-slate-400">Acompanhamento do progresso para a sua mudança e objetivos de vida.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GOALS.map(g => {
          const pct = (g.current / g.target) * 100;
          return (
            <div key={g.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-1">{g.name}</h3>
                <div className="text-2xl font-black text-emerald-400 mt-2">{formatCurrency(g.current)}</div>
                <div className="text-xs text-slate-500">Meta: {formatCurrency(g.target)}</div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Progresso</span>
                  <span>{pct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
