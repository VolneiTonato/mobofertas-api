import database from '../../database/mongodb-provider'
import mongooseLeanGetters from 'mongoose-lean-getters'


const CupomNFCESchema = new database.Schema({
    link: {type: String, required:[true, 'Link obrigatório!'], trim:true},
    imported: {type:Boolean, require:[true], default:false},
    createdAt: { type: Date, default: Date.now },
    estabelecimento: { type: database.ObjectId, ref: 'Estabelecimento', required: [true, 'Estabelecimento obrigatório para o produto!'] },
}, {
    runSettersOnQuery: true
})

CupomNFCESchema.index({link: 1, estabelecimento:1}, {unique:true})

CupomNFCESchema.set('toJSON', {getters:true})


CupomNFCESchema.plugin(mongooseLeanGetters)
const CupomNFCE = database.model('CupomNFCE', CupomNFCESchema)

export default CupomNFCE