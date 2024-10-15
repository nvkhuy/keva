# Keva: Key-Value Datastore

**Keva** is a simple key-value datastore built using SQLite, supporting JSON data manipulation with helper functions for
inserting, updating, selecting, incrementing, and deleting key-value pairs.

## Setup

### 1. Initialize the Database

Run the following command to initialize the database schema:

```bash
sqlite3 kv.db < migrations/00001_create_kv_table.sql
```

### 2. Usage Example

The following is an example of how to interact with the Keva key-value datastore using TypeScript:

```typescript
import {KevaDB} from "./kv";
import example from "example.json";  // Assuming this is your data source

const kvdb = KevaDB.getInstance('kv.db');  // Create or get the singleton instance of KevaDB

// Insert a new key-value pair
await kvdb.set(example[0].key, example[0].value)
    .then(() => console.log('Insert successful'))
    .catch((err) => console.error('Insert failed:', err));

// Increment a numeric value in JSON (e.g., collectibles.gun +4)
await kvdb.incr(example[0].key, "collectibles.gun", 4)
    .then(() => console.log('Increased collectibles.gun by 4'))
    .catch((err) => console.error('Increase failed:', err));

// Select a specific value in the JSON object (e.g., collectibles.gun)
await kvdb.select(example[0].key, "collectibles.gun")
    .then((value) => console.log('Value of gun:', value))
    .catch((err) => console.error('Select failed:', err));

// Update the JSON object for the key
await kvdb.update(example[0].key, "collectibles", {"gun": 10, "powder": 113, "tier": "Gold", "is_claim": false})
    .then(() => console.log('Updated collectibles'))
    .catch((err) => console.error('Update failed:', err));

// Update a specific field (number, string, boolean) in JSON
await kvdb.update(example[0].key, "collectibles.gun", 73)
    .then(() => console.log('Updated collectibles.gun to 73'))
    .catch((err) => console.error('Update failed:', err));

await kvdb.update(example[0].key, "collectibles.tier", "Diamond")
    .then(() => console.log('Updated collectibles.tier to Diamond'))
    .catch((err) => console.error('Update failed:', err));

await kvdb.update(example[0].key, "collectibles.is_claim", true)
    .then(() => console.log('Updated collectibles.is_claim to true'))
    .catch((err) => console.error('Update failed:', err));

// Retrieve the entire collectibles object
await kvdb.select(example[0].key, "collectibles")
    .then((value) => console.log('Value of collectibles:', value))
    .catch((err) => console.error('Select failed:', err));

// Delete multiple keys
await kvdb.deleteByKeys([example[0].key, example[1].key])
    .then(() => console.log('Deleted all keys'))
    .catch((err) => console.error('Delete failed:', err));

// Close the database connection
kvdb.close();
```

## Available Methods

### 1. `set(key: string, value: any): Promise<void>`

Inserts or updates a key with the provided value.

### 2. `incr(key: string, path: string, amount: number): Promise<void>`

Increments a numeric field in a JSON object at the specified path.

### 3. `select(key: string, path: string): Promise<any>`

Retrieves a value from the JSON object at the specified path.

### 4. `update(key: string, path: string, value: any): Promise<void>`

Updates a specific field or path in a JSON object with a new value (supports numbers, strings, booleans, and JSON
objects).

### 5. `deleteByKeys(keys: string[]): Promise<void>`

Deletes multiple keys from the database.

### 6. `close(): Promise<void>`

Closes the SQLite database connection.

## Example JSON Data Structure

```json
{
  "key": "w:00001",
  "value": {
    "collectibles": {
      "gun": 10,
      "powder": 113,
      "tier": "Gold",
      "is_claim": false
    }
  }
}
```

## How to Run

1. Make sure to initialize the SQLite database as shown in the [Setup](#setup) section.
2. Import your JSON data file (e.g., `example.json`) into the project.
3. Run your TypeScript file using:

```bash
npx ts-node example.ts
```

---