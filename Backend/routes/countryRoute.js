const express = require("express");
const {
  createCountryController,
  getAllCountriesController,
  getCountryByIdController,
  getCountryByNameController,
  updateCountryController,
  deleteCountryController,
} = require("../controllers/countryController");

const router = express.Router();

router.post("/", createCountryController);
router.get("/", getAllCountriesController);
router.get("/:countryID", getCountryByIdController);
router.get("/name/:countryName", getCountryByNameController);
router.put("/:countryID", updateCountryController);
router.delete("/:countryID", deleteCountryController);

module.exports = router;
