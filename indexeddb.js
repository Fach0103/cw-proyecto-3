
export class indexeddb {
  constructor(dbname = 'finanzasdb', version = 1) {
    this.dbname = dbname;
    this.version = version;
    this.db = null;
    this.stores = ['categories', 'transactions', 'budgets'];
  }

  async abrir() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbname, this.version);

      request.onupgradeneeded = event => {
        this.db = event.target.result;
        this.stores.forEach(store => {
          if (!this.db.objectStoreNames.contains(store)) {
            this.db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = event => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = () => reject('error al abrir base de datos');
    });
  }

  obtenerstore(nombre, modo = 'readonly') {
    const tx = this.db.transaction(nombre, modo);
    return tx.objectStore(nombre);
  }

  agregar(nombre, dato) {
    return this.obtenerstore(nombre, 'readwrite').add(dato);
  }

  actualizar(nombre, dato) {
    return this.obtenerstore(nombre, 'readwrite').put(dato);
  }

  eliminar(nombre, id) {
    return this.obtenerstore(nombre, 'readwrite').delete(id);
  }

  obtener(nombre, id) {
    return new Promise((res, rej) => {
      const req = this.obtenerstore(nombre).get(id);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(null);
    });
  }

  obtenertodos(nombre) {
    return new Promise((res, rej) => {
      const req = this.obtenerstore(nombre).getAll();
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej([]);
    });
  }
}
