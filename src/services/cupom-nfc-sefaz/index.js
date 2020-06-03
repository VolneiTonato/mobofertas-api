import cheerio from 'cheerio'
import { BrowserNavigate } from '../selenium'
import EstabelecimentoRepository from '../../models/repositories/estabelecimento'
import PrecoRepository from '../../models/repositories/preco'
import CupomNFCeRepository from '../../models/repositories/cupomNFCe'
import { uniqBy } from 'lodash'


export default class CupomNFCeSefazService {

    constructor(link, idEstabelecimento, dataValidade) {

        return new Promise((resolve, reject) => {

            this._link = link
            this._idEstabelecimento = idEstabelecimento
            this._dataValidade = dataValidade

            this.run()
                .then(this.step1.bind(this))
                .then(this.step2.bind(this))
                .then(ok => {
                    resolve(true)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }


    async run() {

        try {

            return await BrowserNavigate(this._link)
            /*
            let driver = await SeleniumService.drive()

            await driver.get(this._link)

            return await driver.getPageSource()*/

        } catch (err) {
            throw new Error(err)
        }
    }

    async step1(content) {
        return new Promise(async (resolve, reject) => {
            try {

                const data = {}

                if (!content || (content.length == 0))
                    throw new Error('Não foi possível baixar dados do cupom')

                let $ = cheerio.load(content)

                const root = $('div#nfce table table table')

                $(root).find('tbody').eq(0).attr({ 'master': true })



                let dadosEmpresa = $(root).find('tbody tr').eq(0).find('.NFCCabecalho_SubTitulo1')

                let match = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/ig.exec($(dadosEmpresa).text())

                if (!match)
                    throw new Error('Não foi possível recuperar os dados do Cupom NFCE!')

                data.cnpj = match[0]

                data.itens = []



                let itemTbody = $(root).find('> tbody > tr table tbody').eq(6) //.find('table.NFCCabecalho')

                $(itemTbody).find('tr').map((idx, row) => {

                    if (idx > 0) {
                        let item = {
                            ean: $(row).find('td').eq(0).text(),
                            descricao: $(row).find('td').eq(1).text(),
                            precoAtual: $(row).find('td').eq(4).text(),
                            UN: $(row).find('td').eq(3).text(),
                            dataValidade: this._dataValidade
                        }

                        data.itens.push(item)
                    }
                })
                resolve(data)
            } catch (err) {
                reject(err)
            }
        })
    }

    async step2({ cnpj, itens }) {

        return new Promise(async (resolve, reject) => {
            try {

               //const estabelecimento = await new EstabelecimentoRepository().findOne({ _id: this._idEstabelecimento })

                /*

                if (estabelecimento.cnpj !== cnpj)
                    throw new Error('CNPJ do Cupom NFCe diferente do cnpj do estabelecimento!')*/

                itens = uniqBy(itens, 'descricao')

                const precoProdutoRepository = new PrecoRepository()

                for (let item of itens){
                    
                    try{
                        await precoProdutoRepository.saveByCupomNFCe(item, this._idEstabelecimento)
                    }catch(err){
                        
                    }finally{
                        await new Promise(resolve => setTimeout(resolve, 200))
                    }
                }


                await new CupomNFCeRepository().update({link: this._link}, {imported: true})


                resolve(true)

            } catch (err) {
                reject(err)
            }
        })
    }
}