const sqlite = require('sqlite3').verbose()
const {makeError} = require('./database-error')

const enableForeignKeySql = `PRAGMA foreign_keys=ON`

const createCarTableSql = `
    CREATE TABLE cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number TEXT UNIQUE,
        brand INTEGER,
        color INTEGER,
        year INTEGER,
        date_of_add TEXT,
        FOREIGN KEY (brand) REFERENCES brands(id),
        FOREIGN KEY (color) REFERENCES colors(id)
    )
`

const createBrandTableSql = `
    CREATE TABLE brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )
`

const createColorTableSql = `
    CREATE TABLE colors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )
`

class Database {
    Initialize({brands, colors, cars}) {
        return new Promise(async (resolve, reject) => {
            this.db = new sqlite.Database(':memory:')
            const sqls = [enableForeignKeySql, createBrandTableSql, createColorTableSql, createCarTableSql]
            for(const sql of sqls) {
                await new Promise((resolve, reject) => {
                    this.db.run(sql, (err, _) => {
                        resolve()
                    })
                })
            }

            await this.AddBrands(brands)
            await this.AddColors(colors)
            for(const car of cars) {
                await this.AddCar({...car, dateOfAdd: new Date().toISOString()})
            }

            console.log('Database initialized')
            resolve()
        })
    }

    AddCar({number, brand, color, year, dateOfAdd}) {
        const sql = `INSERT INTO cars (
            number, 
            brand, 
            color, 
            year,
            date_of_add
        ) VALUES (?,?,?,?,?)`
        return new Promise(async (resolve, reject) => {
            this.db.run(sql, [number, brand, color, year, dateOfAdd], (err, res) => {
                if(err) {
                    const typedError = makeError(err)
                    reject(typedError)
                    return
                }

                resolve()
            })
        })
    }

    DeleteCar(id) {
        const sql = 'DELETE FROM cars WHERE id = ?'
        return new Promise(async (resolve, reject) => {
            this.db.run(sql, [id], (err, _) => {
                resolve()
            })
        })
    }

    HasCar(id) {
        const sql = 'SELECT COUNT(*) FROM cars WHERE id = ?'
        return new Promise(async (resolve, reject) => {
            this.db.all(sql, [id], (err, res) => {
                if(err) {
                    reject(err)
                    return
                }
                
                resolve(res[0]['COUNT(*)'] != 0)
            })
        })
    }

    GetCars({sortby}) {
        const sql = `SELECT * FROM cars ${sortby ? `ORDER BY ${sortby}` : ''}` 
        return new Promise(async (resolve, reject) => {
            this.db.all(sql, (err, res) => {
                resolve(res)
            })
        })
    }

    GetBrands() {
        const sql = 'SELECT * FROM brands'
        return new Promise(async (resolve, reject) => {
            this.db.all(sql, (err, res) => {
                resolve(res)
            })
        })
    }

    GetColors() {
        const sql = 'SELECT * FROM colors'
        return new Promise(async (resolve, reject) => {
            this.db.all(sql, (err, res) => {
                resolve(res)
            })
        })
    }

    GetStat() {
        const tables = ['cars', 'brands', 'colors']
        const getFirstDateOfAddSql = 'SELECT date_of_add FROM cars LIMIT 1'
        const getLastDateOfAddSql = 'SELECT date_of_add FROM cars ORDER BY ID DESC LIMIT 1'
        const sqls = [
            getFirstDateOfAddSql, 
            getLastDateOfAddSql, 
            ...tables.map(t => `SELECT COUNT(*) FROM ${t}`)]
        return new Promise(async (resolve, reject) => {
            const results = await Promise.all(sqls.map(sql => {
                return new Promise((resolve, reject) => {
                    this.db.all(sql, (err, res) => {
                        resolve(res)
                    })
                })
            }))
            resolve({
                cars: results[2][0]['COUNT(*)'],
                brands: results[3][0]['COUNT(*)'],
                colors: results[4][0]['COUNT(*)'],
                firstDateOfAdd: results[0][0].date_of_add,
                secondDateOfAdd: results[1][0].date_of_add
            })
        })
    }

    AddBrands(brands) {
        const sql = 'INSERT INTO brands (name) VALUES (?)'
        return new Promise(async (resolve, reject) => {
            for(const brand of brands) {
                await new Promise((resolve, reject) => {
                    this.db.run(sql, [brand], (err, _) => {
                        resolve()
                    })
                }) 
            }
            resolve()
        })
    }

    AddColors(colors) {
        const sql = 'INSERT INTO colors (name) VALUES (?)'
        return new Promise(async (resolve, reject) => {
            for(const color of colors) {
                await new Promise((resolve, reject) => {
                    this.db.run(sql, [color], (err, _) => {
                        resolve()
                    })
                }) 
            }
            resolve()
        })
    }
}

module.exports = Database