const router = require('express').Router();
const controller = require('../controllers/balance');
const validation = require('../validation/validate')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/', authn, authr.isAdmin, validation.search, validation.dateFormat, controller.getBals);
router.get('/:Id', authn, authr.isAdmin, validation.search, validation.dateFormat, validation._Id, controller.getBalByID);
router.post('/', authn, authr.isAdmin, validation.history, controller.createBal);
router.patch('/:Id', authn, authr.isAdmin, validation.historyUpdate, controller.updateBal);
router.delete('/:Id', authn, authr.isAdmin, validation._Id, controller.deleteBal);

module.exports = router 
