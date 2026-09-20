import React, { useState } from 'react';
import { X, Plus, Check, DollarSign } from 'lucide-react';
import { Card, Transaction } from '../../types';
import { CATEGORIES_DB } from '../../constants/categories';

interface TransactionFormData {
  desc: string;
  amount: string;
  date: string;
  type: 'income' | 'expense';
  method: 'credit' | 'debit' | 'pix' | 'transfer';
  cardId: string | null;
  installments: number;
  cat: string;
  subCat: string;
}

interface TransactionModalProps {
  cards: Card[];
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
}

export function TransactionModal({ cards, onClose, onSave }: TransactionModalProps) {
  const [type, setType]               = useState<'income' | 'expense'>('expense');
  const [desc, setDesc]               = useState('');
  const [amount, setAmount]           = useState('');
  const [date, setDate]               = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod]           = useState<'credit' | 'debit' | 'pix'>('credit');
  const [cardId, setCardId]           = useState(cards[0]?.id ?? '');
  const [installments, setInstallments] = useState(1);
  const [cat, setCat]                 = useState('Compras');
  const [subCat, setSubCat]           = useState('Outros');

  const availableSubCats = CATEGORIES_DB[cat]?.subs ?? ['Outros'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount || !date) return;
    onSave({
      desc,
      amount,
      date,
      type,
      method: type === 'income' ? 'transfer' : method,
      cardId: type === 'expense' && method === 'credit' ? cardId : null,
      installments: type === 'expense' && method === 'credit' ? installments : 1,
      cat: type === 'income' ? 'Renda' : cat,
      subCat: type === 'income' ? 'Salário' : subCat,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do modal */}
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus size={24} className="text-blue-500" /> Novo Lançamento
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Toggle Despesa / Receita */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${type === 'expense' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-slate-500'}`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-500'}`}
            >
              Receita
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Valor (R$)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-slate-500" />
                  </div>
                  <input
                    type="number" required step="0.01" min="0"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Descrição</label>
                <input
                  type="text" required
                  value={desc} onChange={e => setDesc(e.target.value)}
                  placeholder="Ex: Mercado, Uber..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Data Efetiva</label>
                <input
                  type="date" required
                  value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">* Compras a partir do dia 27 caem no próximo ciclo.</p>
              </div>
            </div>

            {/* Coluna direita — somente para despesas */}
            <div className="space-y-4">
              {type === 'expense' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Categoria</label>
                      <select
                        value={cat} onChange={e => setCat(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      >
                        {Object.keys(CATEGORIES_DB).filter(c => c !== 'Renda').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Subcategoria</label>
                      <select
                        value={subCat} onChange={e => setSubCat(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                      >
                        {availableSubCats.map(sc => (
                          <option key={sc} value={sc}>{sc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Método de Pagamento</label>
                    <select
                      value={method} onChange={e => setMethod(e.target.value as 'credit' | 'debit' | 'pix')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="credit">Cartão de Crédito</option>
                      <option value="debit">Débito</option>
                      <option value="pix">PIX</option>
                    </select>
                  </div>

                  {method === 'credit' && (
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Cartão</label>
                        <select
                          value={cardId ?? ''} onChange={e => setCardId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        >
                          {cards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Parcelamento</label>
                        <select
                          value={installments} onChange={e => setInstallments(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                        >
                          {[...Array(24)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}x {i > 0 ? `(R$ ${(Number(amount) / (i + 1)).toFixed(2)}/mês)` : 'à vista'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </form>

        {/* Footer do modal */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg"
          >
            <Check size={18} /> Salvar Lançamento
          </button>
        </div>
      </div>
    </div>
  );
}
