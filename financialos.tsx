import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  LayoutDashboard, CreditCard, PieChart as PieChartIcon, HeartPulse, 
  Target, Users, Calendar, TrendingUp, Settings, Plus, Search, 
  Filter, ArrowUpRight, ArrowDownRight, Wallet, DollarSign, ChevronRight,
  ChevronLeft, X, Check, ArrowRightLeft, Landmark, Layers, CalendarDays, AlertTriangle, ShieldCheck, Plane, Smartphone
} from 'lucide-react';

// --- CONFIGURAÇÕES BASE ---
const CICLO_START_DAY = 27; // O mês financeiro vira no dia 27

const CARDS_DB = [
  { id: 'nubank', name: 'Nubank', bank: 'Nubank', limit: 3500, color: '#9333ea', icon: Smartphone, closingDay: 20, dueDay: 27 },
  { id: 'latam', name: 'Itaú Latam', bank: 'Itaú', limit: 4591, color: '#db2777', icon: Plane, closingDay: 20, dueDay: 27 },
  { id: 'platinum', name: 'Itaú Platinum', bank: 'Itaú', limit: 2990, color: '#f97316', icon: CreditCard, closingDay: 20, dueDay: 27 },
  { id: 'multiplo', name: 'Itaú Múltiplo', bank: 'Itaú', limit: 268, color: '#fb923c', icon: CreditCard, closingDay: 20, dueDay: 27 },
];

const CATEGORIES_DB = {
  'Saúde': { icon: HeartPulse, color: '#ef4444', subs: ['Academia', 'Medicamentos', 'Consultas', 'Exames', 'Tratamentos', 'Plano de Saúde', 'Estética', 'Outros'] },
  'Alimentação': { icon: PieChartIcon, color: '#f97316', subs: ['Mercado', 'Restaurante', 'Delivery', 'Café', 'Fast food', 'Outros'] },
  'Transporte': { icon: PieChartIcon, color: '#eab308', subs: ['Uber', 'Combustível', 'Transporte público', 'Viagem', 'Outros'] },
  'Compras': { icon: PieChartIcon, color: '#a855f7', subs: ['Roupas', 'Beleza', 'Eletrônicos', 'Casa', 'Presentes', 'Outros'] },
  'Fixos': { icon: Landmark, color: '#64748b', subs: ['Aluguel', 'Internet', 'Celular', 'Assinaturas', 'Outros'] },
  'Investimentos': { icon: TrendingUp, color: '#10b981', subs: ['Reserva Casa', 'Reserva Cirurgia', 'Reserva de Emergência', 'Ações', 'CDB', 'Outros'] },
  'Lazer': { icon: PieChartIcon, color: '#ec4899', subs: ['Cinema', 'Shows', 'Bares', 'Viagens', 'Outros'] },
  'Renda': { icon: DollarSign, color: '#10b981', subs: ['Salário', 'PLR', 'Dividendos', 'Reembolso', 'Outros'] },
};

