import database from '../../database/mongodb-provider'
import bcrypt from 'bcryptjs'
import { Types, VirtualType } from 'mongoose'
import mongooseLeanGetters from 'mongoose-lean-getters'
import uniqueKey from 'unique-key'



const EstabelecimentoSchema = new database.Schema({
    nome: { type: String, required: [true, 'Nome obrigatório!'] },
    totalPostagem: { type: Number, required: [true, 'Total de postagem obrigatório!'] },
    cnpj: { type: String, require: [true, 'CNPJ obrigatório!'] },
    password: { type: String, selected: false },
    createdAt: { type: Date, default: Date.now },
    email: { type: String, lowercase: true, required: true, index: true, unique: false },
    status: { type: Boolean, default: true },
    dataValidade: {type:Date, required: [true, 'Data de validade obrigatório!']},
    avatar: {
        type: String,
        required: true
    },
    confirmed: {type: Boolean, default: false},
    categoria: { type: Types.ObjectId, required: [true, 'Categoria obrigatória!'], index: true, ref: 'Categoria' },
    endereco: {
        logradouro: { type: String, required: [true, 'Logradouro obrigatório!'] },
        bairro: { type: String, required: [true, 'Bairro obrigatório!'] },
        numero: { type: String, required: [true, 'Número obrigatório!'] },
        cep: { type: String, required: [true, 'CEP obrigatório!'] },
        municipio: { type: Types.ObjectId, required: [true, 'Município obrigatório!'], index: true, ref: 'Municipio' },
        complementoCurtoAjuda: { type: String, required: false, trim: true, uppercase: true },
        lat: { type: String, default: 0 },
        lng: { type: String, default: 0 },
        linkMaps: { type: String, default: '' },
        imagem: { type: String, default: '' }
    },
    telefones: [
        { numero: { type: String, tipo: String, required: [true, 'Telefone Obrigatório'] } },
    ]


})


EstabelecimentoSchema.index({ nome: 1, cnpj: 1 }, { unique: true })

EstabelecimentoSchema.pre('save', function (next) {

    try {
        let token = uniqueKey({
            size: 8,
            prefix: 'pw_',
            charType: 'numeric',
            transform: 'lower'
        })

        EstabelecimentoSchema.virtual('passwordText')
            .set(token)

        this.passwordText = token

        bcrypt.genSalt(10, async (err, salt) => {
            if (err)
                return next(err)

                

            this.password = await bcrypt.hash(this.passwordText, salt)

            next()
        })
    } catch (err) {
        next(err)
    }
})


EstabelecimentoSchema.methods.comparePassword = async function (passwordCompare) {
    try {
        return await bcrypt.compare(passwordCompare, this.password)
    } catch (err) {
        return false
    }
}


EstabelecimentoSchema.pre('update', async function (next) {

    if (this.endereco.municipio?._id)
        this.endereco.municipio = Types.ObjectId(this.endereco.municipio._id)

    next()
})




EstabelecimentoSchema.set('toJSON', { getters: true })

EstabelecimentoSchema.plugin(mongooseLeanGetters)

const Estabelecimento = database.model('Estabelecimento', EstabelecimentoSchema)

export default Estabelecimento