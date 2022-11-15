const router = require('express').Router();
const helper = require('../helper/deleteFile');
const validation = require('../validation/validate')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.delete('/:Id',authn,authr.isAdmin,validation.file_Id, helper.deleteimg)

module.exports = router 