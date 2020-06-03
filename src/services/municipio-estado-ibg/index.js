import MunicipioEstadoRepository from '../../models/repositories/municipioEstadoRepository'
import { trim, upperCase } from 'lodash'
import axios from 'axios'
import cheerio from 'cheerio'
import { readFile, writeFile, stat } from 'fs'
import PromiseHelper from '../../helpers/promise-helper'




const getData = async () => {
    return new Promise((resolve, reject) => {
        try {
            readFile(`${__dirname}/ibge.html`, async (err, body) => {
                if (err) {
                    let { data } = await axios.get('https://www.ibge.gov.br/explica/codigos-dos-municipios.php', {
                        responseType: "text"
                    })

                    writeFile(`${__dirname}/ibge.html`, data, (err, body) => {
                        if (err)
                            return reject(err)

                        return resolve(data)
                    })
                } else {
                    return resolve(Buffer.from(body, 'utf-8').toString())
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

const run = async () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await getData()

            let dataSchemas = await structHTML(data)

            let isSave = await saveDataBase(dataSchemas)

            return resolve(isSave)
        } catch (err) {
            reject(err)
        }
    })
}

const saveDataBase = (data) => {
    return new Promise(async (resolve, reject) => {
        try{

            let repository = new MunicipioEstadoRepository()

            for(let municipio of data){
                await repository.save(municipio)
                await PromiseHelper.sleep(100)
            }

            resolve(true)
        }catch(err){
            reject(err)
        }
    })
}

const municipiosMap = async (estados = [], structHTML) => {
    return new Promise(async (resolve, reject) => {
        try {

            let js = cheerio.load(structHTML)

            let data = []

            for(let estado of estados){
                js(`.container-uf #${estado.uf}`).closest('table').find('.codigos-list tr').each((idx, row) => {
                    data.push({
                        codigo: js(row).find('td').eq(1).text(),
                        uf: estado.uf,
                        descricao: upperCase(js(row).find('td').eq(0).text()),
                        estado: estado
                    })                        
                })
            }
            resolve(data)
        } catch (err) {
            reject(err)
        }
    })
}

const estadosMap = async (structHTML) => {

    return new Promise((resolve, reject) => {
        try {

            let js = cheerio.load(structHTML)

            let data = []

            js('table').eq(0).find('.codigos-list tr').each((idx, row) => {

                try {
                    data.push({
                        codigo: trim(js(row).find('td').eq(1).text().replace(/\D/ig, '')),
                        descricao: upperCase(trim(js(row).find('td').eq(0).text())),
                        uf: upperCase(trim(js(row).find('td').eq(1).find('a').attr('href').replace('#', '')))
                    })
                } catch (err) {
                    return reject(err)
                }

            })

            resolve(data)

        } catch (err) {
            reject(err)
        }
    })
}

const structHTML = async (html) => {
    return new Promise(async (resolve, reject) => {
        try {
            let js = cheerio.load(html)

            let structGeral = js('.container-codigos')

            let estados = await estadosMap(structGeral.html())

            let municipios = await municipiosMap(estados, structGeral.html())

            resolve(municipios)
        } catch (err) {
            reject(err)
        }
    })

}

export default async () => {

    return await run()

}