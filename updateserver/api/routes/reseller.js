const router = require('express').Router();
const controller = require('../controllers/reseller');
const validation = require('../validation/validate');
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')


router.get('/:Id', authn,authr.isReseller,validation._Id, validation.dateFormat, validation.search,controller.getCars); 
router.get('/details/:Id', authn,authr.isReseller,validation._Id,controller.getRCarById);
router.patch('/:grant',authn,authr.isAdmin,validation.grant, controller.updateCar);
router.delete('/:Id', authn,authr.isAdmin,validation._Id,controller.deleteCar);
 
module.exports = router
 