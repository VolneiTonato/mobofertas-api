import { EventEmitter } from 'events'
import { callbackLoggerIntialize } from '../../config/logs'
import moment from 'moment'

const emitter = new EventEmitter({ captureRejections: true })

let Logger = null


export function initialize(nameApp) {
    Logger = callbackLoggerIntialize(nameApp)
}


const gravarLog = (type, ...data) => {
    try {
        if (Logger)
            Logger[type](data)
    } catch (err) {

    } finally {
        return
    }
}

emitter.on('critical', async (...value) => {
    gravarLog('error', {...value, TYPE:'CRITICAL', 'DATA': moment().format('DD/MM/YYY HH:mm:SS')})
})

emitter.on('error', async (...value) => {
    gravarLog('error', {...value, TYPE: 'ERROR', 'DATA': moment().format('DD/MM/YYY HH:mm:SS')})
})

emitter.on('info', async (...value) => {
    gravarLog('info', {...value, TYPE:'INFO', 'DATA': moment().format('DD/MM/YYY HH:mm:SS')})
})

export const Emitter = emitter