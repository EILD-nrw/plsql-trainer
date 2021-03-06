const oracledb = require('oracledb')
const dbconfig = require('./database/dbconfig')

// Hardcoded list of allowed tableNames as recommended by oracle
// https://oracle.github.io/node-oracledb/doc/api.html#intro
const validTables = ['ABTEILUNGEN', 'ANGESTELLTE', 'ARTIKEL', 'AUFTRAEGE', 'AUFTRAGSPOSITIONEN', 'GEH_KLASSEN',
  'GEHALTSPROTOKOLL', 'KUNDEN', 'LAGER', 'LAGERBESTAND', 'LIEFERANTEN', 'LIEFERPROGRAMME', 'LIEFERUNGEN', 'ORTE',
  'POSITIONSARCHIV', 'STRUKTUR', 'TEILE', 'TEILE_WERKE', 'WERKE', 'RECHNUNGEN']

/**
 * An unformatted response from the database
 * @typedef {{metaData: [{name: string}], rows: any[]}} DatabaseResponse
 */

/**
 * Query database for specific table
 * @param {string} tableName
 * @returns {Promise<DatabaseResponse>}
 */
async function getTable (tableName) {
  // Check if table is in list of valid tables
  if (!validTables.includes(tableName.toUpperCase())) {
    throw Error('Invalid table name')
  }

  const connection = await oracledb.getConnection(dbconfig)
  const result = await connection.execute(
        `SELECT *
         FROM ${tableName}`
  )
  await connection.close()

  return result
}

module.exports = {
  getTable
}
