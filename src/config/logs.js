import { createLogger, format as winstonFormat, transports as winstonTransports } from 'winston'
import path from 'path'

const pathRelative = path.join(__dirname, '..','..','logs')

export function callbackLoggerIntialize(appName) {


    const logger = createLogger({
        level: 'info',
        format: winstonFormat.json(),
        defaultMeta: { service: appName },
        transports: [
            new winstonTransports.File({filename: `${pathRelative}/error_${appName}.log`, level:'error'}),
            new winstonTransports.File({filename: `${pathRelative}/combined_${appName}.log`})
        ]
    })


    if(process.env.NODE_ENV !== 'production')
        logger.add(new winstonTransports.Console({
            format: winstonFormat.json()
        }))


    return logger

}