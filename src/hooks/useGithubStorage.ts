import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { GithubConfig } from '../types';
import { INITIAL_TRANSACTIONS } from '../constants/categories';

interface UseGithubStorageReturn {
  transactions: Transaction[];
  githubConfig: GithubConfig;
  setGithubConfig: React.Dispatch<React.SetStateAction<GithubConfig>>;
  isLoading: boolean;
  commitToGithub: (newTransactions: Transaction[], message: string) => Promise<void>;
}

export function useGithubStorage(): UseGithubStorageReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fileSha, setFileSha] = useState<string | null>(null);

  const [githubConfig, setGithubConfig] = useState<GithubConfig>(() => ({
    token:  localStorage.getItem('fin_github_token')  || '',
    owner:  localStorage.getItem('fin_github_owner')  || '',
    repo:   localStorage.getItem('fin_github_repo')   || '',
    branch: localStorage.getItem('fin_github_branch') || 'db/transactions',
  }));

  // Carrega os dados do GitHub ao iniciar (ou quando a config muda)
  useEffect(() => {
    async function fetchFromGithub() {
      if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
        setTransactions(INITIAL_TRANSACTIONS);
        setIsLoading(false);
        return;
      }

      try {
        const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/data/transactions.json?ref=${githubConfig.branch}`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${githubConfig.token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFileSha(data.sha);
          const decodedContent = decodeURIComponent(escape(atob(data.content)));
          const parsed: Transaction[] = JSON.parse(decodedContent);
          setTransactions(parsed);
        } else if (res.status === 404) {
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

  const commitToGithub = async (newTransactions: Transaction[], message: string): Promise<void> => {
    if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
      setTransactions(newTransactions);
      return;
    }

    setIsLoading(true);
    try {
      const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/data/transactions.json`;
      const contentStr = JSON.stringify(newTransactions, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(contentStr)));

      const body = {
        message,
        content: encodedContent,
        branch: githubConfig.branch,
        ...(fileSha && { sha: fileSha }),
      };

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubConfig.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setFileSha(data.content.sha);
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

  return { transactions, githubConfig, setGithubConfig, isLoading, commitToGithub };
}
