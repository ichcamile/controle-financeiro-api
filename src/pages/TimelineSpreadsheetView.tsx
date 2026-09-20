import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Transaction } from '../types';
import { getCycleLabel } from '../utils/cycles';
import { formatCurrency } from '../utils/currency';

interface TimelineSpreadsheetViewProps {
  transactions: Transaction[];
  cycles: string[];
}

export function TimelineSpreadsheetView({ transactions, cycles }: TimelineSpreadsheetViewProps) {
  const [startFilter, setStartFilter] = useState('2026-09');

  const filteredCycles = cycles.filter(c => c >= startFilter);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays size={22} className="text-blue-500" /> Visão Mensal Detalhada (Estilo Planilha)
          </h2>
          <p className="text-slate-400 text-sm">Acompanhe a evolução lado a lado com base na sua regra de fechamento (Dia 27).</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Visualizar a partir de:</span>
          <select
            value={startFilter}
            onChange={e => setStartFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-blue-500"
          >
            {cycles.map(c => <option key={c} value={c}>Ciclo {getCycleLabel(c)}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-6">
        <div className="flex gap-6 min-w-max">
          {filteredCycles.map(cycleStr => {
            const tCycle = transactions.filter(t => t.cycle === cycleStr);
            const income   = tCycle.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
            const expense  = tCycle.filter(t => t.type === 'expense' && t.cat !== 'Investimentos').reduce((acc, t) => acc + t.amount, 0);
            const invested = tCycle.filter(t => t.type === 'expense' && t.cat === 'Investimentos').reduce((acc, t) => acc + t.amount, 0);
            const sobra = income - expense - invested;

            return (
              <div key={cycleStr} className="w-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-xl">
                <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-blue-400">{getCycleLabel(cycleStr)}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">{cycleStr}</span>
                </div>

                {/* Resumo do ciclo */}
                <div className="space-y-3 mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Salário / Receita:</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total de Gastos:</span>
                    <span className="text-red-400 font-bold">{formatCurrency(expense)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Investimentos:</span>
                    <span className="text-purple-400 font-bold">{formatCurrency(invested)}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-bold">
                    <span className="text-slate-300">Sobra do Mês:</span>
                    <span className={sobra >= 0 ? 'text-blue-400' : 'text-red-400'}>{formatCurrency(sobra)}</span>
                  </div>
                </div>

                {/* Lançamentos */}
                <div className="flex-1 space-y-2 overflow-y-auto max-h-80 custom-scrollbar pr-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lançamentos do Ciclo</div>
                  {tCycle.length > 0 ? (
                    tCycle.map(t => (
                      <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{t.desc}</div>
                          <div className="text-[10px] text-slate-500">{t.cat} {t.method === 'credit' ? '• Cartão' : ''}</div>
                        </div>
                        <div className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-600 text-xs py-8">Nenhum lançamento registrado.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
