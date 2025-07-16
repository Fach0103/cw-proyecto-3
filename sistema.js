export const sistema = (function () {
  const dbName = 'FinanzasDB';
  const version = 1;
  let db;

  const stores = ['categories', 'transactions', 'budgets'];

  function open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = function (event) {
        db = event.target.result;
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = function (event) {
        db = event.target.result;
        resolve();
      };

      request.onerror = function () {
        reject('Error al abrir la base de datos');
      };
    });
  }

  function store(name, mode = 'readonly') {
    const tx = db.transaction(name, mode);
    return tx.objectStore(name);
  }

  async function add(name, data) {
    return store(name, 'readwrite').add(data);
  }

  async function update(name, data) {
    return store(name, 'readwrite').put(data);
  }

  async function deleteItem(name, id) {
    return store(name, 'readwrite').delete(id);
  }

  async function get(name, id) {
    return new Promise((resolve, reject) => {
      const req = store(name).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(null);
    });
  }

  async function getAll(name) {
    return new Promise((resolve, reject) => {
      const req = store(name).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject([]);
    });
  }

  return {
    open,
    add,
    update,
    delete: deleteItem,
    get,
    getAll
  };
})();
