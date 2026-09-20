import { useMemo } from 'react';
import { Transaction, CycleData } from '../types';

export function useCycleData(transactions: Transaction[], currentCycle: string): CycleData {
  return useMemo(() => {
    const tCycle = transactions.filter(t => t.cycle === currentCycle);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvested = 0;
    const cardTotals: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};

    tCycle.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      }
      if (t.type === 'expense') {
        if (t.cat === 'Investimentos') {
          totalInvested += t.amount;
        } else {
          totalExpense += t.amount;
        }

        if (t.method === 'credit' && t.cardId) {
          cardTotals[t.cardId] = (cardTotals[t.cardId] || 0) + t.amount;
        }
        if (t.cat && t.cat !== 'Investimentos') {
          categoryTotals[t.cat] = (categoryTotals[t.cat] || 0) + t.amount;
        }
      }
    });

    const sobra = totalIncome - totalExpense - totalInvested;
    const taxaPoupanca = totalIncome > 0 ? (totalInvested / totalIncome) * 100 : 0;

    return { totalIncome, totalExpense, totalInvested, sobra, taxaPoupanca, cardTotals, categoryTotals, tCycle };
  }, [transactions, currentCycle]);
}
