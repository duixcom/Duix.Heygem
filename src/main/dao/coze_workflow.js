import { connect } from '../db'

export function selectAll() {
  const db = connect()
  return db.prepare('select * from coze_workflow').all()
}

export function selectByID(id) {
  const db = connect()
  return db.prepare('select * from coze_workflow where id = ?').get(id)
}

export function selectByWorkflowId(workflow_id) {
  const db = connect()
  return db.prepare('select * from coze_workflow where workflow_id = ?').all(workflow_id)
}

export function insert({ name, desc, workflow_id, app_id, coze_token, status }) {
  const db = connect()
  const isExist = db.prepare('select * from coze_workflow where name = ?').get(name)
  if (isExist) {
    return { success: false, message: 'name already exists' }
  }
  const info = db
    .prepare(
      'insert into coze_workflow(name, desc, workflow_id, app_id, coze_token, status) values(?, ?, ?, ?, ?, ?)'
    )
    .run(name, desc, workflow_id, app_id, coze_token, status)
  return { success: true, message: 'insert success', data: info }
}
export function update({ id, name, desc, workflow_id, app_id, coze_token, status, execute_id }) {
  const db = connect()
  const info = db
    .prepare(
      'update coze_workflow set name = ?, desc = ?, workflow_id = ?, app_id = ?, coze_token = ?, status = ?,execute_id = ? where id = ?'
    )
    .run(name, desc, workflow_id, app_id, coze_token, status, execute_id, id)
  return { success: true, message: 'update success' }
}

export function remove(id) {
  const db = connect()
  const info = db.prepare('delete from coze_workflow where id = ?').run(id)
  return info
}
