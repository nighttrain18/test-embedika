class WrongParameters extends Error {}

const makeError = ({errno}) => {
    switch(errno) {
        case 19: return new WrongParameters()
    }
}

module.exports = {
    makeError,
    errorTypes: {
        WrongParameters
    }
}