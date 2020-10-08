module.exports = db => async (req, res) => {
    try {
        const colors = await db.GetColors()
        res.send(colors)
    } catch(err) {
        res.sendStatus(500)
    }
}