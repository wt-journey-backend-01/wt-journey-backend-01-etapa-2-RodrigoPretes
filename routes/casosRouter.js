const express = require('express')
const router = express.Router();
const casosController = require('../controllers/casosController');

router.get('/casos', casosController.getAllCasos);
router.get('/casos/:id', casosController.getCaseByID);
router.post('/casos', casosController.insertCase);
router.put('/casos/:id', casosController.updateCaseById);
router.patch('/casos/:id', casosController.patchCaseByID);
router.delete('/casos/:id', casosController.deleteCaseById);

module.exports = router