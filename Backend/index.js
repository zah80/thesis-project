const express = require("express");
const cors = require("cors");
const laborerRoute=require("./routes/laborerRoute");
const usersRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobsRoute");
const countryRoutes = require("./routes/countryRoute");
const userLaborerAppointmentsRoutes = require('./routes/appointmentRoute');
const db = require("./database/index"); 
const path=require("path");

const app = express();
const port = 3000;
app.use(cors())

app.use(express.json())

const uploadsPath = path.join(__dirname,'./uploads');
app.use("/uploads",express.static(uploadsPath));
// Routes
app.use("/api/users", usersRoutes);

// app.use('/api/auth', authRoutes);

app.use("/api/rating", ratingRoute)

app.use("/api/job_requests", jobRequestRoute)






app.use("/api/laborers",laborerRoute);
app.use("/api/jobs", jobRoutes);
app.use("/api/countries", countryRoutes);

app.use('/api/userLaborerAppointments', userLaborerAppointmentsRoutes);

app.listen(port, () => {
  console.log(`Express app listening on port http://localhost:${port}`);
});

module.exports = app;
