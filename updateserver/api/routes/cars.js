const router = require('express').Router();
const controller = require('../controllers/cars')
const validation = require('../validation/validate')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/', validation.dateFormat, controller.getCars);
router.get('/:Id',
// authn,
// authr.isAdmin,
// validation._Id, 
controller.getCarById);
router.get('/isArr/:bool', authn,authr.isAdmin, validation.bool, controller.getCarsArr);
router.get('/isSoled/:bool', authn,authr.isAdmin, validation.bool,controller.getCarsSoled);
router.get('/isSoled/:bool/tobalance/:string', controller.getCarsSoledLoan);
router.post('/', 
// authn,
// authr.isAdmin,
// validation.carPost,
controller.createCar);
router.patch('/:Id',authn,authr.isAdmin,validation._Id,validation.carUpdate, controller.updateCar);
router.delete('/:Id', authn,authr.isAdmin,validation._Id,controller.deleteCar);

module.exports = router
