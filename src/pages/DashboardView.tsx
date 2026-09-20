import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { PieChart as PieChartIcon, CreditCard, ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from 'lucide-react';
import { CycleData } from '../types';
import { CARDS_DB } from '../constants/cards';
import { formatCurrency } from '../utils/currency';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];

interface DashboardViewProps {
  data: CycleData;
  cycle: string;
}

export function DashboardView({ data }: DashboardViewProps) {
  const catChartData = Object.entries(data.categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><ArrowDownRight size={18} /></div>
            <span className="font-semibold text-sm">Receitas do Mês</span>
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(data.totalIncome)}</div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><ArrowUpRight size={18} /></div>
            <span className="font-semibold text-sm">Despesas & Faturas</span>
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(data.totalExpense)}</div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><TrendingUp size={18} /></div>
            <span className="font-semibold text-sm">Investimentos & Reservas</span>
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(data.totalInvested)}</div>
          <div className="text-xs text-slate-500 mt-2">Taxa de Poupança: {data.taxaPoupanca.toFixed(1)}%</div>
        </div>

        <div className={`backdrop-blur border rounded-2xl p-6 shadow-xl ${data.sobra >= 0 ? 'bg-blue-900/20 border-blue-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${data.sobra >= 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}><Wallet size={18} /></div>
            <span className={`font-semibold text-sm ${data.sobra >= 0 ? 'text-blue-400' : 'text-red-400'}`}>Sobra Livre do Ciclo</span>
          </div>
          <div className={`text-3xl font-bold ${data.sobra >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{formatCurrency(data.sobra)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por categoria */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieChartIcon size={20} className="text-slate-400" /> Distribuição por Categoria
          </h3>
          {catChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catChartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" tickFormatter={(val) => `R$ ${val / 1000}k`} stroke="#64748b" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontWeight="500" />
                  <RechartsTooltip
                    formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Total']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {catChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">Sem gastos categorizados neste ciclo.</div>
          )}
        </div>

        {/* Faturas dos cartões */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <CreditCard size={20} className="text-slate-400" /> Faturas do Mês
          </h3>
          <div className="space-y-4">
            {Object.entries(data.cardTotals).map(([cardId, val]) => {
              const card = CARDS_DB.find(c => c.id === cardId);
              if (!card) return null;
              const percentLimit = (val / card.limit) * 100;
              return (
                <div key={cardId} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-200" style={{ color: card.color }}>{card.name}</span>
                    <span className="font-bold text-white">{formatCurrency(val)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(percentLimit, 100)}%`, backgroundColor: card.color }} />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">{percentLimit.toFixed(1)}% do limite utilizado</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
