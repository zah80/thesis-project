const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/users");
const db = require("./database/index"); // Ensuring this is only to initialize the connection
const path=require("path");

const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname,'../uploads');
app.use("/upload",express.static(uploadsPath));
// Routes
app.use("/api/users", usersRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Express app listening on port http://localhost:${port}`);
});

module.exports = app;
