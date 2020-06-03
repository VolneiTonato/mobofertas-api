import webpConverter from 'webp-converter'
import { writeFile, unlink } from 'fs'


export const WriteFileAndTransformImageWebHelper = async (param = { content, isDeleteFileOld, pathImg, ext, fileName }) => {

    return new Promise((resolve, reject) => {

        try {

            new Promise((resolve, reject) => {

                writeFile(`${param.pathImg}/${param.fileName}.${param.ext}`, param.content, async (err, body) => {
                    if (err)
                        return reject(err)


                    await TransformImagemWebpHelper({
                        pathImg: param.pathImg,
                        ext: param.ext,
                        fileName: param.fileName
                    }).catch(err => reject(err))

                    return resolve(true)
                })
            }).then(ok => {

                if (param.isDeleteFileOld === true)
                    unlink(`${param.pathImg}/${param.fileName}.${param.ext}`, (err, body) => {
                        return resolve(true)
                    })
                else
                    return resolve(true)

            }).catch(err => {
                return reject(err)
            })

        } catch (err) {
            return reject(err)
        }
    })
}

export const TransformImagemWebpHelper = async (param = { ext, fileName, pathImg }) => {

    return new Promise((resolve, reject) => {
        try {

            let ext = ''

            if (param.ext)
                ext = `.${param.ext}`

            
            
            webpConverter.cwebp(`${param.pathImg}/${param.fileName}${ext}`, `${param.pathImg}/${param.fileName}.webp`, '-q 80 -quiet', (status, err) => {
                try {

                    if (err)
                        return reject(err)

                    if (status == 101)
                        return reject('Failed convert image to webp')

                    resolve(true)
                } catch (err) {
                    reject(err)
                }


            })
        } catch (err) {
            reject(err)
        }
    })






}

export default TransformImagemWebpHelper