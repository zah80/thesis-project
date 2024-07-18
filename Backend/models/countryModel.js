const conn = require('../database/index');

const createCountry = async (country) => {
  const sql = 'INSERT INTO `countrys` SET ?';
  const [result] = await conn.query(sql, [country]);
  return result.insertId;
};

const getAllCountries = async () => {
  const sql = 'SELECT * FROM `countrys`';
  const [result] = await conn.query(sql);
  return result;
};

const getCountryById = async (countryID) => {
  const sql = 'SELECT * FROM `countrys` WHERE countryID = ?';
  const [result] = await conn.query(sql, [countryID]);
  return result.length ? result[0] : null;
};

const getCountryByName = async (countryName) => {
  const sql = 'SELECT * FROM `countrys` WHERE countryName = ?';
  const [result] = await conn.query(sql, [countryName]);
  return result.length ? result[0] : null;
};

const updateCountry = async (countryID, country) => {
  const sql = 'UPDATE `countrys` SET ? WHERE countryID = ?';
  const [result] = await conn.query(sql, [country, countryID]);
  return result;
};

const deleteCountry = async (countryID) => {
  const sql = 'DELETE FROM `countrys` WHERE countryID = ?';
  const [result] = await conn.query(sql, [countryID]);
  return result;
};

module.exports = {
  createCountry,
  getAllCountries,
  getCountryById,
  getCountryByName,
  updateCountry,
  deleteCountry,
};
