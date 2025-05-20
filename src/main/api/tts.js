import request from './request.js'
import { serviceUrl } from '../config/config.js'
import log from '../logger.js'

export function makeAudio(param) {
  log.debug('~ makeAudio ~ param:', JSON.stringify(param))
  return request.post(`${serviceUrl().tts}/v1/invoke`, param, {
    responseType: 'arraybuffer'
  })
}

export function preprocessAndTran(param) {
  log.debug('~ preprocessAndTran ~ param:', JSON.stringify(param))
  return request.post(`${serviceUrl().tts}/v1/preprocess_and_tran`, param)
}
