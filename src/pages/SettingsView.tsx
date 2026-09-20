import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { GithubConfig } from '../types';

interface SettingsViewProps {
  config: GithubConfig;
  setConfig: React.Dispatch<React.SetStateAction<GithubConfig>>;
}

export function SettingsView({ config, setConfig }: SettingsViewProps) {
  const [localConfig, setLocalConfig] = useState<GithubConfig>(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('fin_github_token',  localConfig.token);
    localStorage.setItem('fin_github_owner',  localConfig.owner);
    localStorage.setItem('fin_github_repo',   localConfig.repo);
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
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">
              Personal Access Token (GitHub PAT)
            </label>
            <input
              type="password"
              value={localConfig.token}
              onChange={e => setLocalConfig({ ...localConfig, token: e.target.value })}
              placeholder="ghp_..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">Precisa ter permissão de escrita (repo).</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">
              Nome de Usuário (Owner)
            </label>
            <input
              type="text"
              value={localConfig.owner}
              onChange={e => setLocalConfig({ ...localConfig, owner: e.target.value })}
              placeholder="Ex: ichcamile"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">
              Nome do Repositório
            </label>
            <input
              type="text"
              value={localConfig.repo}
              onChange={e => setLocalConfig({ ...localConfig, repo: e.target.value })}
              placeholder="Ex: controle-financeiro"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1.5 block">
              Branch (Banco de Dados)
            </label>
            <input
              type="text"
              value={localConfig.branch}
              onChange={e => setLocalConfig({ ...localConfig, branch: e.target.value })}
              placeholder="db/transactions"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between">
          <p className="text-xs text-slate-500 max-w-sm">
            Esses dados ficarão salvos <b>localmente</b> no seu navegador (localStorage) por segurança.
          </p>
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
