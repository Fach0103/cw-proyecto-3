import { deleteCategory } from './categoryManager.js';

export function renderCategoryList(categories) {
  const list = document.getElementById('categoryList');
  list.innerHTML = '';

  categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.onclick = () => deleteCategory(cat.id);

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}
