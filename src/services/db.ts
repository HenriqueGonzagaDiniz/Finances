const DB_NAME = 'finances-db';
const DB_VERSION = 1;
const TRANSACTIONS_STORE = 'transactions';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
        const store = db.createObjectStore(TRANSACTIONS_STORE, { keyPath: 'id' });
        store.createIndex('date', 'date');
        store.createIndex('month', 'month');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runRequest<T>(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = fn(store);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const db = {
  async getAll<T extends { id: string }>(storeName = TRANSACTIONS_STORE): Promise<T[]> {
    const database = await openDB();
    try {
      return await runRequest<T[]>(database, storeName, 'readonly', (store) => store.getAll());
    } finally {
      database.close();
    }
  },

  async put<T extends { id: string }>(record: T, storeName = TRANSACTIONS_STORE): Promise<void> {
    const database = await openDB();
    try {
      await runRequest(database, storeName, 'readwrite', (store) => store.put(record));
    } finally {
      database.close();
    }
  },

  async delete(id: string, storeName = TRANSACTIONS_STORE): Promise<void> {
    const database = await openDB();
    try {
      await runRequest(database, storeName, 'readwrite', (store) => store.delete(id));
    } finally {
      database.close();
    }
  },

  async clear(storeName = TRANSACTIONS_STORE): Promise<void> {
    const database = await openDB();
    try {
      await runRequest(database, storeName, 'readwrite', (store) => store.clear());
    } finally {
      database.close();
    }
  },
};
