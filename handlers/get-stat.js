module.exports = db => async (req, res) => {
    try {
        const stat = await db.GetStat()
        res.send(stat)
    } catch (err) {
        res.sendStatus(500)
    }
}