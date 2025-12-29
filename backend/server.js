require('dotenv').config();

const express= require('express')
const app = express()

const http = require('http') //for using socket.io
const { Server } = require('socket.io')
const server = http.createServer(app) //creates a new socket io server instance
const io = new Server(server)

const jwt = require('jsonwebtoken')
const connectDB = require('./db')
connectDB()
const cors = require('cors');
app.use(cors());
//import routes before using them 
const authrouter = require('./routes/auth')


app.use(express.json())

app.use('/api/auth', authrouter)
const path = require('path');

app.use(express.static('frontend'));


//----------------------------------------------------------SOCKET.IO JWT AUTHENTICATION------------------------------------------
io.use((socket, next) => {
    const token = socket.handshake.auth.token; //token that client provides
    if (!token) return next(new Error('Authentication error'));
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payload.id;
        return next();

    }
    catch (err) {
        return next(new Error('Authentication error'))
    }
})





//-------------------------------------------------------------PTT logic-----------------------------------------------------------
let users = {};
let activespeaker = null;
let queue = [];

//A socket represents one connected client
//runs everytime a new user join, socket is  object representing each user's connection
io.on('connection', (socket) => {
    console.log('new user connected:', socket.id)

    //listen for event join
    socket.on('join', (username) => {
        users[socket.id] = username;
        console.log(`${username} joined the channel, user ID: ${socket.id}`);
    })

    socket.emit('joined', `welcome ${users[socket.id]}`)


    //Request to talk 
    socket.on('request_to_talk', (username) => {
        console.log(`${username} requested to talk`)

        if (!activespeaker) {
            activespeaker = socket.id;
            socket.emit('talk_granted');
            io.emit('active_speaker', username)
            console.log(`${username} is now speaking`)
        }
        else {
            queue.push(socket.id);
            socket.emit('queued', { position: queue.length })
            console.log(`${username} is at postion queue.length `)
        }
    })

    //end talk
    socket.on('end_talk', (username) => {

        if (socket.id !== activespeaker) return; //only active speaker can end its talk

        console.log(`${username} ended speaking`);
        activespeaker = null;
        if (queue.length > 0) {
            const nextSpeakerId = queue.shift();
            activespeaker = nextSpeakerId
            io.to(activespeaker).emit('talk_granted');
            io.emit('active_speaker', users[activespeaker]);
            console.log(`${users[activespeaker]} is now speaking`)
        }
        else {
            io.emit('active_speaker', null)
        }



    })
    //disconnect
    socket.on('disconnect', () => {
        const username = users[socket.id];
        console.log(`${username} is disconnected`);
        delete users[socket.id];
    })

})


const PORT= process.env.PORT || 3000;
//socket.io is connected to this server only ow express app will create its own
server.listen(  PORT , () => {
    console.log(`server is running on port ${PORT}...`);
})