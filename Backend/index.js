const express = require("express");
const cors = require('cors')
const db=require('./database/index')
const app = express();
const port = 3000;



app.use(cors())

app.use(express.json())
// app.use(express.urlencoded({extended:time}))




app.listen(port, () => {
  console.log(`Express app listening on port http://localhost:${port}`);
});
module.exports=app;