const INITIAL_TRANSACTIONS = [
  { id: 't-sal-1', date: '2026-09-27', desc: 'Salário', amount: 5000.00, type: 'income', cat: 'Renda', subCat: 'Salário', method: 'transfer', cycle: '2026-10' },
  { id: 't-sal-2', date: '2026-08-27', desc: 'Salário', amount: 5000.00, type: 'income', cat: 'Renda', subCat: 'Salário', method: 'transfer', cycle: '2026-09' },
  { id: 't-nu-1', date: '2026-08-15', desc: 'Fatura Cartão 1', amount: 1500.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'nubank', cycle: '2026-09', installments: 1, currentInst: 1 },
  { id: 't-nu-2', date: '2026-09-15', desc: 'Fatura Cartão 1', amount: 800.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'nubank', cycle: '2026-10', installments: 1, currentInst: 1 },
  { id: 't-latam-1', date: '2026-08-10', desc: 'Fatura Cartão 2', amount: 600.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'latam', cycle: '2026-09', installments: 1, currentInst: 1 },
  { id: 't-latam-2', date: '2026-09-10', desc: 'Fatura Cartão 2', amount: 700.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'latam', cycle: '2026-10', installments: 1, currentInst: 1 },
  { id: 't-plat-1', date: '2026-08-12', desc: 'Fatura Cartão 3', amount: 1200.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'platinum', cycle: '2026-09', installments: 1, currentInst: 1 },
  { id: 't-plat-2', date: '2026-09-12', desc: 'Fatura Cartão 3', amount: 350.00, type: 'expense', cat: 'Compras', subCat: 'Outros', method: 'credit', cardId: 'platinum', cycle: '2026-10', installments: 1, currentInst: 1 },
  { id: 't-saude-1', date: '2026-09-05', desc: 'Academia', amount: 100.00, type: 'expense', cat: 'Saúde', subCat: 'Academia', method: 'credit', cardId: 'platinum', cycle: '2026-09', isFixed: true },
  { id: 't-saude-2', date: '2026-10-05', desc: 'Academia', amount: 100.00, type: 'expense', cat: 'Saúde', subCat: 'Academia', method: 'credit', cardId: 'platinum', cycle: '2026-10', isFixed: true },
  { id: 't-fixo-1', date: '2026-09-10', desc: 'Streaming', amount: 40.00, type: 'expense', cat: 'Fixos', subCat: 'Assinaturas', method: 'credit', cardId: 'nubank', cycle: '2026-09', isFixed: true },
  { id: 't-fixo-2', date: '2026-10-10', desc: 'Streaming', amount: 40.00, type: 'expense', cat: 'Fixos', subCat: 'Assinaturas', method: 'credit', cardId: 'nubank', cycle: '2026-10', isFixed: true },
];

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

const getFinancialCycle = (dateString) => {
  const d = new Date(dateString + 'T00:00:00');
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  if (d.getDate() >= CICLO_START_DAY) {
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }
  return `${year}-${String(month).padStart(2, '0')}`;
};

