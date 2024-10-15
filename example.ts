import {KevaDB} from "./kv";
import example from "./example.json";

const kvdb = KevaDB.getInstance('kv.db')

async function main() {
    await kvdb.set(example[0].key, example[0].value)
        .then(() => console.log('Insert successful'))
        .catch((err) => console.error('Insert failed:', err))

    await kvdb.set(example[1].key, example[1].value)
        .then(() => console.log('Insert successful'))
        .catch((err) => console.log('Insert failed:', err))

    await kvdb.incr(example[0].key, "collectibles.gun", 4)
        .then(() => console.log('Increased collectibles.gun +4'))
        .catch((err) => console.log('Increase error:', err))

    await kvdb.select(example[0].key, "collectibles.gun")
        .then((value) => console.log('Value of gun:', value))
        .catch((err) => console.log('Select error:', err))

    await kvdb.update(example[0].key, "collectibles", {"gun": 10, "powder": 113, "tier": "Gold", "is_claim": false})
        .then(() => console.log('Update type json successful'))
        .catch((err) => console.error('Update type json failed:', err))

    await kvdb.update(example[0].key, "collectibles.gun", 73)
        .then(() => console.log('Update type number successful'))
        .catch((err) => console.error('Update type number failed:', err))

    await kvdb.update(example[0].key, "collectibles.tier", "Diamond")
        .then(() => console.log('Update type string successful'))
        .catch((err) => console.error('Update type string failed:', err))

    await kvdb.update(example[0].key, "collectibles.is_claim", true)
        .then(() => console.log('Update type boolean successful'))
        .catch((err) => console.error('Update type boolean failed:', err))

    await kvdb.select(example[0].key, "collectibles")
        .then((value) => console.log('Value of collectibles:', value))
        .catch((err) => console.log('Select error:', err))

    await kvdb.delete([example[0].key, example[1].key])
        .then(() => console.log('Deleted all'))
        .catch((err) => console.log('Delete error:', err))
}

main().then(() => {
    kvdb.close()
})