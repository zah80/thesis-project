const {
    createCountry,
    getAllCountries,
    getCountryById,
    getCountryByName,
    updateCountry,
    deleteCountry,
  } = require('../models/countryModel');
  
  const createCountryController = async (req, res) => {
    try {
      const countryID = await createCountry(req.body);
      res.status(201).json({ countryID });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getAllCountriesController = async (req, res) => {
    try {
      const countries = await getAllCountries();
      res.status(200).json(countries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getCountryByIdController = async (req, res) => {
    try {
      const country = await getCountryById(req.params.countryID);
      if (country) {
        res.status(200).json(country);
      } else {
        res.status(404).json({ message: 'Country not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getCountryByNameController = async (req, res) => {
    try {
      const country = await getCountryByName(req.params.countryName);
      if (country) {
        res.status(200).json(country);
      } else {
        res.status(404).json({ message: 'Country not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateCountryController = async (req, res) => {
    try {
      const result = await updateCountry(req.params.countryID, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteCountryController = async (req, res) => {
    try {
      await deleteCountry(req.params.countryID);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    createCountryController,
    getAllCountriesController,
    getCountryByIdController,
    getCountryByNameController,
    updateCountryController,
    deleteCountryController,
  };
  