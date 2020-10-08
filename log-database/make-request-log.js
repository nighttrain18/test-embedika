const createLog = (id, date, event) =>{
    return {id, date, event}
}

module.exports = {
    makeStartRequestLog: (id, date) => {
        return createLog(id, date, 'START')
    },
    makeFinishRequestLog: (id, date) => {
        return createLog(id, date, 'FINISH')
    },
    makeErrorRequestLog: (id, date) => {
        return createLog(id, date, 'ERROR')
    }
}