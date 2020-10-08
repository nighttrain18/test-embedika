const express = require('express')
const bodyParser = require('body-parser')
const Database = require('./database/database')
const LogDatabase = require('./log-database/log-database')

const loggerMiddleware = require('./middlewares/request-logger-middleware')
const cacheMiddleware = require('./middlewares/cache-middleware')

const db = new Database()
const logDb = new LogDatabase()

const getRequestLogsHandler = require('./handlers/get-request-logs')(logDb)
const getRequestStatsHandler = require('./handlers/get-request-stats')(logDb)
const getCarsHandler = require('./handlers/get-cars')(db)
const postCarHandler = require('./handlers/post-car')(db)
const deleteCarHandler = require('./handlers/delete-car')(db)
const getStatHandler = require('./handlers/get-stat')(db)
const getBrandsHandler = require('./handlers/get-brands')(db)
const getColorsHandler = require('./handlers/get-colors')(db)

const app = express()
const jsonParser = bodyParser.json()

// middlewares
app.use(loggerMiddleware(logDb))
app.use(cacheMiddleware(new Set(['/colors', '/brands'])))
// endpoints
app.get("/cars", getCarsHandler)
app.get("/brands", getBrandsHandler)
app.get("/colors", getColorsHandler)
app.get("/stat", getStatHandler)
app.get("/request_logs", getRequestLogsHandler)
app.get("/request_stats", getRequestStatsHandler)
app.post("/cars", jsonParser, postCarHandler)
app.delete("/cars/:id", deleteCarHandler)

Promise.all([
    logDb.Initialize(), 
    db.Initialize(require('./initialData'))
]).then(async () => {
    const {port} = require('./config')
    app.listen(port, err => {
        if(err) {
            console.log('Server launch error: ', err)
            return
        }

        console.log(`Server started at ${port} port`)
    })
})