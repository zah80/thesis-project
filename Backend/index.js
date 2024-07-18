const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/users");
const db = require("./database/index"); // Ensuring this is only to initialize the connection
const path=require("path");
const laborerRoute=require("./routes/laborerRoute");
const messageRoute=require("./routes/messageRoute");
const app = express();
const http = require('http')
const {Server} = require("socket.io")
const port = 3000;
const SocketServer=require("./socket/socketServer");
const server = http.createServer(app)

app.use(cors())

app.use(express.json())

const uploadsPath = path.join(__dirname,'./uploads');
app.use("/uploads",express.static(uploadsPath));
// Routes
app.use("/api/users", usersRoutes);
// app.use('/api/auth', authRoutes);


const io = new Server(server,{
cors:{
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}
})
io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);
  socket.emit('message', 'Hello from the client!'); 
  SocketServer.socketServer(socket);
  
})




app.use("/api/laborers",laborerRoute);
app.use("/api",messageRoute);
server.listen(port, () => {
  console.log(`Express app listening on port http://localhost:${port}`);
});

module.exports = app;
