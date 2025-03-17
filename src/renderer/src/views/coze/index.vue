<template>
  <t-space direction="vertical" class="coze-content-box">
    <div>
      <div>{{ $t('coze.pageTitle') }}</div>
    </div>
    <t-space direction="horizontal">
      <t-button @click="action.addWorkflow">{{ $t('coze.workflow.addModal.title') }}</t-button>
      <t-button @click="refreshData">
        <template #icon>
          <RefreshIcon />
        </template>
      </t-button>
    </t-space>
    <t-table
      row-key="id"
      v-model:data="data"
      :columns="columns"
      :loading="loading"
      table-layout="auto"
    />
    <t-dialog
      :header="$t('coze.workflow.addModal.title')"
      v-model:visible="visible"
      attach="body"
      @close="action.closeAddWorkflow"
      @confirm="action.submit"
    >
      <AddModal ref="addModalRef" />
    </t-dialog>
    <Result ref="resultRef" :workflowId="workflowId" />
  </t-space>
</template>
<script setup lang="jsx">
import { useI18n } from 'vue-i18n'
import { useTemplateRef, ref, onMounted } from 'vue'
import AddModal from './components/addModal/index.vue'
import {
  addCozeWorkflow,
  queryAllCozeWorkflow,
  updateCozeWorkflowStatus,
  insertWorkFlowResult,
  removeCozeWorkflow
} from '@renderer/api'
import { RefreshIcon } from 'tdesign-icons-vue-next'
import { runCozeWorkflow, queryCozeWorkflow } from '@renderer/views/coze/service'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import Result from './components/result/index.vue'

const STATUS_MAP = {
  success: 0,
  running: 1,
  failed: 2
}
const statusNameListMap = {
  0: { label: '运行成功', theme: 'primary' },
  1: { label: '运行中', theme: 'success' },
  2: { label: '运行失败', theme: 'danger' }
}

const { t, locale } = useI18n()
const resultRef = useTemplateRef('resultRef')
const workflowId = ref('')

const data = ref([])
const loading = ref(false)
const columns = ref([
  {
    colKey: 'name',
    title: t('coze.workflow.columns.name')
  },
  {
    colKey: 'app_id',
    title: t('coze.workflow.columns.appId')
  },
  {
    colKey: 'workflow_id',
    title: t('coze.workflow.columns.workflowId')
  },
  {
    colKey: 'coze_token',
    title: t('coze.workflow.columns.cozeToken'),
    cell: (h, { row }) => {
      return '*************'
    }
  },

  {
    colKey: 'desc',
    title: t('coze.workflow.columns.description')
  },
  {
    colKey: 'status',
    title: t('coze.workflow.columns.status'),
    cell: (h, { row }) => {
      return row.status ? (
        <t-tag theme={statusNameListMap[row.status]?.theme}>
          {statusNameListMap[row.status]?.label}
        </t-tag>
      ) : null
    }
  },
  {
    colKey: 'action',
    title: t('coze.workflow.columns.action'),
    cell: (h, { row }) => {
      const { status } = row
      const disabled = status == STATUS_MAP.running
      return (
        <t-space>
          <t-button
            variant="dashed"
            theme="primary"
            size="small"
            disabled={disabled}
            onClick={() => {
              action.runWorkflow(row)
            }}
          >
            {t('coze.workflow.columns.run')}
          </t-button>
          <t-button
            variant="dashed"
            theme="primary"
            size="small"
            onClick={() => {
              workflowId.value = row.workflow_id
              resultRef.value.open()
            }}
          >
            {t('coze.workflow.columns.result')}
          </t-button>
          <t-button
            variant="dashed"
            theme="primary"
            size="small"
            onClick={() => {
              const dialog = DialogPlugin.confirm({
                header: t('coze.workflow.columns.deleteConfirm.title'),
                content: t('coze.workflow.columns.deleteConfirm.content'),
                confirmBtn: t('coze.workflow.columns.deleteConfirm.confirm'),
                cancelBtn: t('coze.workflow.columns.deleteConfirm.cancel'),
                onConfirm: () => {
                  action.deleteWorkflow(row)
                  dialog.destroy()
                },
                onClose: () => {
                  dialog.destroy()
                }
              })
            }}
          >
            {t('coze.workflow.columns.delete')}
          </t-button>
        </t-space>
      )
    }
  }
])
const visible = ref(false)
const addModalRef = useTemplateRef('addModalRef')

