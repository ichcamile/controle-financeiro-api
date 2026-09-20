import React from 'react';
import { CreditCard } from 'lucide-react';
import { Transaction, Card } from '../types';
import { getCycleLabel } from '../utils/cycles';
import { formatCurrency } from '../utils/currency';

interface CardsViewProps {
  transactions: Transaction[];
  cards: Card[];
  currentCycle: string;
}

export function CardsView({ transactions, cards, currentCycle }: CardsViewProps) {
  const cardAnalysis = cards.map(card => {
    const futureTxs     = transactions.filter(t => t.method === 'credit' && t.cardId === card.id && t.cycle >= currentCycle);
    const totalDue      = futureTxs.reduce((acc, t) => acc + t.amount, 0);
    const limitAvailable  = card.limit - totalDue;
    const currentInvoice = futureTxs.filter(t => t.cycle === currentCycle).reduce((acc, t) => acc + t.amount, 0);
    return { ...card, totalDue, limitAvailable, currentInvoice };
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><CreditCard size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciamento de Cartões de Crédito</h2>
          <p className="text-slate-400">Controle de limites consolidados, faturas futuras e poder de compra.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardAnalysis.map(card => {
          const percentUsed = (card.totalDue / card.limit) * 100;
          const Icon = card.icon;
          return (
            <div key={card.id} className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl hover:border-slate-700 transition-all duration-300">
              <div className="absolute -top-4 -right-4 opacity-10 rotate-12">
                <Icon size={100} style={{ color: card.color }} />
              </div>
              <div className="h-1.5 w-full" style={{ backgroundColor: card.color, boxShadow: `0 0 10px ${card.color}` }} />
              <div className="p-5 flex-1 flex flex-col relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-slate-950/50" style={{ color: card.color }}><Icon size={16} /></div>
                  <h3 className="font-bold text-lg text-white">{card.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">Fechamento: Dia {card.closingDay} • Vencimento: Dia {card.dueDay}</p>

                <div className="mt-auto space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Comprometido Total</span>
                      <span className="text-white font-medium">{formatCurrency(card.totalDue)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${Math.min(percentUsed, 100)}%`, backgroundColor: card.color }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-400">Limite Disponível</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(Math.max(0, card.limitAvailable))}</span>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-3 flex justify-between items-center border border-slate-800/50 mt-2">
                    <span className="text-xs font-semibold text-slate-400">Fatura {getCycleLabel(currentCycle)}</span>
                    <span className="text-white font-bold">{formatCurrency(card.currentInvoice)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
