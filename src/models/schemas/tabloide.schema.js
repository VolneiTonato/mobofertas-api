import database from '../../database/mongodb-provider'
import { uniq } from 'lodash'
import mongooseLeanGetters from 'mongoose-lean-getters'
import { Types } from 'mongoose'
import {validateDataValidade} from './midleware/validate'


const TabloideSchema = new database.Schema({
    createdAt: { type: Date, default: Date.now },
    estabelecimento: { type: Types.ObjectId, index: true, ref: 'Estabelecimento', required: [true, 'Estabelecimento obrigatório para o tabloide!'] },
    dataValidade: {
        type: Date, index: true, default: Date.now, required: true
    },
    imagem: {
        src: { type: String, required: [true, 'Imagem obrigatória'] },
        name: { type: String, require: [true, 'URL da imagem obrigatória'] }
    },
    status: { type: Boolean, default: true },
    step: { type: Number, require: [true, 'Step inválido'] }
})


TabloideSchema.pre('validate', async function (next) {
    try {

        next()

    } catch (err) {
        throw err

    }
})


TabloideSchema.pre('updateOne', async function (next) {

    validateDataValidade(TabloideSchema)

    next()
})


TabloideSchema.pre('save', async function (next) {
    //this.estabelecimentoId = database.Types.ObjectId(this.estabelecimentoId)
    next()
})

TabloideSchema.set('toJSON', { getters: true })


TabloideSchema.plugin(mongooseLeanGetters)

const Tabloide = database.model('Tabloide', TabloideSchema)

export default Tabloide