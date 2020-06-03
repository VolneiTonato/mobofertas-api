import fs from 'fs'
import crypto from 'crypto'
import webpConverter from 'webp-converter'



function getDestination(req, file, cb) {
    cb(null, '/dev/null')
}


function StorageServiceTransformWebp(opts) {
    this.getDestination = (opts.destination || getDestination)
}


StorageServiceTransformWebp.prototype._handleFile = function _handleFile(req, file, cb) {

    this.getDestination(req, file, function (err, path) {
        if (err) return cb(err)



        crypto.randomBytes(30, (err, hash) => {
            if (err) cb(err)

            

            let ext = ''

            if(/\./ig.test(file.originalname))
                ext = /\.(png|jpg|jpeg|gif|webp)$/ig.exec(file.originalname).slice(0, 1).join().replace('.', '')
            else if(['image/jpeg', 'image/png', 'image/jpg', 'image/gif','image/webp'].indexOf(file.mimetype) !== -1){
                ext = file.mimetype.split('/')[1]
            }

            const fileNew = `${hash.toString('hex')}.${ext}`

            const realPath = `${path}/${fileNew}`

            const outStream = fs.createWriteStream(realPath)

            file.stream.pipe(outStream)

            outStream.on('error', cb)
            outStream.on('finish', function () {

                new Promise((resolve, reject) => {

                    if (ext == 'webp')
                        return resolve({
                            removeFile: false,
                            destination: path,
                            path: realPath,
                            size: outStream.bytesWritten,
                            filename: `${fileNew}`
                        })


                    crypto.randomBytes(30, (err, hash) => {
                        if (err) return reject(err)

                        const newName = hash.toString('hex')

                        webpConverter.cwebp(realPath, `${path}/${newName}.webp`, '-q 80 -quiet', (status, err) => {

                            if (err) return reject(err)


                            resolve({
                                removeFile: true,
                                destination: path,
                                path: realPath,
                                size: outStream.bytesWritten,
                                filename: `${newName}.webp`
                            })

                        })
                    })

                }).catch(err => {
                    fs.unlink(path, (err, ok) => {
                        cb(err)
                    })

                })
                    .then(({ destination, path, size, filename, removeFile }) => {

                        if (removeFile == true) {
                            fs.unlink(path, (err, ok) => {
                                cb(null, { destination, path, size, filename })
                            })
                        } else {
                            cb(null, { destination, path, size, filename })
                        }

                    })
            })

        })
    })
}

StorageServiceTransformWebp.prototype._removeFile = function _removeFile(req, file, cb) {
    fs.unlink(file.path, cb)
}

module.exports = function (opts) {
    return new StorageServiceTransformWebp(opts)
}