const express = require('express')
const app = express()
const triggerRouter = require('./trigger/router')
const service = require('./service')
const path = require('path')

/*
    Server Configuration
 */

const viewPath = path.join(__dirname, 'views')

// Use pug
app.set('view engine', 'pug')

// Parse Post-Body
app.use(express.urlencoded())

// Handle static css and js files automatically
app.use(express.static(__dirname))

/*
    Application Code
*/
app.get(['/', '/index'], async (req, res) => {
  res.render(viewPath + 'plsql', {})
})

app.get('/table/:tableName', async (req, res, next) => {
  try {
    const variables = {
      tableName: req.params.tableName,
      table: await service.getFormattedTable(req.params.tableName)
    }
    res.render(viewPath + 'table', variables)
  } catch (err) {
    next(err)
  }
})

app.get('/diagram', (req, res) => {
  res.render(viewPath + 'diagram', {})
})

/*
    Submodules
 */
app.use('/trigger', triggerRouter)

// Simple error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.render(viewPath + '500', { error: err })
})

// Start server
app.listen(8080, () => {
  console.log('Server listening at http://localhost:8080/')
})

// Handle Shutdown
process.on('SIGINT', () => {
  console.log('Exiting application')
  process.exit(0)
})
