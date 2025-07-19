import { transactionutils } from './transactionutils.js';

export class categorypage {
  constructor(container, db) {
    this.container = container;
    this.db = db;
    this.tx = new transactionutils(db);
  }

  async cargar(id) {
    const categoria = await this.db.obtener('categories', id);
    const transacciones = await this.tx.transaccionesporcategoria(id);

    this.container.innerHTML = `
      <h2>${categoria.name}</h2>
      <div id="categoria-detalle">
        <button id="edit-categoria">editar categoría</button>
        <button id="delete-categoria">eliminar categoría</button>
      </div>
      <h3>transacciones asociadas</h3>
      <ul id="lista-transacciones"></ul>
    `;

    this.rendertransacciones(transacciones);

    document.getElementById('edit-categoria').onclick = () => this.editarcategoria(id);
    document.getElementById('delete-categoria').onclick = () => this.eliminarcategoria(id);
  }

  rendertransacciones(lista) {
    const ul = document.getElementById('lista-transacciones');
    ul.innerHTML = '';

    if (lista.length === 0) {
      ul.innerHTML = `<li>no hay transacciones registradas</li>`;
      return;
    }

    lista.forEach(tx => {
      const li = document.createElement('li');
      li.textContent = `${tx.descripcion || 'sin descripción'} - $${tx.monto}`;
      ul.appendChild(li);
    });
  }

  async editarcategoria(id) {
    const categoria = await this.db.obtener('categories', id);
    this.container.innerHTML = `
      <h2>editar categoría</h2>
      <form id="form-editar">
        <input type="text" id="input-nombre" value="${categoria.name}" required />
        <button type="submit">guardar</button>
      </form>
    `;

    document.getElementById('form-editar').onsubmit = async e => {
      e.preventDefault();
      categoria.name = document.getElementById('input-nombre').value.trim();
      await this.db.actualizar('categories', categoria);
      this.cargar(id);
    };
  }

  async eliminarcategoria(id) {
    if (!confirm('¿eliminar la categoría y sus transacciones?')) return;

    await this.db.eliminar('categories', id);
    await this.tx.eliminartransaccionesrelacionadas(id);

    this.container.innerHTML = `<p>la categoría fue eliminada correctamente.</p>`;
  }
}
