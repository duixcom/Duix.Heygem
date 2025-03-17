import { ipcMain } from 'electron'
import { insert, update, remove, selectAll, selectByID } from '../dao/coze_workflow'
import {
  insert as insertWorkFlowResultDao,
  update as updateWorkFlowResultDao,
  queryByExecuteId,
  selectWorkFlowResultById
} from '../dao/work_flow_result'

const MODEL_NAME = 'coze_workflow'

const addCozeWorkflow = ({ name, desc, workflow_id, app_id, coze_token, status }) => {
  return insert({ name, desc, workflow_id, app_id, coze_token, status })
}

const updateCozeWorkflow = ({ id, name, desc, workflow_id, app_id, coze_token, status }) => {
  return update({ id, name, desc, workflow_id, app_id, coze_token, status })
}

const removeCozeWorkflow = (id) => {
  try {
    remove(id)
    return { success: true, message: '删除成功' }
  } catch (e) {
    return { success: false, message: '删除失败' }
  }
}

const queryAllCozeWorkflow = () => {
  const data = selectAll()
  console.log('queryAllCozeWorkflow', data)
  return data
}

const updateCozeWorkflowStatus = (id, status, excuted_id) => {
  const data = selectByID(id)
  return update({ ...data, status: `${status}`, excuted_id })
}

const updateCozeWorkflowExecuteId = ({ id, execute_id }) => {
  const data = selectByID(id)
  return update({ ...data, execute_id })
}

const queryWorkFlowResultById = (id) => {
  return selectWorkFlowResultById(id)
}

const queryWorkFlowResultByExecuteId = (execute_id) => {
  return queryByExecuteId(execute_id)
}

const insertWorkFlowResult = ({ workflow_id, text, execute_id }) => {
  const isExist = queryWorkFlowResultByExecuteId(execute_id)
  if (isExist.length > 0) {
    return null
  }
  return insertWorkFlowResultDao({ workflow_id, text, execute_id })
}

const updateWorkFlowExecuteId = ({ workflow_id, execute_id }) => {
  const data = selectByWorkflowId(workflow_id)
  return update({ ...data, execute_id })
}

const updateWorkFlowResultExecuteId = ({ id, execute_id }) => {
  const data = selectWorkFlowResultById(id)
  return updateWorkFlowResultDao({ ...data, execute_id })
}

export function init() {
  ipcMain.handle(MODEL_NAME + '/addCozeWorkflow', (event, ...args) => {
    return addCozeWorkflow(...args)
  })
  ipcMain.handle(MODEL_NAME + '/updateCozeWorkflow', (event, ...args) => {
    return updateCozeWorkflow(...args)
  })
  ipcMain.handle(MODEL_NAME + '/removeCozeWorkflow', (event, ...args) => {
    return removeCozeWorkflow(...args)
  })
  ipcMain.handle(MODEL_NAME + '/queryAllCozeWorkflow', (event, ...args) => {
    return queryAllCozeWorkflow(...args)
  })
  ipcMain.handle(MODEL_NAME + '/updateCozeWorkflowStatus', (event, ...args) => {
    return updateCozeWorkflowStatus(...args)
  })
  ipcMain.handle(MODEL_NAME + '/updateCozeWorkflowExecuteId', (event, ...args) => {
    return updateCozeWorkflowExecuteId(...args)
  })
  ipcMain.handle(MODEL_NAME + '/queryWorkFlowResultById', (event, ...args) => {
    return queryWorkFlowResultById(...args)
  })
  ipcMain.handle(MODEL_NAME + '/insertWorkFlowResult', (event, ...args) => {
    return insertWorkFlowResult(...args)
  })
  ipcMain.handle(MODEL_NAME + '/updateWorkFlowExecuteId', (event, ...args) => {
    return updateWorkFlowExecuteId(...args)
  })
  ipcMain.handle(MODEL_NAME + '/updateWorkFlowResultExecuteId', (event, ...args) => {
    return updateWorkFlowResultExecuteId(...args)
  })
}
