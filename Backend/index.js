const express = require("express");
const cors = require('cors')
const db=require('./database/index')
const app = express();
const port = 3000;
const path=require("path");

const laborerRoute=require("./routes/laborerRoute");
app.use(cors())

app.use(express.json())

const uploadsPath = path.join(__dirname,'../uploads');
app.use("/upload",express.static(uploadsPath));

app.use("/api/laborers",laborerRoute);

app.listen(port, () => {
  console.log(`Express app listening on port http://localhost:${port}`);
});
module.exports=app;