const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require('multer');
const http = require('http');
const { Server } = require("socket.io");

const laborerRoute = require("./routes/laborerRoute");
const messageRoute = require("./routes/messageRoute");
const usersRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobsRoute");
const countryRoutes = require("./routes/countryRoute");
const ratingRoute = require("./routes/ratingRoute");
const jobRequestRoute = require("./routes/jobRequestRoute");
const userLaborerAppointmentsRoutes = require('./routes/appointmentRoute');
const db = require("./database/index");
const SocketServer = require("./socket/socketServer");
const upload = require("./middleware/multer")

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));



app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const file = req.file;
    console.log(file); // Log the file information

    // Assuming you want to update user information with the uploaded image path
    const userID = req.body.userID; // Get userID from the request body
    const imagePath = file.path; // Get the image path

    // Update the user's image in the database
    db.query('UPDATE users SET image = ? WHERE id = ?', [imagePath, userID], (err, result) => {
      if (err) {
        console.error('Error updating user image:', err);
        res.status(500).json({ error: 'Failed to update user image' });
        return;
      }
      res.status(200).json({ message: 'File uploaded and user image updated successfully', file: file });
    });
  } catch (err) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.use("/api/users", usersRoutes);
app.use("/api/rating", ratingRoute);
app.use("/api/job_requests", jobRequestRoute);
app.use("/api/jobs", jobRoutes);
app.use("/api/countries", countryRoutes);
app.use('/api/userLaborerAppointments', userLaborerAppointmentsRoutes);
app.use("/api/laborers", laborerRoute);
app.use("/api/messages", messageRoute);

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);
  socket.emit('message', 'Hello from the client!');
  SocketServer.socketServer(socket);
});

app.use((err, req, res, next) => {
  if (req.file) {
    deleteFile(req.file.path);
  } else if (req.files) {
    req.files.forEach(file => deleteFile(file.path));
  }

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred'
    }
  });
});

server.listen(port, () => {
  console.log(`Express app listening on port http://localhost:${port}`);
});

module.exports = app;
