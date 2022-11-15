const schema = require('./schema')
const mongoose = require('mongoose')

const carPost = schema.carSchemaPost
const _Id = schema._Id
const carUpdate = schema.carSchemaUpdate
const signup = schema.signup
const loging = schema.loging
const role = schema.userRole
const signupUpdate = schema.signupUpdate
const grant = schema.grantCar
const qarzPost = schema.qarzPost
const qarzUpdate = schema.qarzUpdate
const history = schema.history
const historyUpdate = schema.historyUpdate
const file_Id = schema.file_Id
const date = schema.date
const booleans = schema.booleans
const search = schema.search
const costPost = schema.costPost
const costUpdate = schema.costUpdate

exports.carPost = (req, res, next) => {

    const { error, value } = carPost.validate(req.body)

    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.carUpdate = (req, res, next) => {

    const { error, value } = carUpdate.validate(req.body)



    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports._Id = (req, res, next) => {
    var isValid = mongoose
        .Types
        .ObjectId
        .isValid(req.params.Id);
    const { error, value } = _Id.validate(req.params)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    if (!isValid)
        return res.status(400).json({ mssage: 'Bad Request' })

    next()
}

exports.signup = (req, res, next) => {


    const { error, value } = signup.validate(req.body)

    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.loging = (req, res, next) => {
    const { error, value } = loging.validate(req.body)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.role = (req, res, next) => {
    const { error, value } = role.validate(req.params)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.signupUpdate = (req, res, next) => {
    const { error, value } = signupUpdate.validate(req.body)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.grant = (req, res, next) => {

    const { error, value } = grant.validate(JSON.parse(req.params.grant))
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.qarzPost = (req, res, next) => {
    const { error, value } = qarzPost.validate(req.body)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.qarzUpdate = (req, res, next) => {
    const { error, value } = qarzUpdate.validate(req.body)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.history = (req, res, next) => {
    const { error, value } = history.validate(req.body)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}
exports.historyUpdate = (req, res, next) => {
    const { error, value } = historyUpdate.validate(req.body)
    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.file_Id = (req, res, next) => {

    const { error, value } = file_Id.validate(req.params)
    if (error)
        return res.status(400).json({
            mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}`
        })
    next()
}


exports.dateFormaT_Param = (req, res, next) => {

    const { error, value } = date.validate(req.params)

    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.dateFormat = (req, res, next) => {

    const { error, value } = date.validate({ sdate: req.query.sdate, edate: req.query.edate })

    if (error)
        return res.status(400).json({ mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}` })
    next()
}

exports.bool = (req, res, next) => {

    const { error, value } = booleans.validate(req.params)
    if (error)
        return res.status(400).json({
            mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}`
        })
    next()
}


exports.search = (req, res, next) => {
    const { error, value } = search.validate({ search: req.query.search })

    if (error)
        return res.status(400).json({
            mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}`
        })
    next()
}


exports.costUpdate = (req, res, next) => {
    const { error, value } = costUpdate.validate(req.body)
    if (error)
        return res.status(400).json({
            mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}`
        })
    next()
}

exports.costPost = (req, res, next) => {

    const { error, value } = costPost.validate(req.body)
    if (error)
        return res.status(400).json({
            mssage: 'Bad Request', error: `${error.details[0].context.label} ${error.message}`
        })
    next()
}

