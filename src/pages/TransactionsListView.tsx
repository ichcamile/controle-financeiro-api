import React, { useState } from 'react';
import { Search, ArrowRightLeft } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';

interface TransactionsListViewProps {
  transactions: Transaction[];
}

export function TransactionsListView({ transactions }: TransactionsListViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t =>
    t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowRightLeft size={22} className="text-blue-500" /> Extrato Completo de Transações
          </h2>
          <p className="text-slate-400 text-sm">Histórico consolidado com motor de busca global.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-950/50">
              <th className="p-4">Data / Ciclo</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Método</th>
              <th className="p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-slate-400">
                  <div>{t.date}</div>
                  <div className="text-[10px] text-blue-400 font-mono">Ciclo: {t.cycle}</div>
                </td>
                <td className="p-4 font-bold text-white">
                  {t.desc}
                  {t.installments && t.installments > 1 && (
                    <span className="ml-2 text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      Parcela {t.currentInst}/{t.installments}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium">{t.cat}</span>
                </td>
                <td className="p-4 text-slate-400 uppercase text-xs">{t.method}</td>
                <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
