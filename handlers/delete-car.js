module.exports = db => async (req, res) => {
    try {
        if(!(await db.HasCar(req.params.id))) {
            res.sendStatus(404)
            return
        }

        await db.DeleteCar(req.params.id)
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
}