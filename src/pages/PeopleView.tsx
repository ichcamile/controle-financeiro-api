import React from 'react';
import { Users } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface Person {
  name: string;
  toReceive: number;
  toPay: number;
}

const PEOPLE: Person[] = [
  { name: 'Vitor',   toReceive: 1600, toPay: 400 },
  { name: 'Mãe',     toReceive: 3160, toPay: 0   },
  { name: 'Pai',     toReceive: 1200, toPay: 0   },
  { name: 'Isabela', toReceive: 415,  toPay: 204 },
];

export function PeopleView() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Users size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Controle de Pessoas</h2>
          <p className="text-slate-400">Valores a receber e a pagar separados das suas despesas e receitas correntes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PEOPLE.map(p => {
          const balance = p.toReceive - p.toPay;
          return (
            <div key={p.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-3">{p.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>A Receber:</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(p.toReceive)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>A Pagar:</span>
                    <span className="text-red-400 font-bold">{formatCurrency(p.toPay)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Saldo Líquido</span>
                <span className={`font-bold text-lg ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
