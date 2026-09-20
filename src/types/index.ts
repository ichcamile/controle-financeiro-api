import { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  cat: string;
  subCat: string;
  method: 'credit' | 'debit' | 'pix' | 'transfer';
  cycle: string;
  cardId?: string | null;
  installments?: number;
  currentInst?: number;
  isFixed?: boolean;
  groupId?: string;
}

export interface Card {
  id: string;
  name: string;
  bank: string;
  limit: number;
  color: string;
  icon: LucideIcon;
  closingDay: number;
  dueDay: number;
}

export interface CategoryInfo {
  icon: LucideIcon;
  color: string;
  subs: string[];
}

export interface GithubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface CycleData {
  totalIncome: number;
  totalExpense: number;
  totalInvested: number;
  sobra: number;
  taxaPoupanca: number;
  cardTotals: Record<string, number>;
  categoryTotals: Record<string, number>;
  tCycle: Transaction[];
}
