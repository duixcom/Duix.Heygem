import { connect } from '../db/index.js'

export function insert({ group_name, key, value, label }) {
    const db = connect()
    const stmt = db.prepare(
        'INSERT INTO setting (group_name, key, value, label, created_at) VALUES (?, ?, ?, ?, ?)'
    )
    const info = stmt.run(group_name, key, value, label, Date.now())
    return info.lastInsertRowid
}

export function update({ group_name, key, value, label }) {
    const db = connect()
    const info = db.prepare(
        'UPDATE setting SET value = ?, label = ? WHERE group_name = ? AND key = ?'
    ).run(value, label, group_name, key)
    return info
}

export function remove(group_name, key) {
    const db = connect()
    return db.prepare('DELETE FROM setting WHERE group_name = ? AND key = ?').run(group_name, key)
}

export function findByGroupAndKey(group_name, key) {
    const db = connect()
    return db.prepare('SELECT * FROM setting WHERE group_name = ? AND key = ?').get(group_name, key)
}

export function findByGroup(group_name) {
    const db = connect()
    return db.prepare('SELECT * FROM setting WHERE group_name = ?').all(group_name)
}

export function selectAll() {
    const db = connect()
    return db.prepare('SELECT * FROM setting').all()
}

export function updateById({ id, value, label }) {
    const db = connect()
    const info = db.prepare(
        'UPDATE setting SET value = ?, label = ? WHERE id = ?'
    ).run(value, label, id)
    return info
}

export function findById(id) {
    const db = connect()
    return db.prepare('SELECT * FROM setting WHERE id = ?').get(id)
}