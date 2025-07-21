import { abrirDB } from './db.js';

let db;
let idParaEliminar = null;
const categoriasPredefinidas = ['alimentación', 'transporte', 'ocio', 'servicios', 'salud', 'educación', 'otros'];

window.onload = async () => {
  db = await abrirDB();
  await inicializarCategorias();
  cargarCategorias();

  document.getElementById('guardar-categoria').onclick = guardarCategoria;
  document.getElementById('cancelar-eliminar').onclick = cerrarModal;
};

async function inicializarCategorias() {
  const tx = db.transaction('categorias', 'readwrite');
  const store = tx.objectStore('categorias');

  categoriasPredefinidas.forEach(nombre => {
    const buscar = store.getAll();
    buscar.onsuccess = () => {
      if (!buscar.result.some(cat => cat.nombre === nombre)) {
        store.add({ nombre, predefinida: true });
      }
    };
  });
}

function guardarCategoria() {
  const input = document.getElementById('nombre-categoria');
  const nombre = input.value.trim().toLowerCase();
  if (!nombre) return;

  const tx = db.transaction('categorias', 'readwrite');
  tx.objectStore('categorias').add({ nombre, predefinida: false });

  tx.oncomplete = () => {
    input.value = '';
    cargarCategorias();
  };
}

function cargarCategorias() {
  const ul = document.getElementById('lista-categorias');
  ul.innerHTML = '';
  const tx = db.transaction('categorias', 'readonly');
  const store = tx.objectStore('categorias');

  store.openCursor().onsuccess = e => {
    const cursor = e.target.result;
    if (cursor) {
      const { id, nombre, predefinida } = cursor.value;
      const li = document.createElement('li');
      li.textContent = nombre;

      const eliminarBtn = document.createElement('button');
      eliminarBtn.textContent = 'Eliminar';
      eliminarBtn.disabled = predefinida;
      eliminarBtn.onclick = () => mostrarModal(id);

      li.appendChild(eliminarBtn);
      ul.appendChild(li);
      cursor.continue();
    }
  };
}

function mostrarModal(id) {
  idParaEliminar = id;
  document.getElementById('modal-eliminar').style.display = 'block';
  document.getElementById('confirmar-eliminar').onclick = eliminarCategoria;
}

function cerrarModal() {
  document.getElementById('modal-eliminar').style.display = 'none';
  idParaEliminar = null;
}

function eliminarCategoria() {
  const tx = db.transaction(['categorias', 'transacciones'], 'readwrite');

  // Eliminar transacciones asociadas
  tx.objectStore('transacciones').openCursor().onsuccess = e => {
    const cursor = e.target.result;
    if (cursor && cursor.value.categoriaId === idParaEliminar) {
      cursor.delete();
      cursor.continue();
    }
  };

  // Eliminar la categoría
  tx.objectStore('categorias').delete(idParaEliminar);

  tx.oncomplete = () => {
    cargarCategorias();
    cerrarModal();
  };
}
