import database from '../../database/mongodb-provider'
import mongooseLeanGetters from 'mongoose-lean-getters'


const ProdutoSchema = new database.Schema({
    descricao: { type: String, uppercase: true, required: [true, 'Descrição obrigatória!'] },
    ean: { type: String, uppercase: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    imagem: { type: String }
})

ProdutoSchema.index({ descricao: 1, ean: 1}, { unique: true })

ProdutoSchema.set('toJSON', {getters:true})

ProdutoSchema.plugin(mongooseLeanGetters)

const Produto = database.model('Produto', ProdutoSchema)

export default Produto