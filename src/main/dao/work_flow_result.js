import { connect } from '../db'
export function selectWorkFlowResultById(workflow_id) {
  const db = connect()
  const sql = `select * from coze_workflow_result where workflow_id = ?`
  const data = db.prepare(sql).all(workflow_id)
  return data
}

export function insert({ workflow_id, text, execute_id }) {
  const db = connect()
  const info = db
    .prepare('insert into coze_workflow_result(workflow_id, text, execute_id) values(?, ?, ?)')
    .run(workflow_id, text, execute_id)
  return info
}

export function update({ workflow_id, text, execute_id }) {
  const db = connect()
  const info = db
    .prepare('update coze_workflow_result set text = ?,execute_id = ? where workflow_id = ?')
    .run(text, execute_id, workflow_id)
  return info
}

export const queryByExecuteId = (execute_id) => {
  const db = connect()
  const sql = `select * from coze_workflow_result where execute_id = ?`
  const data = db.prepare(sql).all(execute_id)
  return data
}
