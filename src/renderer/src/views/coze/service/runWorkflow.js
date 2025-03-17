export const runWorkflow = async (url, options, queryFn, executeIdPath = ['execute_id']) => {
  const res = await fetch(url, options)
  const data = await res.json()
  console.log(data)

  // Extract execute_id from response using the provided path
  let executeId = data
  for (const pathSegment of executeIdPath) {
    executeId = executeId?.[pathSegment]
    if (!executeId) break
  }
  if (!executeId) {
    throw new Error('Failed to get execute_id from response')
  }

  const debugUrl = data?.debug_url
  if (debugUrl) {
    console.log('workflow is running, debug url is', debugUrl)
  } else {
    console.log('workflow is running with execute_id:', executeId)
  }

  const result = await queryFn(executeId)
  return result
}

/*
 *statusConfig：{
 *      successStatus: string;
 *      failedStatus: string;
 *      runningStatus: string;
 *      statusField: string;
 *      responseDataPath: string[];
 *      clearHistoryFn?: () => void;
 *      checkInterval?: number;
 *    }
 */
export const queryWorkflowStatus = async (queryUrl, options, statusConfig) => {
  const {
    successStatus,
    failedStatus,
    runningStatus,
    statusField,
    responseDataPath,
    clearHistoryFn,
    checkInterval = 1000 * 60 * 1 // Default 1 minutes
  } = statusConfig

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const queryRes = await fetch(queryUrl, options)
        const queryData = await queryRes.json()
        console.log(queryData)

        // Navigate to the data using the provided path
        let workflowData = queryData
        for (const pathSegment of responseDataPath) {
          workflowData = workflowData?.[pathSegment]
          if (Array.isArray(workflowData) && workflowData.length > 0) {
            workflowData = workflowData[0]
          }
          if (!workflowData) break
        }

        const status = workflowData?.[statusField]

        if (status === successStatus) {
          console.log('workflow is success')
          //   if (clearHistoryFn) clearHistoryFn()
          resolve(workflowData)
        } else if (status === failedStatus) {
          console.log('workflow is failed')
          resolve(null)
        } else if (status === runningStatus) {
          console.log('workflow is running')
          // Schedule next check after specified interval
          setTimeout(checkStatus, checkInterval)
        } else {
          // Unknown status
          // console.log('Unknown workflow status:', status);
          // resolve(null);
          setTimeout(checkStatus, checkInterval)
        }
      } catch (error) {
        console.error('Error checking workflow status:', error)
        reject(error)
      }
    }

    // Start checking
    checkStatus()
  })
}
