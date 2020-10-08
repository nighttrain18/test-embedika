module.exports = db => async (req, res) => {
    try {
        const cars = await db.GetCars({sortby: req.query['sortby']})
        res.send(cars)
    } catch (err) {
        res.sendStatus(500)
    }
}