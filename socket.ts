
import { Server } from "socket.io";
import RedisCon from "./redis.connection";

class SocketCon {

    private io:Server;
    private redis:RedisCon;

    constructor(io:Server){

        this.io = io;
        this.redis = RedisCon.getInstance();
        this.io.on("connection", async (socket:any) => {

            
            // await this.redis.set(socket.user._id,socket.id);
            console.log(socket.user);
            socket.on('chat message', (msg:any) => {
              io.emit('chat message', msg);
            });
            
            socket.on('disconnect', async () => {
              console.log(socket.id);
          });
          
          });
    }

}

export default SocketCon;