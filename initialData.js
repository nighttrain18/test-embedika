const brands = ["BMW", "Audi", "Ford", "Tesla", "Mazda"]

const colors = ["red", "black", "yellow", "green", "white"]

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function nrandom(n, max) {
    return [...Array(n)].map(_ => random(max))
}

const cars = [...Array(10)].map((_, index) => {
    return {
        number: `A${nrandom(3,9).join('')}AX${nrandom(2,9).join('')}`,
        brand: 1 + random(brands.length),
        color: 1 + random(colors.length),
        year: 2020 + index
    }
})

module.exports = {
    brands,
    colors,
    cars
}