const sqlite3 = require('sqlite3').verbose()

const enableForeignKeySql = `PRAGMA foreign_keys=ON`

const createRequestsTableSql = `
    CREATE TABLE requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        query TEXT
    )
`

const createRequestEventsTableSql = `
    CREATE TABLE request_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url INTEGER,
        date TEXT,
        event TEXT,
        FOREIGN KEY (url) REFERENCES requests(id)
    )
`

class LogDatabase {
    Initialize() {
        this.db = new sqlite3.Database(':memory:')
        return new Promise(async (resolve, reject) => {
            const sqls = [
                enableForeignKeySql,
                createRequestsTableSql,
                createRequestEventsTableSql
            ]
            for(const sql of sqls) {
                await new Promise((resolve, reject) => {
                    this.db.run(sql, (err, _) => {
                        resolve()
                    })
                })
            }

            console.log('LogDatabase initialized')
            resolve()
        })
    }

    CreateRequest({method, path: url, query}) {
        return new Promise(async (resolve, reject) => {
            const sql = `INSERT INTO requests (url, query) VALUES (?,?)`
            const requestId = await new Promise((resolve, reject) => {
                this.db.run(sql, [`${method} ${url}`, JSON.stringify(query)], function(err) {
                    resolve(this.lastID)
                })
            })
            resolve(requestId)
        })
    }

    SaveRequestLog({id, date, event}) {
        return new Promise(async (resolve, reject) => {
            const sql = `INSERT INTO request_logs (url, date, event) VALUES (?,?,?)`
            await new Promise((resolve, reject) => {
                this.db.run(sql, [id, date, event], function(err) {
                    resolve()
                })
            })
            resolve()
        })
    }

    GetLogs() {
        const sql = `
            SELECT * FROM request_logs
            INNER JOIN requests ON request_logs.url = requests.id
        `
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, res) => {
                resolve(res)
            })
        })
    }
    GetStats() {
        const sql = `
            SELECT * FROM request_logs
            INNER JOIN requests ON request_logs.url = requests.id
        `
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                const result = rows.reduce((acc, r) => {
                    console.log(acc)
                    if(r.event == 'START') {
                        if(r.url in acc) {
                            acc[r.url] += 1
                        } else {
                            acc[r.url] = 1
                        }
                    }
                    return acc
                }, {})
                resolve(result)
            })
        })
    }
}

module.exports = LogDatabase