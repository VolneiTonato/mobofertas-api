import database from '../../database/mongodb-provider'
import mongooseLeanGetters from 'mongoose-lean-getters'

const MunicipioSchema = new database.Schema({
    codigo: {type: Number, require:[true, 'Código do municipio obrigatório!']},
    descricao: { type: String, uppercase: true, required: [true, 'Descrição obrigatória!'] },
    estado: {
        codigo: {type: Number, require:[true, 'Código do estadado obrigatório!']},
        descricao: {type: String, uppercase:true, require:[true, 'Descrição do estado obrigatório.']},
        uf: {type:String, uppercase:true, require:[true, 'UF obrigatório']}
    }
})


MunicipioSchema.index({ descricao: 1, codigo: 1 }, { unique: true })


MunicipioSchema.set('toJSON', {getters:true})

MunicipioSchema.plugin(mongooseLeanGetters)

const Municipio = database.model('Municipio', MunicipioSchema)

export default Municipio