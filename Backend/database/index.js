const mysql = require("mysql2");
const mysqlConfig = require("./config");

const connection = mysql.createPool(mysqlConfig);
const promisePool = connection.promise();
connection.getConnection((err) => {
  if (err) console.log("Error to connect to database", err);
  else console.log("My Database is connected!!");
});


module.exports=promisePool
