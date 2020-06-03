import database from '../../database/mongodb-provider'
import mongooseLeanGetters from 'mongoose-lean-getters'


const CategoriaSchema = new database.Schema({
    descricao: {type: String, required:[true, 'Descrição obrigatória!'], uppercase:true, trim:true, unique:true}
}, {
    runSettersOnQuery: true
})

CategoriaSchema.index({descricao: 1}, {unique:true})

CategoriaSchema.set('toJSON', {getters:true})


CategoriaSchema.plugin(mongooseLeanGetters)
const Categoria = database.model('Categoria', CategoriaSchema)

export default Categoria