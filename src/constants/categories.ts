import { HeartPulse, PieChart, TrendingUp, Landmark, DollarSign } from 'lucide-react';
import { CategoryInfo, Transaction } from '../types';

export const CICLO_START_DAY = 27; // O mês financeiro vira no dia 27

export const CATEGORIES_DB: Record<string, CategoryInfo> = {
  'Saúde':        { icon: HeartPulse,  color: '#ef4444', subs: ['Academia', 'Medicamentos', 'Consultas', 'Exames', 'Tratamentos', 'Plano de Saúde', 'Estética', 'Outros'] },
  'Alimentação':  { icon: PieChart,    color: '#f97316', subs: ['Mercado', 'Restaurante', 'Delivery', 'Café', 'Fast food', 'Outros'] },
  'Transporte':   { icon: PieChart,    color: '#eab308', subs: ['Uber', 'Combustível', 'Transporte público', 'Viagem', 'Outros'] },
  'Compras':      { icon: PieChart,    color: '#a855f7', subs: ['Roupas', 'Beleza', 'Eletrônicos', 'Casa', 'Presentes', 'Outros'] },
  'Fixos':        { icon: Landmark,    color: '#64748b', subs: ['Aluguel', 'Internet', 'Celular', 'Assinaturas', 'Outros'] },
  'Investimentos':{ icon: TrendingUp,  color: '#10b981', subs: ['Reserva Casa', 'Reserva Cirurgia', 'Reserva de Emergência', 'Ações', 'CDB', 'Outros'] },
  'Lazer':        { icon: PieChart,    color: '#ec4899', subs: ['Cinema', 'Shows', 'Bares', 'Viagens', 'Outros'] },
  'Renda':        { icon: DollarSign,  color: '#10b981', subs: ['Salário', 'PLR', 'Dividendos', 'Reembolso', 'Outros'] },
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't-sal-1',   date: '2026-09-27', desc: 'Salário',       amount: 5000.00, type: 'income',  cat: 'Renda',    subCat: 'Salário', method: 'transfer', cycle: '2026-10' },
  { id: 't-sal-2',   date: '2026-08-27', desc: 'Salário',       amount: 5000.00, type: 'income',  cat: 'Renda',    subCat: 'Salário', method: 'transfer', cycle: '2026-09' },
  { id: 't-nu-1',    date: '2026-08-15', desc: 'Fatura Cartão 1', amount: 1500.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'nubank',   cycle: '2026-09', installments: 1, currentInst: 1 },
  { id: 't-nu-2',    date: '2026-09-15', desc: 'Fatura Cartão 1', amount: 800.00,  type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'nubank',   cycle: '2026-10', installments: 1, currentInst: 1 },
  { id: 't-latam-1', date: '2026-08-10', desc: 'Fatura Cartão 2', amount: 600.00,  type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'latam',    cycle: '2026-09', installments: 1, currentInst: 1 },
  { id: 't-latam-2', date: '2026-09-10', desc: 'Fatura Cartão 2', amount: 700.00,  type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'latam',    cycle: '2026-10', installments: 1, currentInst: 1 },
  { id: 't-plat-1',  date: '2026-08-12', desc: 'Fatura Cartão 3', amount: 1200.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'platinum', cycle: '2026-09', installments: 1, currentInst: 1 },
  { id: 't-plat-2',  date: '2026-09-12', desc: 'Fatura Cartão 3', amount: 350.00,  type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'platinum', cycle: '2026-10', installments: 1, currentInst: 1 },
  { id: 't-saude-1', date: '2026-09-05', desc: 'Academia', amount: 100.00, type: 'expense', cat: 'Saúde', subCat: 'Academia', method: 'credit', cardId: 'platinum', cycle: '2026-09', isFixed: true },
  { id: 't-saude-2', date: '2026-10-05', desc: 'Academia', amount: 100.00, type: 'expense', cat: 'Saúde', subCat: 'Academia', method: 'credit', cardId: 'platinum', cycle: '2026-10', isFixed: true },
  { id: 't-fixo-1',  date: '2026-09-10', desc: 'Streaming', amount: 40.00, type: 'expense', cat: 'Fixos', subCat: 'Assinaturas', method: 'credit', cardId: 'nubank', cycle: '2026-09', isFixed: true },
  { id: 't-fixo-2',  date: '2026-10-10', desc: 'Streaming', amount: 40.00, type: 'expense', cat: 'Fixos', subCat: 'Assinaturas', method: 'credit', cardId: 'nubank', cycle: '2026-10', isFixed: true },
];
