const userLaborerAppointmentsModel = require('../models/appointmentModel');

exports.create = async (req, res) => {
    try {
      const result = await userLaborerAppointmentsModel.create(req.body);
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
      if (err.message.includes('Foreign key constraint fails')) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  };

exports.findAll = async (req, res) => {
  try {
    const appointments = await userLaborerAppointmentsModel.findAll();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
    try {
      const laborerId = req.body.laborerID; 
      console.log("laborer is ",laborerId);
      const appointments = await userLaborerAppointmentsModel.findOne(laborerId);
      console.log("log appointment ",appointments);
      if (appointments.length >= 0) {
        res.status(200).json(appointments);
      } else {
        res.status(404).json({ message: 'No appointments found' });
      }
    } catch (err) {
        console.log("message",err);
      res.status(500).json({ message: err });
    }
  };

exports.update = async (req, res) => {
  try {
    const result = await userLaborerAppointmentsModel.update(req.params.id, req.body);
    if (result.affectedRows) {
      res.status(200).json({ id: req.params.id, ...req.body });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (err) {
    
    res.status(500).json({ message: err });
  }
};

exports.updateIsFinish = async (req, res) => {
  try {
   console.log("id",req.params.id);
    const result = await userLaborerAppointmentsModel.updateIsFinish(req.params.id);
    if (result.affectedRows) {
      res.status(200).json({ id: req.params.id, isFinish: req.body.isFinish });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDetails = async (req, res) => {
  console.log("req body",req.body);
  console.log("id",req.params.id);
  console.log("type",typeof req.body.price);
  console.log("type",typeof req.body.timeFinish);
  try {
    const result = await userLaborerAppointmentsModel.updateDetails(req.params.id, req.body);
    if (result.affectedRows) {
      res.status(200).json({ id: req.params.id, ...req.body });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await userLaborerAppointmentsModel.delete(req.params.id);
    if (result.affectedRows) {
      res.status(200).json({ message: 'Appointment deleted' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
