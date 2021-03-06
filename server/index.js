const express = require ('express');
const socketio = require('socket.io');
const http = require('http');

const {addUser,removeUser, getUser, getUsersInRoom}  = require('./users');
const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors:{
        origin:"*",
        methods: ["GET", "POST"]
    }
});

io.on('connection',(socket)=>{
    console.log('we have a new conection');

    socket.on('join',({name,room},callback)=>{
        const {error,user} = addUser({id:socket.id,name,room});
        if (error){
            return callback(error);
        }

        socket.emit('message',{user:'admin',text:`${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined`});

        socket.join(user.room);
        io.to(user.room).emit('roomData',{room:user.room, users:getUsersInRoom(user.room)});
        console.log("User has joined");
        callback();
    });

    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message',{user:user.name,text:message});
        callback();
    })

    socket.on('sendTyping',(data,callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('typing',{user:user.name});
        callback();
        console.log(user.name, " typing");
    })

    
    socket.on('disconnect',(callback)=>{
        console.log('user has left');
        const user = removeUser(socket.id);
        if (user){
            io.to(user.room).emit('message',{user:'admin',text:`User ${user.name} has left chat`});
            io.to(user.room).emit('roomData',{room:user.room, users:getUsersInRoom(user.room)});
        }
    });

    
})

app.use(router);

server.listen(PORT,()=>console.log('SERVER HAS STARTED'));

