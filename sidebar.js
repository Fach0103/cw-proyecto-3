export class sidebar {
  constructor(container, onselect, onnew) {
    this.container = container;
    this.onselect = onselect;
    this.onnew = onnew;
  }

  render(categorias) {
    this.container.innerHTML = '';

    const boton = document.createElement('button');
    boton.textContent = '+ nueva categoría';
    boton.onclick = () => this.onnew();
    this.container.appendChild(boton);

    const lista = document.createElement('ul');
    categorias.forEach(cat => {
      const item = document.createElement('li');
      item.textContent = cat.name;
      item.onclick = () => this.onselect(cat.id);
      lista.appendChild(item);
    });

    this.container.appendChild(lista);
  }
}
