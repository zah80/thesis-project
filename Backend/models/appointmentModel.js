const pool = require('../database/index');

const userLaborerAppointmentsModel = {
  create: async (appointment) => {
    const { userID, laborerID, price, timeFinish } = appointment;
    try {
      const [result] = await pool.query(
        `INSERT INTO user_laborer_appointments (userID, laborerID, price, timeFinish)
         VALUES (?, ?, ?, ?)`,
        [userID, laborerID, price, timeFinish]
      );
      return result;
    } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new Error('Foreign key constraint fails: invalid userID or laborerID');
      }
      throw err;
    }
  },

  findAll: async () => {
    try {
      const [rows] = await pool.query(`SELECT * FROM user_laborer_appointments`);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  findOne: async (laborerID) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM user_laborer_appointments WHERE laborerID = ? AND isFinish = false`,
        [laborerID]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },

  update: async (id, appointment) => {
    const { userID, laborerID, price, isFinish, timeStart, timeFinish } = appointment;
    try {
      const [result] = await pool.query(
        `UPDATE user_laborer_appointments SET userID = ?, laborerID = ?, price = ?, isFinish = ?, timeStart = ?, timeFinish = ?
         WHERE UserLaborerAppointmentsID = ?`,
        [userID, laborerID, price, isFinish, timeStart, timeFinish, id]
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  updateIsFinish: async (id) => {
    try {
      const [result] = await pool.query(
        `UPDATE user_laborer_appointments SET isFinish = true WHERE UserLaborerAppointmentsID = ?`,
        [id]
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  updateDetails: async (id, { price, timeFinish }) => {
    try {
      const [result] = await pool.query(
        `UPDATE user_laborer_appointments SET price = ? , timeFinish = ? WHERE UserLaborerAppointmentsID = ?`,
        [price, timeFinish, id]
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await pool.query(`DELETE FROM user_laborer_appointments WHERE UserLaborerAppointmentsID = ?`, [id]);
      return result;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = userLaborerAppointmentsModel;
