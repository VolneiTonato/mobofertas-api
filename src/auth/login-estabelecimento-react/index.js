import { Router } from 'express'
import { jwtLogin, jwtRefreshToken, jwtIsValid} from '../jwt-config'
import { dbQuery } from '../../database/redis-provider'

module.exports = (app) => {

    const router = Router()

    router.delete('/logout', async (req, res, next) =>{
        try{
            const {token} = req.body

            await dbQuery.delete(token)

            res.status(204).send()
        }catch(err){
            next({status: 403, message: err})
        }
    })

    router.post('/islogado', jwtIsValid, (req, res, next) => {
        try{
            
            return res.send({isLogado: Boolean(req.isLogado)})

        }catch(err){
            next({status: 403, message: err, isLogado: false})
        }
    })

    router.post('/token', jwtRefreshToken, (err, req, res, next) => {
        try{
            if(err)
                throw err

            req.status(403).send({isLogado:false})

        }catch(err){
            next({status: 403, message: err, isLogado: false})
        }
    })

    router.post('/login', jwtLogin ,(err, req, res, next) => {

        try {
            

            if(err)
                throw err
            
            req.status(403).send({isLogado:false})
            
        } catch (err) {
            next({status: 403, message: err, isLogado: false})
        }

    })




    app.use('/auth/estabelecimento', router)
}
