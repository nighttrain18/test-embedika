const cache = require('memory-cache')

const memCache = new cache.Cache()
module.exports = cacheUrls => (req, res, next) => {
    const url = req.path
    if(cacheUrls.has(url)) {
        const cacheContent = memCache.get(url)
        if(cacheContent) {
            res.setHeader('Content-type', 'application/json')
            res.send(cacheContent)
            return
        }
        
        res.sendResponse = res.send
        res.send = body => {
            memCache.put(url, body)
            res.sendResponse(body)
        }
    }

    next()
}