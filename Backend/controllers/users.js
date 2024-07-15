
const users = require('../models/users');
const bcrypt=require('bcrypt')
module.exports = {
  

  getAllUsers: function(req, res) {
    users.getAll(function(err, results) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    });
  }
}