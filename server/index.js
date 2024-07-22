const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io")

app.use(cors())     // Peticiones cruzadas de un servidor a otro

const server = http.createServer(app)   // Permite crear el servidor

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(`Usuario actual: ${socket.id}`)

    socket.on("join_room", (data)=>{
        socket.join(data)
        console.log(`Usuario con id: ${socket.id} se unio a la sala: ${data}`)
    })

    socket.on("send_message", (data)=>{
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("disconnect", () => {
        console.log("Usuario Desconectado", socket.id)
    })
})

server.listen(3001, () => {
    console.log('Server Running')
})