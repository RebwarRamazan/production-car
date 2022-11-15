const router = require('express').Router();
// const controller = require('../controllers/cars')
const validation = require('../validation/validate')
const controller = require('../controllers/costs')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/', authn, authr.isAdmin, validation.search, validation.dateFormat, controller.getCosts);
router.get('/:sdate/:edate', authn, authr.isAdmin, validation.search, validation.dateFormaT_Param, controller.getbyDate);
router.post('/', authn, authr.isAdmin, validation.costPost, controller.createCost);
router.patch('/:Id', authn, authr.isAdmin, validation._Id, validation.costUpdate, controller.updateCost);
router.delete('/:Id', authn, authr.isAdmin, validation._Id, controller.deleteCost);

module.exports = router  