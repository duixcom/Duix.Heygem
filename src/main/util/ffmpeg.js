import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import log from '../logger.js'

const ffmpegPathValue =
  process.env.NODE_ENV === 'development'
    ? process.platform === 'win32'
      ? path.join(__dirname, '../../resources/ffmpeg/bin/ffmpeg.exe')
      : path.join(__dirname, '../../resources/ffmpeg/bin/ffmpeg')
    : process.platform === 'win32'
      ? path.join(
          process.resourcesPath,
          'app.asar.unpacked',
          'resources',
          'ffmpeg',
          'bin',
          'ffmpeg.exe'
        )
      : path.join(
          process.resourcesPath,
          'app.asar.unpacked',
          'resources',
          'ffmpeg',
          'bin',
          'ffmpeg'
        )

// 恢复ffprobePathValue定义
const ffprobePathValue =
  process.env.NODE_ENV === 'development'
    ? process.platform === 'win32'
      ? path.join(__dirname, '../../resources/ffmpeg/bin/ffprobe.exe')
      : path.join(__dirname, '../../resources/ffmpeg/bin/ffprobe')
    : process.platform === 'win32'
      ? path.join(
          process.resourcesPath,
          'app.asar.unpacked',
          'resources',
          'ffmpeg',
          'bin',
          'ffprobe.exe'
        )
      : path.join(
          process.resourcesPath,
          'app.asar.unpacked',
          'resources',
          'ffmpeg',
          'bin',
          'ffprobe'
        )

log.info('FFmpeg path:', ffmpegPathValue)
ffmpeg.setFfmpegPath(ffmpegPathValue)

log.info('FFprobe path:', ffprobePathValue)
ffmpeg.setFfprobePath(ffprobePathValue)

export function extractAudio(videoPath, audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .save(audioPath)
      .on('end', () => {
        log.info('audio split done')
        resolve(true)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

export function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath).ffprobe((err, data) => {
      if (err) {
        log.error("🚀 ~ ffmpeg ~ err:", err)
        reject(err)
      } else if (data && data.streams && data.streams.length > 0) {
        resolve(data.streams[0].duration) // 单位秒
      } else {
        log.error('No streams found')
        reject(new Error('No streams found'))
      }
    })
  })
}