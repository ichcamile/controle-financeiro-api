import { CreditCard, Plane, Smartphone } from 'lucide-react';
import { Card } from '../types';

export const CARDS_DB: Card[] = [
  { id: 'nubank',   name: 'Nubank',        bank: 'Nubank', limit: 3500, color: '#9333ea', icon: Smartphone, closingDay: 20, dueDay: 27 },
  { id: 'latam',    name: 'Itaú Latam',    bank: 'Itaú',   limit: 4591, color: '#db2777', icon: Plane,       closingDay: 20, dueDay: 27 },
  { id: 'platinum', name: 'Itaú Platinum', bank: 'Itaú',   limit: 2990, color: '#f97316', icon: CreditCard,  closingDay: 20, dueDay: 27 },
  { id: 'multiplo', name: 'Itaú Múltiplo', bank: 'Itaú',   limit: 268,  color: '#fb923c', icon: CreditCard,  closingDay: 20, dueDay: 27 },
];
