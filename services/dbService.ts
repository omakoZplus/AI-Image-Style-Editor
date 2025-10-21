import type { GalleryImage } from '../types';

const DB_NAME = 'ImageEditorDB';
const DB_VERSION = 1;
const STORE_NAME = 'gallery';

let dbPromise: Promise<IDBDatabase> | null = null;

const getDb = (): Promise<IDBDatabase> => {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error("IndexedDB is not supported by this browser."));
                return;
            }
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }
    return dbPromise;
};

export const addImageToDb = async (image: GalleryImage): Promise<void> => {
    const db = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(image); // put will add or update

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const getAllImagesFromDb = async (): Promise<GalleryImage[]> => {
    const db = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            // Sort by ID (timestamp) descending to get newest first
            resolve(request.result.sort((a, b) => b.id - a.id));
        };
        request.onerror = () => reject(request.error);
    });
};

export const deleteImageFromDb = async (id: number): Promise<void> => {
    const db = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};
