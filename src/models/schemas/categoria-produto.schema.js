import database from '../../database/mongodb-provider'
import mongooseLeanGetters from 'mongoose-lean-getters'

const CategoriaProdutoSchema = new database.Schema({
    descricao: {
        type: String, 
        required:[true, 'Descrição obrigatória!'], 
        uppercase:true, 
        trim:true, 
        unique:true
    }
})

CategoriaProdutoSchema.index({descricao: 1}, {unique:true})

CategoriaProdutoSchema.set('toJSON', {getters:true})

CategoriaProdutoSchema.plugin(mongooseLeanGetters)

const CategoriaProduto = database.model('CategoriaProduto', CategoriaProdutoSchema)

export default CategoriaProduto