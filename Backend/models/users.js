const conn = require('../database/index');

module.exports = {
  CheckLogin: function(email,password,callback){
    const sql =`SELECT * FROM users WHERE email = ? AND password = ?`
    conn.query(sql,[email,password],callback)
  },

  getAll: function(callback) {
    const sql = 'SELECT * FROM users';
    conn.query(sql, function(error, results) {
      callback(error, results);
    });
  }
}