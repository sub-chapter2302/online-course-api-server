/*require('dotenv').config()
const redis = require('redis')

const redis_client = redis.createClient(process.env.PORT_REDIS)

const checkCache = (id, callback) => {
    redis_client.get(id, (err, data) => {
        if (err) throw err
        console.log('Check Cache: ', data)
        callback(data)
    })
}

const setExCache = data => {
    console.log('setting...', data)
    redis_client.setex(data.id, 3600, JSON.stringify(data))
}

module.exports = { checkCache, setExCache }*/