import path from 'path'
import os from 'os'
import { getSettingByGroup } from '../service/setting'
// import { set } from 'lodash-es'

const isDev = process.env.NODE_ENV === 'development'
const isWin = process.platform === 'win32'

const defaultServiceUrl = {
  face2face: isDev ? 'http://192.168.4.204:8383/easy' : 'http://127.0.0.1:8383/easy',
  tts: isDev ? 'http://192.168.4.204:18180' : 'http://127.0.0.1:18180'
}

const defaultAssetPath = {
  model: isWin
    ? path.join('D:', 'heygem_data', 'face2face', 'temp')
    : path.join(os.homedir(), 'heygem_data', 'face2face', 'temp'), // 模特视频
  ttsProduct: isWin
    ? path.join('D:', 'heygem_data', 'face2face', 'temp')
    : path.join(os.homedir(), 'heygem_data', 'face2face', 'temp'), // TTS 产物
  ttsRoot: isWin
    ? path.join('D:', 'heygem_data', 'voice', 'data')
    : path.join(os.homedir(), 'heygem_data', 'voice', 'data'), // TTS服务根目录
  ttsTrain: isWin
    ? path.join('D:', 'heygem_data', 'voice', 'data', 'origin_audio')
    : path.join(os.homedir(), 'heygem_data', 'voice', 'data', 'origin_audio') // TTS 训练产物
}



function loadConfig() {
  let _serviceUrl = { ...defaultServiceUrl }
    let _assetPath = { ...defaultAssetPath }
    const systemSetting = getSettingByGroup('system')
    if (systemSetting) {
      systemSetting.forEach((item) => {
        console.log('item.value', item.value, item.key, _serviceUrl.hasOwnProperty(item.key))
        const k = item.key.replace('Url', '').replace('Path', '')
        if(_serviceUrl.hasOwnProperty(k) && item.value) {
          _serviceUrl[k] = item.value
        }
        if(_assetPath.hasOwnProperty(k) && item.value) {
          _assetPath[k] = item.value
        }
      })
    }

    return {
      _serviceUrl,
      _assetPath
    }
}

export function serviceUrl() {
  return loadConfig()._serviceUrl
}

export function assetPath() {
  return  loadConfig()._assetPath
}