const getCycleLabel = (cycleStr) => {
  if(!cycleStr) return '';
  const [y, m] = cycleStr.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[parseInt(m)-1]}/${y.substring(2)}`;
};

export default function FinancialOS() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [currentCycle, setCurrentCycle] = useState('2026-10');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- GITHUB SETTINGS STATE ---
  const [githubConfig, setGithubConfig] = useState(() => {
    return {
      token: localStorage.getItem('fin_github_token') || '',
      owner: localStorage.getItem('fin_github_owner') || '',
      repo: localStorage.getItem('fin_github_repo') || '',
      branch: localStorage.getItem('fin_github_branch') || 'db/transactions'
    };
  });
  const [fileSha, setFileSha] = useState(null);

  // Carrega os dados do GitHub ao iniciar
  useEffect(() => {
    async function fetchFromGithub() {
      if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
        setTransactions(INITIAL_TRANSACTIONS); // Fallback to mock
        setIsLoading(false);
        return;
      }

      try {
        const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/data/transactions.json?ref=${githubConfig.branch}`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setFileSha(data.sha);
          // Decode Base64 content
          const decodedContent = decodeURIComponent(escape(atob(data.content)));
          const parsed = JSON.parse(decodedContent);
          setTransactions(parsed);
        } else if (res.status === 404) {
          // File doesn't exist yet on that branch, use empty or initial
          setTransactions([]);
        } else {
          throw new Error('Falha ao buscar do GitHub');
        }
      } catch (err) {
        console.error('Erro na API do GitHub:', err);
        setTransactions(INITIAL_TRANSACTIONS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFromGithub();
  }, [githubConfig]);

  const commitToGithub = async (newTransactions, message) => {
    if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
      // Just update local state if no github config
      setTransactions(newTransactions);
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/data/transactions.json`;
      const contentStr = JSON.stringify(newTransactions, null, 2);
      // Encode Base64 carefully to avoid utf-8 issues
      const encodedContent = btoa(unescape(encodeURIComponent(contentStr)));
      
      const body = {
        message: message,
        content: encodedContent,
        branch: githubConfig.branch,
        ...(fileSha && { sha: fileSha })
      };

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubConfig.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
        setFileSha(data.content.sha); // Update SHA for next commit
        setTransactions(newTransactions);
      } else {
        const errorData = await res.json();
        alert(`Erro ao salvar no GitHub: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o GitHub.');
    } finally {
      setIsLoading(false);
    }
  };

  // Lista de ciclos disponíveis
  const availableCycles = useMemo(() => {
    const cycles = new Set(transactions.map(t => t.cycle));
    ['2026-08', '2026-09', '2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04'].forEach(c => cycles.add(c));
    return Array.from(cycles).sort();
  }, [transactions]);

  // Dados calculados para o ciclo atual
  const cycleData = useMemo(() => {
    const tCycle = transactions.filter(t => t.cycle === currentCycle);
    let totalIncome = 0;
    let totalExpense = 0;
    let totalInvested = 0;
    let cardTotals = { nubank: 0, latam: 0, platinum: 0, multiplo: 0 };
    let categoryTotals = {};

    tCycle.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') {
        if (t.cat === 'Investimentos') totalInvested += t.amount;
        else totalExpense += t.amount;
        
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

  const handleSaveTransaction = async (formData) => {
    const baseDate = formData.date;
    const baseCycle = getFinancialCycle(baseDate);
    const amountNum = parseFloat(formData.amount);
    let newTxs = [];
    
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
          desc: `${formData.desc} (${i+1}/${formData.installments})`,
          amount: instAmount,
          type: formData.type,
          cat: formData.cat,
          subCat: formData.subCat,
          method: 'credit',
          cardId: formData.cardId,
          cycle: cycleStr,
          installments: formData.installments,
          currentInst: i + 1
        });
        month++;
        if (month > 12) { month = 1; year++; }
      }
    } else {
      newTxs.push({
        ...formData,
        id: `tx-${Date.now()}`,
        amount: amountNum,
        cycle: baseCycle
      });
    }

    const updatedTransactions = [...transactions, ...newTxs];
    await commitToGithub(updatedTransactions, `feat(tx): Adiciona transação ${formData.desc} [${amountNum}]`);
    
    setIsModalOpen(false);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-blue-600/10 text-blue-500 font-bold border border-blue-500/20' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-blue-500' : 'text-slate-500'} />
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-blue-500 font-bold">
        Conectando ao Backend Financial.OS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans flex overflow-hidden">
      
      {/* SIDEBAR DE NAVEGAÇÃO COMPLETA */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800/60 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black">F</span>
            </div>
            Financial.OS
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-2 px-4">Principal</div>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard Executivo" />
          <NavItem id="timeline" icon={CalendarDays} label="Visão Mensal (Planilha)" />
          <NavItem id="transactions" icon={ArrowRightLeft} label="Lançamentos & Extrato" />
          
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-6 px-4">Análises & Crédito</div>
          <NavItem id="cards" icon={CreditCard} label="Cartões & Limites" />
          <NavItem id="categories" icon={PieChartIcon} label="Categorias & Orçamento" />
          <NavItem id="health" icon={HeartPulse} label="Saúde & Bem-estar" />
          
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-6 px-4">Planejamento</div>
          <NavItem id="projections" icon={Calendar} label="Projeção 12 Meses" />
          <NavItem id="goals" icon={Target} label="Metas & Reservas" />
          <NavItem id="people" icon={Users} label="Controle de Pessoas" />

          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-6 px-4">Sistema</div>
          <NavItem id="settings" icon={Settings} label="Configurações (GitHub)" />
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER TOPBAR */}
        <header className="h-20 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
              <button 
                onClick={() => {
                  const idx = availableCycles.indexOf(currentCycle);
                  if(idx > 0) setCurrentCycle(availableCycles[idx - 1]);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="px-4 font-bold text-blue-400 min-w-[130px] text-center">
                Ciclo {getCycleLabel(currentCycle)}
              </div>
              <button 
                onClick={() => {
                  const idx = availableCycles.indexOf(currentCycle);
                  if(idx < availableCycles.length - 1) setCurrentCycle(availableCycles[idx + 1]);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all transform active:scale-95"
            >
              <Plus size={20} /> Novo Lançamento
            </button>
          </div>
        </header>

        {/* ÁREA RENDERIZADA DINAMICAMENTE POR MÓDULO */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView data={cycleData} cycle={currentCycle} />}
            {activeTab === 'timeline' && <TimelineSpreadsheetView transactions={transactions} cycles={availableCycles} />}
            {activeTab === 'cards' && <CardsView transactions={transactions} cards={CARDS_DB} currentCycle={currentCycle} />}
            {activeTab === 'transactions' && <TransactionsListView transactions={transactions} />}
            {activeTab === 'categories' && <CategoriesView data={cycleData} />}
            {activeTab === 'health' && <HealthView transactions={transactions} currentCycle={currentCycle} />}
            {activeTab === 'projections' && <ProjectionsView transactions={transactions} cycles={availableCycles} currentCycle={currentCycle} />}
            {activeTab === 'goals' && <GoalsView />}
            {activeTab === 'people' && <PeopleView />}
            {activeTab === 'settings' && <SettingsView config={githubConfig} setConfig={setGithubConfig} />}
          </div>
        </div>
      </main>

      {/* MODAL DE LANÇAMENTO COMPLEXO */}
      {isModalOpen && <TransactionModal onClose={() => setIsModalOpen(false)} onSave={handleSaveTransaction} cards={CARDS_DB} />}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}} />
    </div>
  );
}

