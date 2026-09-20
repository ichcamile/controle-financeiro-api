import React, { useState, useMemo } from 'react';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// UI
import { TransactionModal } from './components/ui/TransactionModal';

// Pages
import { DashboardView }           from './pages/DashboardView';
import { TimelineSpreadsheetView } from './pages/TimelineSpreadsheetView';
import { CardsView }               from './pages/CardsView';
import { TransactionsListView }    from './pages/TransactionsListView';
import { CategoriesView }          from './pages/CategoriesView';
import { HealthView }              from './pages/HealthView';
import { ProjectionsView }         from './pages/ProjectionsView';
import { GoalsView }               from './pages/GoalsView';
import { PeopleView }              from './pages/PeopleView';
import { SettingsView }            from './pages/SettingsView';

// Hooks
import { useGithubStorage } from './hooks/useGithubStorage';
import { useCycleData }     from './hooks/useCycleData';

// Constants & Utils
import { CARDS_DB }            from './constants/cards';
import { getFinancialCycle }   from './utils/cycles';

// Types
import { Transaction } from './types';

type TabId =
  | 'dashboard' | 'timeline' | 'transactions'
  | 'cards' | 'categories' | 'health'
  | 'projections' | 'goals' | 'people' | 'settings';

export default function FinancialOS() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [currentCycle, setCurrentCycle] = useState('2026-10');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dados e integração com GitHub
  const { transactions, githubConfig, setGithubConfig, isLoading, commitToGithub } = useGithubStorage();

  // Dados calculados para o ciclo ativo
  const cycleData = useCycleData(transactions, currentCycle);

  // Ciclos disponíveis (dinâmico baseado nas transações + preenchimento fixo)
  const availableCycles = useMemo(() => {
    const cycles = new Set(transactions.map(t => t.cycle));
    ['2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04'].forEach(c => cycles.add(c));
    return Array.from(cycles).sort();
  }, [transactions]);

  // Salva uma nova transação (com suporte a parcelamento)
  const handleSaveTransaction = async (formData: {
    desc: string; amount: string; date: string;
    type: 'income' | 'expense'; method: string;
    cardId: string | null; installments: number;
    cat: string; subCat: string;
  }) => {
    const baseDate  = formData.date;
    const baseCycle = getFinancialCycle(baseDate);
    const amountNum = parseFloat(formData.amount);
    let newTxs: Transaction[] = [];

    if (formData.method === 'credit' && formData.installments > 1) {
      const instAmount = amountNum / formData.installments;
      const groupId = `grp-${Date.now()}`;
      let [year, month] = baseCycle.split('-').map(Number);

      for (let i = 0; i < formData.installments; i++) {
        const cycleStr = `${year}-${String(month).padStart(2, '0')}`;
        newTxs.push({
          id: `tx-${Date.now()}-${i}`,
          groupId,
          date: i === 0 ? baseDate : `${year}-${String(month).padStart(2, '0')}-01`,
          desc: `${formData.desc} (${i + 1}/${formData.installments})`,
          amount: instAmount,
          type: formData.type as 'expense',
          cat: formData.cat,
          subCat: formData.subCat,
          method: 'credit',
          cardId: formData.cardId,
          cycle: cycleStr,
          installments: formData.installments,
          currentInst: i + 1,
        });
        month++;
        if (month > 12) { month = 1; year++; }
      }
    } else {
      newTxs.push({
        id: `tx-${Date.now()}`,
        date: baseDate,
        desc: formData.desc,
        amount: amountNum,
        type: formData.type as 'income' | 'expense',
        cat: formData.cat,
        subCat: formData.subCat,
        method: formData.method as Transaction['method'],
        cardId: formData.cardId,
        cycle: baseCycle,
        installments: 1,
        currentInst: 1,
      });
    }

    const updatedTransactions = [...transactions, ...newTxs];
    await commitToGithub(updatedTransactions, `feat(tx): Adiciona transação ${formData.desc} [${amountNum}]`);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-blue-500 font-bold">
        Conectando ao Backend Financial.OS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={(id) => setActiveTab(id as TabId)}
        onNewTransaction={() => setIsModalOpen(true)}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          currentCycle={currentCycle}
          availableCycles={availableCycles}
          onCycleChange={setCurrentCycle}
          onNewTransaction={() => setIsModalOpen(true)}
        />

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard'    && <DashboardView           data={cycleData} cycle={currentCycle} />}
            {activeTab === 'timeline'     && <TimelineSpreadsheetView transactions={transactions} cycles={availableCycles} />}
            {activeTab === 'cards'        && <CardsView               transactions={transactions} cards={CARDS_DB} currentCycle={currentCycle} />}
            {activeTab === 'transactions' && <TransactionsListView    transactions={transactions} />}
            {activeTab === 'categories'   && <CategoriesView          data={cycleData} />}
            {activeTab === 'health'       && <HealthView              transactions={transactions} currentCycle={currentCycle} />}
            {activeTab === 'projections'  && <ProjectionsView         transactions={transactions} cycles={availableCycles} currentCycle={currentCycle} />}
            {activeTab === 'goals'        && <GoalsView />}
            {activeTab === 'people'       && <PeopleView />}
            {activeTab === 'settings'     && <SettingsView            config={githubConfig} setConfig={setGithubConfig} />}
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <TransactionModal
          cards={CARDS_DB}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTransaction}
        />
      )}

      {/* Scrollbar global */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar        { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track  { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb  { background: #1e293b; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      ` }} />
    </div>
  );
}
