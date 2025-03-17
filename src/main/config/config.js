import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

export const serviceUrl = {
  face2face: isDev ? 'http://192.168.4.204:8383/easy' : 'http://127.0.0.1:8383/easy',
  tts: isDev ? 'http://192.168.4.204:18180' : 'http://127.0.0.1:18180'
}

export const assetPath = {
  model: path.join('D:', 'heygem_data', 'face2face', 'temp'), // 模特视频
  ttsProduct: path.join('D:', 'heygem_data', 'face2face', 'temp'), // TTS 产物
  ttsRoot: path.join('D:', 'heygem_data', 'voice', 'data'), // TTS服务根目录
  ttsTrain: path.join('D:', 'heygem_data', 'voice', 'data', 'origin_audio') // TTS 训练产物
}
