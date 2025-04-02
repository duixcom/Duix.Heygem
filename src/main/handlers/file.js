import { dialog } from "electron"
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

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
