require('dotenv').config();
const http = require('http');
const { Server }= require('socket.io');
const express = require('express');
const app = express();
const routes = require('./routes/routes');
const port = process.env.PORT;
const path = require('path');

const server = http.createServer(app);
const io = new Server(server)

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.use(express.json({limit : '30mb'}));
app.use(express.urlencoded({extended : true, limit : '30mb'}));
app.use(routes);



io.on('connection', (socket) => {
    console.log('user is connected', socket.id);

    //join room here
    socket.on('joinroom', (room) => {
        socket.join(room);
        // socket.to(room).emit("chatmessage", `User ${socket.id} joined ${room}`);
    })
    
    // socket.to(room).emit('message', message);
    
    socket.on('chatmessage', ({room, message, id}) => {
        // console.log(id);
        socket.to(room).emit("chatmessage", message, id);
    })

})


io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected.`);
    });
});



server.listen(port, () => {
    console.log(`Server is started on port ${port}`);
})
