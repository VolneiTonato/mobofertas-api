import EstabelecimentoRepository from '../models/repositories/estabelecimento'
import { validationResult, body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { dbQuery, redisClient } from '../database/redis-provider'

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30m" })
}

export const jwtIsValid = async (req, res, next) => {
    try{
        const {token} = req.body

        req.isLogado = false

        if (token === null) return next()

        let tokenData = await dbQuery.get(token)

        if (!tokenData)
            return next()

        jwt.verify(token, process.env.JWT_REFRESH, (err, user) => {
            if (err) return next()


            if(user.id)
                req.isLogado = true

            next()
        })

    }catch(err){
        return next()
    }
}

export const jwtRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.token



        if (refreshToken === null) return res.status(401).send()

        let tokenData = await dbQuery.get(refreshToken)

        if (!tokenData)
            return res.status(403).send()

        jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
            if (err) return res.status(403).send()

            let dateUser = new Date(user.createdAt)
            let currentDate = new Date()

            let timeMsDiffer = Math.abs(currentDate.getTime() - dateUser.getTime())
            let seconds = parseInt(timeMsDiffer / 1000)
            let minutes = parseInt(seconds / 60)
            //const dia = parseInt(Math.ceil(timeMsDiffer / (1000 * 3600 * 24)))

           
            if (minutes >= 60)
                dbQuery.delete(refreshToken).finally(ok => {
                    res.status(403).send()
                })

            
            const token = generateAccessToken({
                token: user.token,
                id: user.id,
                createdAt: user.createdAt
            })
            res.send({ token })
        })

    } catch (err) {
        next(err)
    }
}

export const jwtLogin = async (req, res, next) => {

    try {

        await body('email').isEmail().normalizeEmail().run(req)
        await body('cnpj').not().isEmpty().trim().run(req)
        await body('password').not().isEmpty().trim().escape().run(req)

        try {
            validationResult(req).throw()
        } catch (err) {
            if (Array.isArray(err?.errors)) {
                let data = err.errors.map(({ msg, param }) => {
                    return `${param} ${msg}`
                }).join('')

                throw data
            }

            throw err
        }

        const {
            email,
            cnpj,
            password
        } = req.body


        const user = await new EstabelecimentoRepository().login({ email, cnpj })

        if (!user)
            throw 'Usuário inválido!'

        let userAuth = {
            token: user.token,
            id: user._id,
            createdAt: new Date()
        }

        const token = generateAccessToken(userAuth)

        const refreshToken = jwt.sign(userAuth, process.env.JWT_REFRESH)

        let response = {
            token: token,
            refreshToken: refreshToken,
            user: {
                nome:user.nome,
                email: user.email,
                cnpj:user.cnpj
            }
        }

        await dbQuery.set(refreshToken, response, { time: '1', type: 'h' })

        res.send(response)

    } catch (err) {
        next(err)
    }
}