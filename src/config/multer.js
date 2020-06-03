import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import {trim} from 'lodash'
import MulterWebp from '../services/mutler-webp'
import MulterZipFile from '../services/multer-zip'

// ['image/png', 'image/jpg', 'image/jpeg']

export const multerPathsDest = {
    destProdutos: path.resolve(__dirname, '..', '..', 'tmp', 'upload-produtos'),
    destTabloides: path.resolve(__dirname, '..', '..', 'tmp', 'upload-tabloides'),
    destQrCode: path.resolve(__dirname, '..', '..', 'tmp', 'upload-qrcode')

}




export const multerConfigScreenShotQRCode = {

    dest: multerPathsDest.destQrCode,
    storage:multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, multerPathsDest.destQrCode)
        },
        filename: function (req, file, cb) {
            crypto.randomBytes(30, (err, hash) => {
                if(err)
                    return cb(err)

                let ext = file.mimetype.split('/')[1]

                cb(null, `${hash.toString('hex')}.${ext}`)
            })
          }

    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // 2m
    },
    fileFilter: (req, file, cb) => {

        const allowedMimes = ['image/webp', 'image/png', 'image/jpg', 'image/jpeg']

        if (allowedMimes.includes(file.mimetype))
            cb(null, true)
        else
            cb(new Error(`File Type error!`))
    }

}

export const multerConfigProdutos = {

    dest: multerPathsDest.destProdutos,
    storage: MulterZipFile({
        destination: (req, file, cb) => {
            cb(null, multerPathsDest.destProdutos)
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 * 10 // 2m
    },
    fileFilter: (req, file, cb) => {

        const allowedMimes = ['application/zip']

        if(allowedMimes.includes(file.mimetype))
            cb(null, true)
        else
            cb(new Error('File type error!'))
    }

}



export const multerConfigTabloide = {

    dest: multerPathsDest.destTabloides,
    storage:MulterWebp({
        destination: (req, file, cb) => {
            cb(null, multerPathsDest.destTabloides)
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // 2m
    },
    fileFilter: (req, file, cb) => {

        const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg']

        if (allowedMimes.includes(file.mimetype))
            cb(null, true)
        else
            cb(new Error(`File Type error!`))
    }

}