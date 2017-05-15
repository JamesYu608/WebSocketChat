const Connection = require('tedious').Connection
const Request = require('tedious').Request
const TYPES = require('tedious').TYPES
const DB_CONFIG = require('./secure/zuimsgdb_config')

function buildQueryResult (rawData) {
  const result = []
  rawData.forEach(row => {
    const rowObj = {}
    row.forEach(col => {
      rowObj[col.metadata.colName] = col.value
    })
    result.push(rowObj)
  })

  return result
}

module.exports.GetDeviceListBySN = function (sn, callback) {
  const connection = new Connection(DB_CONFIG.connectionConfig)

  connection.on('connect', err => {
    if (err) callback(err)

    const request = new Request(
      `SELECT ${DB_CONFIG.devicelist.basicProjection}
      FROM ${DB_CONFIG.devicelist.table}
      WHERE sn = @sn
      ORDER BY id`,
      (err, count, rows) => {
        if (err) {
          callback(err)
        } else {
          callback(null, buildQueryResult(rows))
        }

        connection.close()
      }
    )
    request.addParameter('sn', TYPES.VarChar, sn)

    connection.execSql(request)
  })
}
