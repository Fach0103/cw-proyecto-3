import { indexeddb } from './indexeddb.js';
import { sidebar } from './sidebar.js';
import { categorymanager } from './categorymanager.js';

async function init() {
  const db = new indexeddb();
  await db.abrir();

  const sidebarcontainer = document.getElementById('sidebar');
  const pagecontainer = document.getElementById('pagecontent');

  const manager = new categorymanager(db, pagecontainer);

  const sidebarview = new sidebar(
    sidebarcontainer,
    id => manager.mostrarcategoria(id),
    () => manager.mostrarformulario()
  );

  let categorias = await db.obtenertodos('categories');
  if (categorias.length === 0) {
    const predefinidas = [
      'alimentación', 'transporte', 'ocio',
      'servicios', 'salud', 'educación', 'otros'
    ];
    for (const nombre of predefinidas) {
      await db.agregar('categories', { id: crypto.randomUUID(), name: nombre });
    }
    categorias = await db.obtenertodos('categories');
  }

  sidebarview.render(categorias);
  manager.renderlista(categorias);
}

init();
