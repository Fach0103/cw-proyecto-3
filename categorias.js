import { sistema } from './sistema.js';
import { renderCategoryList } from './uiHelpers.js';
import { deleteRelatedTransactions } from './transactionUtils.js';

export function initCategoryManager() {
  sistema.open().then(() => {
    loadCategories();
    document.getElementById('categoryForm').onsubmit = event => {
      event.preventDefault();
      saveCategory();
    };
  });
}

function loadCategories() {
  sistema.getAll('categories').then(renderCategoryList);
}

function saveCategory() {
  const input = document.getElementById('categoryInput');
  const name = input.value.trim();
  if (!name) return;

  const category = { id: crypto.randomUUID(), name };
  sistema.add('categories', category).then(() => {
    input.value = '';
    loadCategories();
  });
}

export function deleteCategory(id) {
  if (confirm('¿Eliminar esta categoría y todas sus transacciones asociadas?')) {
    sistema.delete('categories', id).then(() => {
      deleteRelatedTransactions(id);
      loadCategories();
    });
  }
}
