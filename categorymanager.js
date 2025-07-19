import { uihelpers } from './uihelpers.js';
import { transactionutils } from './transactionutils.js';

export class categorymanager {
  constructor(db, container) {
    this.db = db;
    this.container = container;
    this.ui = new uihelpers(this);
    this.tx = new transactionutils(this.db);
  }

  async renderlista(categorias) {
    const lista = document.getElementById('category-list');
    if (lista) {
      this.ui.renderizar(categorias);
    }
  }

  async mostrarcategoria(id) {
    const categoria = await this.db.obtener('categories', id);
    this.container.innerHTML = `
      <h2>${categoria.name}</h2>
      <button id="editBtn">editar</button>
      <button id="deleteBtn">eliminar</button>
      <p>contenido futuro para esta categoría...</p>
    `;

    document.getElementById('editBtn').onclick = () => this.mostrarformulario(id);
    document.getElementById('deleteBtn').onclick = () => this.eliminar(id);
  }

  mostrarformulario(id = null) {
    this.container.innerHTML = `
      <h2>${id ? 'editar' : 'nueva'} categoría</h2>
      <form id="categoryForm">
        <input type="text" id="categoryInput" placeholder="nombre" required />
        <button type="submit">guardar</button>
      </form>
    `;

    if (id) {
      this.db.obtener('categories', id).then(cat => {
        document.getElementById('categoryInput').value = cat.name;
        document.getElementById('categoryForm').onsubmit = e => {
          e.preventDefault();
          cat.name = document.getElementById('categoryInput').value.trim();
          this.db.actualizar('categories', cat).then(() => this.mostrarcategoria(id));
        };
      });
    } else {
      document.getElementById('categoryForm').onsubmit = e => {
        e.preventDefault();
        this.guardar();
      };
    }
  }

  async guardar() {
    const input = document.getElementById('categoryInput');
    const nombre = input.value.trim();
    if (!nombre) return;

    const categoria = { id: crypto.randomUUID(), name: nombre };
    await this.db.agregar('categories', categoria);
    input.value = '';
    const categorias = await this.db.obtenertodos('categories');
    this.renderlista(categorias);
  }

  async eliminar(id) {
    if (!confirm('¿eliminar esta categoría y sus transacciones?')) return;
    await this.db.eliminar('categories', id);
    await this.tx.eliminartransaccionesrelacionadas(id);
    const categorias = await this.db.obtenertodos('categories');
    this.renderlista(categorias);
  }
}
