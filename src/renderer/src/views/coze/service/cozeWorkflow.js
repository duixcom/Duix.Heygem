import { updateCozeWorkflowExecuteId } from '@renderer/api'
import { runWorkflow, queryWorkflowStatus } from './runWorkflow'

export const queryCozeWorkflow = async (executeId, coze_token, workflow_id) => {
  const queryUrl = `https://api.coze.cn/v1/workflows/${workflow_id}/run_histories/${executeId}`
  const queryOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${coze_token}`
    }
  }
  return queryWorkflowStatus(queryUrl, queryOptions, {
    successStatus: 'Success',
    failedStatus: 'Failed',
    runningStatus: 'Running',
    statusField: 'execute_status',
    responseDataPath: ['data']
  })
}

export const runCozeWorkflow = async (
  workflow_id,
  app_id,
  coze_token,
  parameters = { input: 'start' }
) => {
  const url = `https://api.coze.cn/v1/workflow/run`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${coze_token}`
    },
    body: JSON.stringify({
      workflow_id,
      app_id,
      is_async: true,
      parameters
    })
  }

  return runWorkflow(url, options, (executeId) => {
    updateCozeWorkflowExecuteId({ workflow_id, execute_id: executeId })
    return queryCozeWorkflow(executeId, coze_token, workflow_id)
  })
}
