import sqlite3 from 'sqlite3';

sqlite3.verbose();

export class KevaDB {
    private static instance: KevaDB;
    private db: sqlite3.Database;

    private constructor(dbFilePath: string) {
        this.db = new sqlite3.Database(dbFilePath, (err: Error | null) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
    }

    public static getInstance(dbFilePath: string): KevaDB {
        if (!KevaDB.instance) {
            KevaDB.instance = new KevaDB(dbFilePath);
        }
        return KevaDB.instance;
    }

    set(key: string, value: object): Promise<void> {
        return new Promise((resolve, reject) => {
            const jsonString = JSON.stringify(value);
            const query = `INSERT INTO kv (key, value) VALUES (?, ?)`;

            this.db.run(query, [key, jsonString], function (err: Error | null) {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    update(key: string, path: string, value: any): Promise<void> {
        const query = `
        UPDATE kv 
        SET value = json_set(value, ?, ${typeof value === 'object' ? 'json(?)' : '?'})
        WHERE key = ?`;

        return new Promise<void>((resolve, reject) => {
            const uv = typeof value === 'object' ? JSON.stringify(value) : value;
            this.db.run(query, [`$.${path}`, uv, key], function (err: Error | null) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    select(key: string, path: string): Promise<any> {
        const query = path === ''
            ? `SELECT value FROM kv WHERE key = ?`
            : `SELECT json_extract(value, ?) AS value FROM kv WHERE key = ?`;

        return new Promise<any>((resolve, reject) => {
            const params = path === '' ? [key] : [`$.${path}`, key];
            this.db.get(query, params, (err: Error | null, row: { value: any }) => {
                if (err) reject(err);
                else resolve(row?.value);
            });
        });
    }

    incr(key: string, path: string, value: number): Promise<void> {
        const query = `
        UPDATE kv 
        SET value = json_set(value, ?, json_extract(value, ?) + ?)
        WHERE key = ?`;

        return new Promise<void>((resolve, reject) => {
            this.db.run(query, [`$.${path}`, `$.${path}`, value, key], function (err: Error | null) {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    delete(keys: string[]): Promise<void> {
        const placeholders = keys.map(() => '?').join(',');
        const query = `DELETE FROM kv WHERE key IN (${placeholders})`;

        return new Promise<void>((resolve, reject) => {
            this.db.run(query, keys, function (err: Error | null) {
                if (err) reject(err)
                else resolve();
            });
        });
    }


    close(): void {
        this.db.close((err: Error | null) => {
            if (err) {
                console.error('Error closing the database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    }
}
