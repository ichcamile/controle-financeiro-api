import { CICLO_START_DAY } from '../constants/categories';

/**
 * Dado uma data string (YYYY-MM-DD), retorna o ciclo financeiro correspondente
 * no formato "YYYY-MM". O ciclo vira no dia CICLO_START_DAY.
 */
export const getFinancialCycle = (dateString: string): string => {
  const d = new Date(dateString + 'T00:00:00');
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  if (d.getDate() >= CICLO_START_DAY) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return `${year}-${String(month).padStart(2, '0')}`;
};

/**
 * Converte "2026-10" → "Out/26"
 */
export const getCycleLabel = (cycleStr: string): string => {
  if (!cycleStr) return '';
  const [y, m] = cycleStr.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[parseInt(m) - 1]}/${y.substring(2)}`;
};
