export class uihelpers {
  constructor(manager) {
    this.manager = manager;
  }

  renderizar(lista) {
    const contenedor = document.getElementById('category-list');
    contenedor.innerHTML = '';

    const plantilla = document.getElementById('template-categoria');

    lista.forEach(cat => {
      const nodo = plantilla.content.cloneNode(true);
      nodo.querySelector('.nombre').textContent = cat.name;
      nodo.querySelector('.editar').onclick = () => this.manager.mostrarformulario(cat.id);
      nodo.querySelector('.eliminar').onclick = () => this.manager.eliminar(cat.id);
      contenedor.appendChild(nodo);
    });
  }
}
