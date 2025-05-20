<template>
    <div class="config-container">
        <t-row :gutter="[16, 16]">
            <!-- 左侧分组列表 -->
            <t-col :span="3">
                <t-card title="配置分组">
                    <t-menu v-model="selectedGroup" theme="light" @select="handleGroupSelect">
                        <t-menu-item>
                            全部
                        </t-menu-item>
                        <t-menu-item v-for="group in groups" :key="group" :value="group">
                            {{ groupLabels[group] }}
                        </t-menu-item>
                    </t-menu>
                </t-card>
            </t-col>

            <!-- 右侧配置列表 -->
            <t-col :span="9">
                <t-card :title="currentGroup + '配置'">
                    <template #actions>
                        <t-button theme="primary" @click="showAddModal">新增配置</t-button>
                    </template>

                    <t-table :columns="columns" :data="configList" :bordered="true" row-key="id">
                        <template #operation="slotProps">
                            <t-space>
                                <t-link theme="primary" @click="handleEdit(slotProps.row)">
                                    编辑
                                </t-link>
                                <t-popconfirm content="确定要删除这个配置项吗？" @confirm="handleDelete(slotProps.row)">
                                    <t-link theme="danger">删除</t-link>
                                </t-popconfirm>
                            </t-space>
                        </template>
                    </t-table>
                </t-card>
            </t-col>
        </t-row>

        <!-- 新增/编辑配置的弹窗 -->
        <t-dialog v-model:visible="modalVisible" :title="modalTitle" @confirm="handleModalOk"
            :confirm-btn="{ content: '确定', theme: 'primary' }" :cancel-btn="{ content: '取消' }">
            <t-form ref="formRef" :data="formState" :rules="rules" @submit="handleModalOk">
                <t-form-item label="分组" name="group_name">
                    <t-input v-model="formState.group_name" :disabled="!!editingRecord" />
                </t-form-item>
                <t-form-item label="配置键" name="key">
                    <t-input v-model="formState.key" :disabled="!!editingRecord" />
                </t-form-item>
                <t-form-item label="配置值" name="value">
                    <t-input v-model="formState.value" />
                </t-form-item>
                <t-form-item label="配置说明" name="label">
                    <t-input v-model="formState.label" />
                </t-form-item>
            </t-form>
        </t-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { getAllSetting, saveSetting, getAllSettingGroupLables } from '@renderer/api/index.js'

// 表格列定义
const columns = [
    { colKey: 'key', title: '配置键' },
    { colKey: 'value', title: '配置值' },
    { colKey: 'label', title: '配置说明' },
    { colKey: 'operation', title: '操作', fixed: 'right' }
]

// 数据状态
const configData = ref([])
const selectedGroup = ref('')  // 改为空字符串
const modalVisible = ref(false)
const formRef = ref()
const editingRecord = ref(null)
const groupLabels = ref([])
// 表单状态
const formState = ref({
    group_name: '',
    key: '',
    value: '',
    label: ''
})

// 表单校验规则
const rules = {
    group_name: [{ required: true, message: '请输入分组名称' }],
    key: [{ required: true, message: '请输入配置键' }],
    value: [{ required: true, message: '请输入配置值' }]
}

// 计算属性
const groups = computed(() => {
    const groupSet = new Set(configData.value.map(item => item.group_name))
    return Array.from(groupSet)
})

const currentGroup = computed(() => selectedGroup.value ? groupLabels.value[selectedGroup.value] : '全部')

const configList = computed(() => {
    if (!selectedGroup.value) return configData.value
    return configData.value.filter(item => item.group_name === selectedGroup.value)
})

const modalTitle = computed(() => editingRecord.value ? '编辑配置' : '新增配置')

// 方法
const loadData = async () => {
    try {
        groupLabels.value = await getAllSettingGroupLables()
        configData.value = await getAllSetting()
        if (configData.value.length && !selectedGroup.value) {
            selectedGroup.value = configData.value[0].group_name
        }
    } catch (error) {
        MessagePlugin.error('加载配置失败')
    }
}

const handleGroupSelect = (value) => {
    selectedGroup.value = value
}

const showAddModal = () => {
    editingRecord.value = null
    formState.value = {
        group_name: selectedGroup.value || '',
        key: '',
        value: '',
        label: ''
    }
    modalVisible.value = true
}

const handleEdit = (record) => {
    editingRecord.value = record
    formState.value = { ...record }
    modalVisible.value = true
}

const handleModalOk = async () => {
    try {
        await formRef.value.validate()
        await saveSetting({...formState.value})
        MessagePlugin.success('保存成功')
        modalVisible.value = false
        loadData()
    } catch (error) {
        console.error(error)
        MessagePlugin.error('保存失败')
    }
}

const handleDelete = async (record) => {
    try {
        // TODO: 实现删除功能
        MessagePlugin.success('删除成功')
        loadData()
    } catch (error) {
        MessagePlugin.error('删除失败')
    }
}

// 生命周期
onMounted(() => {
    loadData()
})
</script>

<style scoped>
.config-container {
    height: calc(100vh - 60px);
    padding: 20px;
    background-color: #f4f4f6;
}
</style>