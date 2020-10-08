const {
    makeStartRequestLog,
    makeFinishRequestLog,
    makeErrorRequestLog
} = require('../log-database/make-request-log')

const getDate = () => new Date().toISOString()

module.exports = logDb => async (req, res, next) => {
    const requestId = await logDb.CreateRequest(req)
    const log = makeStartRequestLog(requestId, getDate())
    await logDb.SaveRequestLog(log)
    res.on('finish', async () => {
        const log = makeFinishRequestLog(requestId, getDate())
        await logDb.SaveRequestLog(log)
    })
    res.on('error', async () => {
        const log = makeErrorRequestLog(requestId, getDate())
        await logDb.SaveRequestLog(log)
    })
    next()
}