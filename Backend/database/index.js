const mysql = require("mysql2");
const mysqlConfig = require("./config");

const connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
  if (err) console.log("Error to connect to database", err);
  else console.log("My Database is connected!!");
});


module.exports=connection