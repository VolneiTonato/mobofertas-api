import fs from 'fs'
import crypto from 'crypto'
import cheerio from 'cheerio'
import Unzipper from 'unzipper'
import { trim, upperCase, lowerCase, toLength } from 'lodash'
import axios from 'axios'

const headerValidos = ['PRODUTO', 'EAN', 'PRECO', 'PRECO_ANTERIOR', 'DATA_FIM', 'STATUS', 'IMAGEM']

const unzipData = (realPath, path, hash) => {


    return new Promise((resolve, reject) => {

        try {

            fs.createReadStream(realPath)

                .pipe(Unzipper.Parse())

                .on('entry', entry => {

                    if (/\.html$/ig.test(entry.path)) {

                        let nameFile = `${hash.toString('hex')}.html`

                        entry.pipe(fs.createWriteStream(`${path}/${nameFile}`))

                        resolve(nameFile)
                    } else {
                        entry.autodrain()
                    }
                })

        } catch (err) {
            reject(err)
        }

    })

}

const dowloadImageFromItens = (produtos) => {
    return new Promise(async (resolve, reject) => {
        try{

            for (let prod of produtos){

                try{
                    if(prod.IMAGEM && (prod.IMAGEM.length)){
                        let imagem = await axios.get(prod.IMAGEM, {
                            responseType:"arraybuffer"
                        })
                        
                    }
                }catch(err){
                    prod.IMAGEM = undefined
                }
            }
            resolve(produtos)
        }catch(err){
            reject(err)
        }
    }) 
}

const readDataHTML = (destination, fileNameHTML) => {
    return new Promise((resolve, reject) => {
        try {



            fs.readFile(`${destination}/${fileNameHTML}`, (err, data) => {

                if (err)
                    return reject(err)

                let htmlBuffer = data.toString()

                let $ = cheerio.load(htmlBuffer)

                let table = $('table').eq(0).find('tbody')

                let headers = []


                //header
                $(table).find('#0R0').closest('tr').find('td').each((idx, row) => {
                    let column = upperCase(trim($(row).text().replace(' ', '_')))

                    if (headerValidos.indexOf(column) !== -1) {
                        headers.push({ column: column, idx: idx, itens: [] })
                    }
                })

                let produtos = []

                $(table).find('tr').slice(2).each((idx, td) => {

                    let objAux = {}

                    $(td).find('td').each((idxTd, row) => {
                        let value = $(row).text()

                        headers.forEach(item => {
                            if (item.idx == idxTd){
                                if(item.idx === 6){
                                    let regex= new RegExp(/w\d{1,}-h\d{1,}$/ig)

                                    if($(row).find('a').length > 0){
                                        value = $(row).find('a').attr('href')
                                        
                                        if(regex.test(value))
                                            value = value.replace(/w\d{1,}-h\d{1,}$/, 'w1000-h1000')
                                    }

                                    else if($(row).find('img').length > 0){
                                        value = $(row).find('img').attr('src')
                                        if(regex.test(value))
                                            value = value.replace(/w\d{1,}-h\d{1,}$/, 'w1000-h1000')
                                    }
                                }
                                objAux[item.column] = value
                            }
                        })
                    })

                    produtos.push(objAux)
                })

                resolve(produtos)

            })
        } catch (err) {
            reject(err)
        }
    })
}


function getDestination(req, file, cb) {
    cb(null, '/dev/null')
}


function StorageServiceZIPFile(opts) {
    this.getDestination = (opts.destination || getDestination)
}

StorageServiceZIPFile.prototype._handleFile = function _handleFile(req, file, cb) {

    this.getDestination(req, file, function (err, path) {
        if (err) return cb(err)

        crypto.randomBytes(30, (err, hash) => {
            if (err) cb(err)

            const ext = /\.(zip)$/ig.exec(file.originalname).slice(0, 1).join().replace('.', '')

            const fileNew = `${hash.toString('hex')}.${ext}`

            const realPath = `${path}/${fileNew}`

            const outStream = fs.createWriteStream(realPath)

            file.stream.pipe(outStream)

            outStream.on('error', cb)

            outStream.on('finish', function () {

                new Promise(async (resolve, reject) => {

                    try {

                        let fileNewName = await unzipData(realPath, path, hash)

                        let produtos = await readDataHTML(path, fileNewName)

                        resolve({
                            destination: path,
                            path: realPath,
                            size: outStream.bytesWritten,
                            filename: `${fileNewName}`,
                            produtos: produtos
                        })


                    } catch (err) {
                        reject(err)
                    }

                }).catch(err => {
                    fs.unlink(path, (err, ok) => {
                        cb(err)
                    })

                })
                    .then(({ destination, path, size, filename, produtos }) => {

                        fs.unlink(path, (err, ok) => {
                            cb(null, { destination, size, filename, produtos })
                        })
                    })
            })

        })
    })
}

StorageServiceZIPFile.prototype._removeFile = function _removeFile(req, file, cb) {
    fs.unlink(file.path, cb)
}

module.exports = function (opts) {
    return new StorageServiceZIPFile(opts)
}