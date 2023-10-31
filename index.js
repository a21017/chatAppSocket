import { Server } from "socket.io";

const io = new Server({ cors:"*" });

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);


    socket.on("setOnline",(userId,userName)=>{

        !onlineUsers.some((user)=>user.userId===userId) &&
        onlineUsers.push({ userId,userName, socketId: socket.id })
        console.log("Online Users: ");
        onlineUsers.forEach((user)=>{
            console.log(user.userId)
        })

        
        io.emit("getOnlineUsers",onlineUsers);

    })


    socket.on('sendMessage',(message)=>{

        const {receiverId,text} = message;
        const receiver = onlineUsers.find((user)=>user.userId==receiverId);
        io.to(receiver.socketId).emit('getMessage',message);
        console.log(message,receiver,onlineUsers);
    })



    socket.on("disconnect",()=>{
        console.log(`Disconnected : ${socket.id}`);
        onlineUsers = onlineUsers.filter((user)=>user.socketId!==socket.id);
        io.emit("getOnlineUsers",onlineUsers);

    })

});




io.listen(4300);