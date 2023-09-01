// import { Socket } from "socket.io"; 

// const io = Socket.on (http, {
//     cors: {
//       origin: "http://localhost:4000",
//       methods: ["GET", "POST"],
//     }
//   });

// class Chat {

//     constructor(){

//         io.on("connection", async (socket) => {

//             socket.join("some room");
          
//             socket.on('chat message', msg => {
//               console.log(msg);
//               io.emit('chat message', msg);
//             });
            
//             socket.on('disconnect', async () => {
//               console.log(socket.id);
//           });
          
//           });

//     }

// }