// --- 0. CONFIGURAÇÕES (GITHUB API) ---
function SettingsView({ config, setConfig }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('fin_github_token', localConfig.token);
    localStorage.setItem('fin_github_owner', localConfig.owner);
    localStorage.setItem('fin_github_repo', localConfig.repo);
    localStorage.setItem('fin_github_branch', localConfig.branch);
    setConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-800 rounded-xl text-slate-300"><Settings size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Configurações de Banco de Dados (GitHub)</h2>
          <p className="text-slate-400">Integração Serverless com repositório remoto via API.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Personal Access Token (GitHub PAT)</label>
            <input type="password" value={localConfig.token} onChange={e => setLocalConfig({...localConfig, token: e.target.value})} placeholder="ghp_..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            <p className="text-[10px] text-slate-500 mt-1">Precisa ter permissão de escrita (repo).</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Nome de Usuário (Owner)</label>
            <input type="text" value={localConfig.owner} onChange={e => setLocalConfig({...localConfig, owner: e.target.value})} placeholder="Ex: ichcamile" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Nome do Repositório</label>
            <input type="text" value={localConfig.repo} onChange={e => setLocalConfig({...localConfig, repo: e.target.value})} placeholder="Ex: controle-financeiro" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Branch (Banco de Dados)</label>
            <input type="text" value={localConfig.branch} onChange={e => setLocalConfig({...localConfig, branch: e.target.value})} placeholder="db/transactions" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between">
          <p className="text-xs text-slate-500 max-w-sm">Esses dados ficarão salvos <b>localmente</b> no seu navegador (localStorage) por segurança.</p>
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            {saved ? 'Salvo! ✔️' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 1. DASHBOARD EXECUTIVO ---
function DashboardView({ data, cycle }) {
  const catChartData = Object.entries(data.categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><PieChartIcon size={20} className="text-slate-400" /> Distribuição por Categoria</h3>
          {catChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catChartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                  <XAxis type="number" tickFormatter={(val) => `R$ ${val/1000}k`} stroke="#64748b" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontWeight="500" />
                  <RechartsTooltip 
                    formatter={(value) => [formatCurrency(value), "Total"]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {catChartData.map((entry, index) => (
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

        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><CreditCard size={20} className="text-slate-400" /> Faturas do Mês</h3>
          <div className="space-y-4">
            {Object.entries(data.cardTotals).map(([cardId, val]) => {
              const card = CARDS_DB.find(c => c.id === cardId);
              const percentLimit = (val / card.limit) * 100;
              return (
                <div key={cardId} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-200" style={{ color: card.color }}>{card.name}</span>
                    <span className="font-bold text-white">{formatCurrency(val)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(percentLimit, 100)}%`, backgroundColor: card.color }}></div>
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

// --- 2. VISÃO MENSAL DETALHADA (ESTILO PLANILHA) ---
function TimelineSpreadsheetView({ transactions, cycles }) {
  const [startFilter, setStartFilter] = useState('2026-09');
  
  const filteredCycles = cycles.filter(c => c >= startFilter);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><CalendarDays size={22} className="text-blue-500" /> Visão Mensal Detalhada (Estilo Planilha)</h2>
          <p className="text-slate-400 text-sm">Acompanhe a evolução lado a lado com base na sua regra de fechamento (Dia 27).</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Visualizar a partir de:</span>
          <select 
            value={startFilter} 
            onChange={e => setStartFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-blue-500"
          >
            {cycles.map(c => <option key={c} value={c}>Ciclo {getCycleLabel(c)}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-6">
        <div className="flex gap-6 min-w-max">
          {filteredCycles.map(cycleStr => {
            const tCycle = transactions.filter(t => t.cycle === cycleStr);
            let income = tCycle.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
            let expense = tCycle.filter(t => t.type === 'expense' && t.cat !== 'Investimentos').reduce((acc, t) => acc + t.amount, 0);
            let invested = tCycle.filter(t => t.type === 'expense' && t.cat === 'Investimentos').reduce((acc, t) => acc + t.amount, 0);
            let sobra = income - expense - invested;

            return (
              <div key={cycleStr} className="w-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-xl">
                <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-blue-400">{getCycleLabel(cycleStr)}</span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">{cycleStr}</span>
                </div>

                <div className="space-y-3 mb-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Salário / Receita:</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total de Gastos:</span>
                    <span className="text-red-400 font-bold">{formatCurrency(expense)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Investimentos:</span>
                    <span className="text-purple-400 font-bold">{formatCurrency(invested)}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-bold">
                    <span className="text-slate-300">Sobra do Mês:</span>
                    <span className={sobra >= 0 ? 'text-blue-400' : 'text-red-400'}>{formatCurrency(sobra)}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto max-h-80 custom-scrollbar pr-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lançamentos do Ciclo</div>
                  {tCycle.length > 0 ? (
                    tCycle.map(t => (
                      <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{t.desc}</div>
                          <div className="text-[10px] text-slate-500">{t.cat} {t.method === 'credit' ? `• Cartão` : ''}</div>
                        </div>
                        <div className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-600 text-xs py-8">Nenhum lançamento registrado.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- 3. MÓDULO DE CARTÕES & LIMITES ---
function CardsView({ transactions, cards, currentCycle }) {
  const cardAnalysis = cards.map(card => {
    const futureTxs = transactions.filter(t => t.method === 'credit' && t.cardId === card.id && t.cycle >= currentCycle);
    const totalDue = futureTxs.reduce((acc, t) => acc + t.amount, 0);
    const limitAvailable = card.limit - totalDue;
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
          return (
            <div key={card.id} className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl hover:border-slate-700 transition-all duration-300">
              <div className="absolute -top-4 -right-4 opacity-10 rotate-12">
                {card.icon && <card.icon size={100} style={{ color: card.color }} />}
              </div>
              <div className="h-1.5 w-full" style={{ backgroundColor: card.color, boxShadow: `0 0 10px ${card.color}` }}></div>
              <div className="p-5 flex-1 flex flex-col relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  {card.icon && <div className="p-1.5 rounded-lg bg-slate-950/50" style={{ color: card.color }}><card.icon size={16} /></div>}
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
                      <div className="h-2 rounded-full" style={{ width: `${Math.min(percentUsed, 100)}%`, backgroundColor: card.color }}></div>
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

// --- 4. LISTA DE LANÇAMENTOS & EXTRATO ---
function TransactionsListView({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = transactions.filter(t => 
    t.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><ArrowRightLeft size={22} className="text-blue-500" /> Extrato Completo de Transações</h2>
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
                  {t.installments > 1 && <span className="ml-2 text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Parcela {t.currentInst}/{t.installments}</span>}
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

// --- MÓDULOS DE SUPORTE (CATEGORIAS, SAÚDE, PROJEÇÕES, METAS, PESSOAS) ---
function CategoriesView({ data }) {
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
                <div className="p-3 rounded-xl bg-slate-800 text-white" style={{ color: info.color }}><Icon size={24} /></div>
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

function HealthView({ transactions, currentCycle }) {
  const healthTxs = transactions.filter(t => t.cycle === currentCycle && t.cat === 'Saúde');
  const totalHealth = healthTxs.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><HeartPulse size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Saúde & Bem-Estar</h2>
          <p className="text-slate-400">Controle dedicado a medicamentos, exames, academia e tratamentos.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <h3 className="text-slate-400 font-semibold text-sm">Total Investido em Saúde neste Ciclo</h3>
          <div className="text-3xl font-bold text-white mt-1">{formatCurrency(totalHealth)}</div>
        </div>
        <div className="p-4 bg-red-500/10 rounded-2xl text-red-400"><HeartPulse size={36} /></div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-lg">Histórico de Lançamentos de Saúde</h3>
        {healthTxs.map(t => (
          <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-200">{t.desc}</div>
              <div className="text-xs text-slate-500">{t.subCat} • {t.date}</div>
            </div>
            <div className="font-bold text-red-400">{formatCurrency(t.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectionsView({ transactions, cycles, currentCycle }) {
  const startIdx = cycles.indexOf(currentCycle) !== -1 ? cycles.indexOf(currentCycle) : 0;
  const targetCycles = cycles.slice(startIdx, startIdx + 12);

  const projectionData = targetCycles.map(c => {
    const txs = transactions.filter(t => t.cycle === c);
    let income = 0, expenses = 0, credit = 0;
    txs.forEach(t => {
      if (t.type === 'income') income += t.amount;
      if (t.type === 'expense' && t.method !== 'credit') expenses += t.amount;
      if (t.type === 'expense' && t.method === 'credit') credit += t.amount;
    });
    return { name: getCycleLabel(c), Receitas: income, Faturas: credit, Fixos: expenses, Sobra: income - (credit + expenses) };
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Calendar size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Projeção Financeira de 12 Meses</h2>
          <p className="text-slate-400">Comprometimento futuro de faturas e saldo projetado.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[450px] shadow-xl">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFaturas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSobra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(val) => `R$${val/1000}k`} />
            <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
            <Legend />
            <Area type="monotone" dataKey="Faturas" stroke="#ef4444" fillOpacity={1} fill="url(#colorFaturas)" />
            <Area type="monotone" dataKey="Sobra" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSobra)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GoalsView() {
  const goals = [
    { name: 'Reserva da Casa', current: 18000, target: 50000, color: '#3b82f6' },
    { name: 'Reserva Cirurgia', current: 12000, target: 15000, color: '#10b981' },
    { name: 'Reserva de Emergência', current: 8000, target: 20000, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Target size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-white">Metas & Reservas Financeiras</h2>
          <p className="text-slate-400">Acompanhamento do progresso para a sua mudança e objetivos de vida.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map(g => {
          const pct = (g.current / g.target) * 100;
          return (
            <div key={g.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-1">{g.name}</h3>
                <div className="text-2xl font-black text-emerald-400 mt-2">{formatCurrency(g.current)}</div>
                <div className="text-xs text-slate-500">Meta: {formatCurrency(g.target)}</div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Progresso</span>
                  <span>{pct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.color }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PeopleView() {
  const people = [
    { name: 'Vitor', toReceive: 1600, toPay: 400 },
    { name: 'Mãe', toReceive: 3160, toPay: 0 },
    { name: 'Pai', toReceive: 1200, toPay: 0 },
    { name: 'Isabela', toReceive: 415, toPay: 204 },
  ];

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
        {people.map(p => {
          const balance = p.toReceive - p.toPay;
          return (
            <div key={p.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-3">{p.name}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-slate-400"><span>A Receber:</span> <span className="text-emerald-400 font-bold">{formatCurrency(p.toReceive)}</span></div>
                  <div className="flex justify-between text-slate-400"><span>A Pagar:</span> <span className="text-red-400 font-bold">{formatCurrency(p.toPay)}</span></div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Saldo Líquido</span>
                <span className={`font-bold text-lg ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{formatCurrency(balance)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- MODAL DE NOVO LANÇAMENTO ---
function TransactionModal({ onClose, onSave, cards }) {
  const [type, setType] = useState('expense');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('credit');
  const [cardId, setCardId] = useState(cards[0].id);
  const [installments, setInstallments] = useState(1);
  const [cat, setCat] = useState('Compras');
  const [subCat, setSubCat] = useState('Outros');

  const availableSubCats = CATEGORIES_DB[cat]?.subs || ['Outros'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc || !amount || !date) return;
    onSave({
      desc, amount, date, type, 
      method: type === 'income' ? 'transfer' : method, 
      cardId: (type === 'expense' && method === 'credit') ? cardId : null,
      installments: (type === 'expense' && method === 'credit') ? parseInt(installments) : 1,
      cat: type === 'income' ? 'Renda' : cat,
      subCat: type === 'income' ? 'Salário' : subCat
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Plus size={24} className="text-blue-500" /> Novo Lançamento</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${type === 'expense' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-slate-500'}`}>Despesa</button>
            <button type="button" onClick={() => setType('income')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-slate-500'}`}>Receita</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Valor (R$)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><DollarSign size={18} className="text-slate-500" /></div>
                  <input type="number" required step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-2xl font-bold text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Descrição</label>
                <input type="text" required value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Mercado, Uber..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Data Efetiva</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                <p className="text-[10px] text-slate-500 mt-1">* Compras a partir do dia 27 caem no próximo ciclo.</p>
              </div>
            </div>

            <div className="space-y-4">
              {type === 'expense' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Categoria</label>
                      <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                        {Object.keys(CATEGORIES_DB).filter(c => c !== 'Renda').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Subcategoria</label>
                      <select value={subCat} onChange={e => setSubCat(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                        {availableSubCats.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Método de Pagamento</label>
                    <select value={method} onChange={e => setMethod(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                      <option value="credit">Cartão de Crédito</option>
                      <option value="debit">Débito</option>
                      <option value="pix">PIX</option>
                    </select>
                  </div>
                  {method === 'credit' && (
                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Cartão</label>
                        <select value={cardId} onChange={e => setCardId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white">
                          {cards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">Parcelamento</label>
                        <select value={installments} onChange={e => setInstallments(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white">
                          {[...Array(24)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x {i > 0 ? `(R$ ${(amount/(i+1)).toFixed(2)}/mês)` : 'à vista'}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white">Cancelar</button>
          <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg"><Check size={18} /> Salvar Lançamento</button>
        </div>
      </div>
    </div>
  );
}