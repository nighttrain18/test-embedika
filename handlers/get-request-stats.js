module.exports = logDb => async (req, res) => {
    try {
        const stats = await logDb.GetStats()
        res.send(stats)
    } catch (err) {
        res.sendStatus(500)
    }
}