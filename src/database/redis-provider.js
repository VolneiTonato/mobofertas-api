import redis from 'redis'
import redisConnect from 'connect-redis'
import { promisifyAll } from 'bluebird'
import { duration } from 'moment'

promisifyAll(redis)


const initRedis = redis.createClient({
    host: process.env.REDIS_DB,
    port: 6379,
    enable_offline_queue: false
})
/*
initRedis.auth(process.env.REDIS_DB_PW, () => {
    console.log('autenticate redis')
})*/

initRedis.on('error', (err) => {
    
})

export const redisClient = initRedis

export const redisConnectSession = (session) => {
    let initStore = redisConnect(session)

    return new initStore({ client: redisClient })
}

export const dbQuery = Object.freeze({

    delete: async (key) => {
        return await redisClient.del(key)
    },
    get: async (key) => {
        return await redisClient.getAsync(key)
    },
    set: async (key, value, expire = {time, type}) => {
        if (typeof value === 'object')
            await redisClient.set(key, JSON.stringify(value))
        else
            await redisClient.set(key, value)

        if(parseInt(expire?.time) > 0){
            await redisClient.pexpire(key, duration( parseInt(expire?.time), expire?.type || 'm').asMilliseconds())
        }

        return
        
    }

})