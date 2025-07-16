import { sistema } from './sistema.js';

export function deleteRelatedTransactions(categoryId) {
  sistema.getAll('transactions').then(transactions => {
    const relacionados = transactions.filter(tx => tx.categoryId === categoryId);
    relacionados.forEach(tx => sistema.delete('transactions', tx.id));
  });
}