const action = {
  async deleteWorkflow(row) {
    const result = await removeCozeWorkflow(row.id)
    if (result.success) {
      MessagePlugin.success('删除成功')
    } else {
      MessagePlugin.error('删除失败')
    }
    refreshData()
  },
  async addWorkflow() {
    visible.value = true
    addModalRef.value.methods.resetForm()
  },
  async closeAddWorkflow() {
    visible.value = false
  },
  async submit() {
    const validate = await addModalRef.value.methods.validateForm()

    if (validate) {
      action.closeAddWorkflow()
      const result = await addCozeWorkflow(addModalRef.value.formData)
      if (result.success) {
        MessagePlugin.success('添加成功')
      } else {
        MessagePlugin.error('添加失败')
      }
      refreshData()
    }
  },
  async runWorkflow(row) {
    try {
      await updateCozeWorkflowStatus(row.id, STATUS_MAP.running)
      // 刷新状态
      setTimeout(() => {
        refreshData()
      }, 200)
      // 执行工作流
      const { output, execute_id } = await runCozeWorkflow(
        row.workflow_id,
        row.app_id,
        row.coze_token
      )

      if (output) {
        const outputJson = JSON.parse(output)
        const secOutput = JSON.parse(outputJson.Output)
        const data = secOutput.data

        await insertWorkFlowResult({ workflow_id: row.workflow_id, text: data, execute_id })
        await updateCozeWorkflowStatus(row.id, STATUS_MAP.success, null)
      } else {
        await updateCozeWorkflowStatus(row.id, STATUS_MAP.failed, null)
      }
      refreshData()
    } catch (e) {
      // console.log(e)
      await updateCozeWorkflowStatus(row.id, STATUS_MAP.failed, null)
      refreshData()
    }
  }
}

const iterateQueryRunningWorkflow = async (tableData) => {
  if (tableData.length === 0) {
    return
  }

  // 使用Promise.all来并发查询所有正在运行的工作流状态
  const promises = tableData
    .filter((item) => item.status === STATUS_MAP.running && item.execute_id)
    .map(async ({ id, workflow_id, coze_token, execute_id }) => {
      try {
        const { output } = await queryCozeWorkflow(execute_id, coze_token, workflow_id)
        if (output) {
          const outputJson = JSON.parse(output)
          const secOutput = JSON.parse(outputJson.Output)
          const data = secOutput.data
          await updateCozeWorkflowStatus(id, STATUS_MAP.success, null)
          await insertWorkFlowResult({ workflow_id, text: data, execute_id })
        } else {
          await updateCozeWorkflowStatus(id, STATUS_MAP.failed, null)
        }
      } catch (e) {
        // console.log(e)
        await updateCozeWorkflowStatus(id, STATUS_MAP.failed, null)
      }
    })

  await Promise.all(promises)
  // refreshData()
  console.log('查询完成')
  loading.value = true
  data.value = await queryAllCozeWorkflow()
  loading.value = false
}

const refreshData = async () => {
  loading.value = true
  data.value = await queryAllCozeWorkflow()
  loading.value = false
  await iterateQueryRunningWorkflow(data.value)
}

onMounted(async () => {
  refreshData()
})
</script>
<style lang="less" scoped>
.coze-content-box {
  height: calc(100vh - 60px);
  padding: 20px;
  background-color: #f4f4f6;
  overflow: auto;
  color: #333;
  width: 100%;
}
</style>
