import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { CycleData } from '../types';
import { CATEGORIES_DB } from '../constants/categories';
import { formatCurrency } from '../utils/currency';

interface CategoriesViewProps {
  data: CycleData;
}

export function CategoriesView({ data }: CategoriesViewProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><PieChartIcon size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Categorias & Orçamentos</h2>
          <p className="text-slate-400">Hierarquia analítica de gastos e acompanhamento por subcategorias.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(CATEGORIES_DB).map(([catName, info]) => {
          const Icon = info.icon;
          const totalCat = data.categoryTotals[catName] || 0;
          return (
            <div key={catName} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-800" style={{ color: info.color }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{catName}</h3>
                  <p className="text-xs text-slate-500">{info.subs.join(', ')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">{formatCurrency(totalCat)}</div>
                <div className="text-xs text-slate-500">Gasto no Ciclo</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
