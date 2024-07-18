const express = require('express');
const router = express.Router();
const userLaborerAppointmentsController = require('../controllers/appointmentController');
const authMiddleWare=require("../middleware/auth")

router.post('/', userLaborerAppointmentsController.create);
router.get('/', userLaborerAppointmentsController.findAll);
router.get('/one', authMiddleWare("laborer"), userLaborerAppointmentsController.findOne);
router.put('/', userLaborerAppointmentsController.update);
router.put('/:id/isFinish', userLaborerAppointmentsController.updateIsFinish);
router.put('/:id/details', userLaborerAppointmentsController.updateDetails);
router.delete('/:id', userLaborerAppointmentsController.delete);

module.exports = router;