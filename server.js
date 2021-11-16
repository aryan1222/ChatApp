const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getUser, userLeave, getCurrentRoomUsers} = require('./utils/users');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const dotenv=require('dotenv'); 
// dotenv.config();

// set static folder 
app.use(express.static(path.join(__dirname, 'public')));

// on connection
io.on('connection', (socket) => {    
    socket.on('join-room', ({userName, room}) =>{

        const user = userJoin(socket.id, userName, room);

        // Join room
        socket.join(user.room);

        // Welcome Current User
        const msg = 'Welcome To ChatCord';
        socket.emit('message', formatMessage(user.userName, msg)); // msg displayed to self

        socket.on('chatMessage', (msg)=>{
            const message = msg;
            // console.log(message); 
            io.to(user.room).emit('message', formatMessage(user.userName,message));
        })

        // broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(user.userName,`${user.userName} joined the chat`)); // msg displayed to others except self

        // Get Room Info & Current Users in a Room info
            io.to(user.room).emit('info', {
                    room : user.room,
                    users : getCurrentRoomUsers(user.room)
                });

    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(user.userName,`${user.userName} left the chat`));

            io.to(user.room).emit('info', {
                    room : user.room,
                    users : getCurrentRoomUsers(user.room)
                });
        }
    });

    // msg displayed to all
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});