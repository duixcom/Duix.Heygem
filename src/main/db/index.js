import path from 'path'
import { app } from 'electron'
import Database from 'better-sqlite3'
import sql from './sql.js'
import fs from 'fs'
import log from '../logger.js'
import { update as updateContext, findByKey } from '../dao/context.js'

const userDataPath = app.getPath('userData')
const dbPath = path.join(userDataPath, 'biz.db')
// console.log('dbPath:', dbPath)

// 保持一个全局的数据库连接
let dbInstance = null

export function initDB() {
  if (!fs.existsSync(dbPath)) {
    log.info('create db:', dbPath)
    const db = new Database(dbPath)
    db.exec(sql[0].script)
    db.close()
  }
  log.debug('dbPath:', dbPath)
  updateDB()
}

function updateDB() {
  const db = connect()
  log.debug('update db pre:', findByKey('db_version').val)
  const dbVersion = findByKey('db_version').val
  sql
    .filter((item) => item.version > +dbVersion)
    .forEach((item) => {
      log.debug('update db item:', item.version, item.script)
      db.exec(item.script)
      updateContext('db_version', item.version)
    })
}

export function connect() {
  if (!dbInstance) {
    // 创建新连接
    dbInstance = new Database(dbPath, {
      fileMustExist: false
    })

    // 优化配置
    // dbInstance.pragma('journal_mode = WAL')
    // dbInstance.pragma('synchronous = NORMAL')

    // 包装原始方法以添加日志
    const originalPrepare = dbInstance.prepare.bind(dbInstance)
    dbInstance.prepare = function (sql) {
      const stmt = originalPrepare(sql)
      const originalRun = stmt.run.bind(stmt)
      const originalGet = stmt.get.bind(stmt)
      const originalAll = stmt.all.bind(stmt)

      // 包装 run 方法
      stmt.run = function (...args) {
        const options = args[args.length - 1]
        const shouldLog = !(options && typeof options === 'object' && options.silent === true)

        if (shouldLog) {
          log.debug('[SQL Run]:', sql, args)
        }

        // 如果最后一个参数是选项对象，则移除它
        const sqlArgs = options && typeof options === 'object' ? args.slice(0, -1) : args
        return originalRun(...sqlArgs)
      }

      // 包装 get 方法
      stmt.get = function (...args) {
        const options = args[args.length - 1]
        const shouldLog = !(options && typeof options === 'object' && options.silent === true)

        if (shouldLog) {
          log.debug('[SQL Get]:', sql, args)
        }

        const sqlArgs = options && typeof options === 'object' ? args.slice(0, -1) : args
        return originalGet(...sqlArgs)
      }

      // 包装 all 方法
      stmt.all = function (...args) {
        const options = args[args.length - 1]
        const shouldLog = !(options && typeof options === 'object' && options.silent === true)

        if (shouldLog) {
          log.debug('[SQL All]:', sql, args)
        }

        const sqlArgs = options && typeof options === 'object' ? args.slice(0, -1) : args
        return originalAll(...sqlArgs)
      }

      return stmt
    }

    log.info('[DB] Connected:', dbPath)
  }
  return dbInstance
}
