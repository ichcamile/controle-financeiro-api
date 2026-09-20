import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { getCycleLabel } from '../utils/cycles';
import { formatCurrency } from '../utils/currency';

interface ProjectionsViewProps {
  transactions: Transaction[];
  cycles: string[];
  currentCycle: string;
}

export function ProjectionsView({ transactions, cycles, currentCycle }: ProjectionsViewProps) {
  const startIdx = cycles.indexOf(currentCycle) !== -1 ? cycles.indexOf(currentCycle) : 0;
  const targetCycles = cycles.slice(startIdx, startIdx + 12);

  const projectionData = targetCycles.map(c => {
    const txs = transactions.filter(t => t.cycle === c);
    let income = 0, expenses = 0, credit = 0;
    txs.forEach(t => {
      if (t.type === 'income') income += t.amount;
      if (t.type === 'expense' && t.method !== 'credit') expenses += t.amount;
      if (t.type === 'expense' && t.method === 'credit') credit += t.amount;
    });
    return {
      name: getCycleLabel(c),
      Receitas: income,
      Faturas: credit,
      Fixos: expenses,
      Sobra: income - (credit + expenses),
    };
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Calendar size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Projeção Financeira de 12 Meses</h2>
          <p className="text-slate-400">Comprometimento futuro de faturas e saldo projetado.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[450px] shadow-xl">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFaturas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSobra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(val) => `R$${val / 1000}k`} />
            <RechartsTooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
            />
            <Legend />
            <Area type="monotone" dataKey="Faturas" stroke="#ef4444" fillOpacity={1} fill="url(#colorFaturas)" />
            <Area type="monotone" dataKey="Sobra"   stroke="#3b82f6" fillOpacity={1} fill="url(#colorSobra)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
