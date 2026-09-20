import React from 'react';
import {
  LayoutDashboard, CreditCard, PieChart as PieChartIcon, HeartPulse,
  Target, Users, Calendar, TrendingUp, Settings, Plus,
  ArrowRightLeft, CalendarDays,
} from 'lucide-react';

interface NavItemProps {
  id: string;
  icon: React.ElementType;
  label: string;
  activeTab: string;
  onNavigate: (id: string) => void;
}

function NavItem({ id, icon: Icon, label, activeTab, onNavigate }: NavItemProps) {
  return (
    <button
      onClick={() => onNavigate(id)}
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
}

interface SidebarProps {
  activeTab: string;
  onNavigate: (id: string) => void;
  onNewTransaction: () => void;
}

export function Sidebar({ activeTab, onNavigate, onNewTransaction }: SidebarProps) {
  const navProps = { activeTab, onNavigate };

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800/60 flex-col hidden md:flex shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black">F</span>
          </div>
          Financial.OS
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-2 px-4">Principal</div>
        <NavItem id="dashboard"    icon={LayoutDashboard} label="Dashboard Executivo"      {...navProps} />
        <NavItem id="timeline"     icon={CalendarDays}    label="Visão Mensal (Planilha)"  {...navProps} />
        <NavItem id="transactions" icon={ArrowRightLeft}  label="Lançamentos & Extrato"    {...navProps} />

        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-6 px-4">Análises & Crédito</div>
        <NavItem id="cards"      icon={CreditCard}    label="Cartões & Limites"       {...navProps} />
        <NavItem id="categories" icon={PieChartIcon}  label="Categorias & Orçamento"  {...navProps} />
        <NavItem id="health"     icon={HeartPulse}    label="Saúde & Bem-estar"       {...navProps} />

        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-6 px-4">Planejamento</div>
        <NavItem id="projections" icon={Calendar}   label="Projeção 12 Meses"      {...navProps} />
        <NavItem id="goals"       icon={Target}     label="Metas & Reservas"        {...navProps} />
        <NavItem id="people"      icon={Users}      label="Controle de Pessoas"     {...navProps} />

        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-6 px-4">Sistema</div>
        <NavItem id="settings" icon={Settings} label="Configurações (GitHub)" {...navProps} />
      </nav>
    </aside>
  );
}
