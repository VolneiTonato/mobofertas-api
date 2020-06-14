import database from '../../database/mongodb-provider'
import RandomMongoose from 'mongoose-simple-random'
import {uniq} from 'lodash'
import MongooseLeanGetters from 'mongoose-lean-getters'
import { Types } from 'mongoose'
import {numberFormat, cdbl} from '../../helpers/number-helper'
import {validateDataValidade} from './midleware/validate'


const PrecoSchema = new database.Schema({
    createdAt: { type: Date, default: Date.now },
    descricao: { type: String, uppercase: true, required: [true, 'Descrição obrigatória!'] },
    ean: [Number],
    dataValidade: {
        type: Date, required: [true, 'Data de validade obrigatória!']
    },
    precoAnterior: {
        type: database.Decimal128, 
        default: 0.00,
        required: false,
        set:function(value){
            value =  numberFormat(value)
            if(cdbl(value))
                return value
            return 0.00
        },
        get:function(precoAnterior){
            return precoAnterior.toString()
        }
    },

    precoAtual: { 
        type: database.Decimal128, 
        default: 0.00, 
        required: true,
        set:function(value){
            value = numberFormat(value)
            if(cdbl(value))
                return value

            return null
        },
        get:function(precoAtual){
            return precoAtual.toString()
        }
    },
    estabelecimento: { type: database.ObjectId, ref: 'Estabelecimento', required: [true, 'Estabelecimento obrigatório para o produto!'] },
    imagem: { type: String },
    status: {type:Boolean, default:true},
    categorias: [
        {  type: database.ObjectId, trim: true, required: [true, 'Categoria Obrigatória!'], ref: 'CategoriaProduto' }
    ]
})


PrecoSchema.index({ descricao: 1, estabelecimento: 1 }, { unique: true })

PrecoSchema.pre('validate', async function (next) {
    try {

        this.categorias = ['5e96187261cb0f068be27df3']
        
        validateArrayObject(this.categorias, 'Categoria Obrigatória!')
        
        next()

    } catch (err) {
        throw err

    }
})

PrecoSchema.pre('update', async function (next) {
    if(this.estabelecimento?._id)
        this.estabelecimento = database.Types.ObjectId(this.estabelecimento._id)

    validateDataValidade(PrecoSchema)

    next()
})

PrecoSchema.pre('save', async function (next) {
    this.estabelecimento = Types.ObjectId(this.estabelecimento)
    
    next()
})

PrecoSchema.set('toJSON', {getters:true})

const validateArrayObject = (data, messageError) => {
    try{
        if (!Array.isArray(data))
            throw messageError

        if (!data.length > 0)
            throw messageError

    }catch(err){
        throw err
    }
}


PrecoSchema.plugin(MongooseLeanGetters)


const Preco = database.model('Preco', PrecoSchema)

Preco.aggregate([{$sample: {size:3}}])

export default Preco