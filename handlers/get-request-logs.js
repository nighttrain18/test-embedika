module.exports = logDb => async (req, res) => {
    try {
        const logs = await logDb.GetLogs()
        res.send(logs)
    } catch(err) {
        res.sendStatus(500)
    }
}