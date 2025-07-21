export function abrirDB() {
  return new Promise((resolve, reject) => {
    const solicitud = indexedDB.open('finanzas', 1);

    solicitud.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('categorias')) {
        db.createObjectStore('categorias', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('transacciones')) {
        db.createObjectStore('transacciones', { keyPath: 'id', autoIncrement: true });
      }
    };

    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject(solicitud.error);
  });
}
