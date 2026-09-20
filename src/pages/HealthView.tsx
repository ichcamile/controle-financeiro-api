import React from 'react';
import { HeartPulse } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';

interface HealthViewProps {
  transactions: Transaction[];
  currentCycle: string;
}

export function HealthView({ transactions, currentCycle }: HealthViewProps) {
  const healthTxs = transactions.filter(t => t.cycle === currentCycle && t.cat === 'Saúde');
  const totalHealth = healthTxs.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><HeartPulse size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Saúde & Bem-Estar</h2>
          <p className="text-slate-400">Controle dedicado a medicamentos, exames, academia e tratamentos.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <h3 className="text-slate-400 font-semibold text-sm">Total Investido em Saúde neste Ciclo</h3>
          <div className="text-3xl font-bold text-white mt-1">{formatCurrency(totalHealth)}</div>
        </div>
        <div className="p-4 bg-red-500/10 rounded-2xl text-red-400"><HeartPulse size={36} /></div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-lg">Histórico de Lançamentos de Saúde</h3>
        {healthTxs.length > 0 ? (
          healthTxs.map(t => (
            <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-200">{t.desc}</div>
                <div className="text-xs text-slate-500">{t.subCat} • {t.date}</div>
              </div>
              <div className="font-bold text-red-400">{formatCurrency(t.amount)}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-600 py-8">Nenhum lançamento de saúde neste ciclo.</div>
        )}
      </div>
    </div>
  );
}
