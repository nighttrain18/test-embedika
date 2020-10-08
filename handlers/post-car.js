const {errorTypes: {WrongParameters}} = require('../database/database-error')

module.exports = db => async (req, res) => {
    // validate req.body
    try {
        const car = await db.AddCar({
            ...req.body, dateOfAdd: 
            new Date().toISOString()
        })
        res.send(car)
    }
    catch (err) {
        if(err instanceof WrongParameters) {
            res.sendStatus(409).send('Car is already exist')
            return
        }

        res.sendStatus(500)
    }
}