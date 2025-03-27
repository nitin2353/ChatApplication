const express = require('express');
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');
const ejs = require('ejs');
const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const io = new Server(server);
var newUid = " ";

io.on('connection', (socket) => {
    socket.on("new-message", (message) => {
    
        io.emit('user-message', message, socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('login.ejs')
})

app.get('/login', (req, res) => {
    newUid = req.query.name
    res.render('index.ejs');
})

server.listen(port, () => {
    console.log('Server is started at port', port);
})
