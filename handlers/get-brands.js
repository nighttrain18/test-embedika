module.exports = db => async (req, res) => {
    try {
        const brands = await db.GetBrands()
        res.send(brands)
    } catch(err) {
        res.sendStatus(500)
    }
}