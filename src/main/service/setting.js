import { ipcMain } from 'electron'
import { insert, update, findByGroup, findByGroupAndKey, selectAll, updateById, findById } from '../dao/setting.js'

const MODEL_NAME = 'setting'

// 设置组常量
export const SETTING_GROUPS = {
  SYSTEM: 'system',    // 系统设置
  STORAGE: 'storage',  // 存储设置
  MINION: 'minio',    // MINION 存储设置
  API: 'api',         // API设置
  MODEL: 'model'      // 模型设置
}

// 设置组显示名称映射
export const GROUP_LABELS = {
  [SETTING_GROUPS.SYSTEM]: '系统设置',
  [SETTING_GROUPS.STORAGE]: '存储设置',
  [SETTING_GROUPS.API]: 'API设置',
  [SETTING_GROUPS.MODEL]: '模型设置',
  [SETTING_GROUPS.MINION]: 'MINION存储设置'
}

export function saveSetting({ group_name, key, value, label }) {
  const setting = findByGroupAndKey(group_name, key)
  if (setting) {
    return update({ group_name, key, value, label })
  }
  return insert({ group_name, key, value, label })
}

export function getSettingByGroup(group_name) {
  return findByGroup(group_name)
}

export function getSetting(group_name, key) {
  return findByGroupAndKey(group_name, key)
}

export function getAllSettings() {
  return selectAll()
}

// 默认设置数据
const DEFAULT_SETTINGS = [
  {
    group_name: SETTING_GROUPS.SYSTEM,
    key: 'face2faceUrl',
    value: 'http://127.0.0.1:8383/easy',
    label: 'Face2Face 服务地址'
  },
  {
    group_name: SETTING_GROUPS.SYSTEM,
    key: 'ttsUrl',
    value: 'http://127.0.0.1:18180',
    label: 'TTS 服务地址'
  },
  {
    group_name: SETTING_GROUPS.SYSTEM,
    key: 'modelPath',
    value: '',
    label: '模型路径'
  },
  {
    group_name: SETTING_GROUPS.SYSTEM,
    key: 'ttsProductPath',
    value: '',
    label: 'TTS 产物路径'
  },
  {
    group_name: SETTING_GROUPS.SYSTEM,
    key: 'ttsRootPath',
    value: '',
    label: 'TTS 根路径'
  },
  {
    group_name: SETTING_GROUPS.SYSTEM,
    key: 'ttsTrainPath',
    value: '',
    label: 'TTS 训练路径'
  },
  {
    group_name: SETTING_GROUPS.MINION,
    key: 'enabled',
    value: 'false',
    label: '是否启用'
  },
  {
    group_name: SETTING_GROUPS.MINION,
    key: 'endpoint',
    value: '127.0.0.1:9000',
    label: 'MinIO服务器地址'
  },
  {
    group_name: SETTING_GROUPS.MINION,
    key: 'useSSL',
    value: 'true',
    label: '是否使用SSL'
  },
  {
    group_name: SETTING_GROUPS.MINION,
    key: 'accessKey',
    value: '',
    label: '访问密钥'
  },
  {
    group_name: SETTING_GROUPS.MINION,
    key: 'secretKey',
    value: '',
    label: '秘密密钥'
  },
  {
    group_name: SETTING_GROUPS.MINION,
    key: 'bucket',
    value: '',
    label: '存储桶'
  }
]

export function init() {
  // 初始化数据
  const settings = getAllSettings()
  if (!settings || settings.length === 0) {
    DEFAULT_SETTINGS.forEach(setting => {
      saveSetting(setting)
    })
  }

  ipcMain.handle(MODEL_NAME + '/save', (event, ...args) => {
    
  console.log('saveSetting args', ...args)
    return saveSetting(...args)
  })
  ipcMain.handle(MODEL_NAME + '/getByGroup', (event, ...args) => {
    return getSettingByGroup(...args)
  })
  ipcMain.handle(MODEL_NAME + '/get', (event, ...args) => {
    return getSetting(...args)
  })
  ipcMain.handle(MODEL_NAME + '/getAll', (event, ...args) => {
    return getAllSettings(...args)
  })
  ipcMain.handle(MODEL_NAME + '/getAllGroupLables', (event, ...args) => {
    return GROUP_LABELS
  })
}