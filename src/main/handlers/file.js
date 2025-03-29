import { dialog, ipcRenderer } from "electron"
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { Minio } from 'minio'

export default {
  name: 'file',

  // 选择文件
  async selectFile(app, filters = {}) {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'], // 也可以用 openDirectory 选择文件夹
      filters: [
        filters,
        { name: 'All Files', extensions: ['*'] }
      ].filter(item => Object.keys(item).length)
    })

    if (!result.canceled) {
      return result.filePaths[0]
    }
  },
  async saveFile(app, defaultPath = "") {
    const result = await dialog.showSaveDialog({
      defaultPath
    })
    if (!result.canceled) {

      const minioConfig = await ipcRenderer.invoke('setting/getByGroup', 'minio')
      console.log('minioConfig', minioConfig)

      if (minioConfig.enabled == 'true') {
        // 创建 MinIO 客户端
        const minioClient = new Minio.Client(minioConfig)

        try {
          // 生成唯一的文件名
          const fileName = path.basename(result.filePath)
          const objectName = `${Date.now()}-${fileName}`

          // 上传文件到 MinIO
          await minioClient.fPutObject(
            minioConfig.bucket,
            objectName,
            result.filePath,
            { 'Content-Type': 'application/octet-stream' }
          )

          // 返回 MinIO 中的文件路径
          return `minio://${minioConfig.bucket}/${objectName}`
        } catch (err) {
          console.error('Error uploading to MinIO:', err)
          throw err
        }
      }


      return result.filePath
    }
  },
  async getVideoInfo(app, videoPath) {
    return new Promise((resolve) => {
      videoPath = videoPath.replace(/^file:\/\//, '')
      ffmpeg(videoPath).ffprobe((err, data) => {
        if (err) {
          resolve({ isOK: false, msg: err.toString() })
        } else if (data?.streams?.length > 0) {
          resolve(Object.assign({ isOK: true, name: path.basename(videoPath) }, data.format, data.streams.find(item => item.codec_type === 'video')))
        } else {
          resolve({ isOK: false, msg: 'No streams found' })
        }
      })
    })
  },

  async getAudioInfo(app, audioPath) {
    audioPath = audioPath.replace(/^file:\/\//, '')
    return new Promise((resolve) => {
      ffmpeg(audioPath).ffprobe((err, data) => {
        if (err) {
          resolve({ isOK: false, msg: err.toString() })
        } else if (data?.streams?.length > 0) {
          resolve(Object.assign({ isOK: true, name: path.basename(audioPath) }, data.format, data.streams.find(item => item.codec_type === 'audio')))
        } else {
          resolve({ isOK: false, msg: 'No streams found' })
        }
      })
    })
  }
}
