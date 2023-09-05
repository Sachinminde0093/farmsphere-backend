
import { Server } from "socket.io";
import RedisCon from "../../../redis.connection";
import UserService from "../../resources/user/user.service";
import ChatService from "./chat.service";

class SocketCon {

  private io: Server;
  private redis: RedisCon;
  private userService: UserService = new UserService();
  private chatService: ChatService = new ChatService();
  static i: number = 0;
  constructor(io: Server) {
    this.io = io;
    this.redis = RedisCon.getInstance();
    this.chat();
  }

  private chat() {

    this.io.on("connection", async (socket: any) => {

      // try {
      //   // add entries for userId and socketId in redis
      //   const data = socket.data;
      //   console.log(socket.id);
      //   await this.redis.set(data.user_id, socket.id );

      // } catch (error) {
      //     throw (error);
      // }
      
      socket.on('caht-box', async (data: any) => {
        this.io.emit('chat-box',data);
      })

      // socket.on('chat message', async (data: any) => {
      //   try {
      //     // // console.log(await this.redis.get(data.sid), data.sid);
      //     // // console.log(await this.redis.get(data.rid), data.rid);
      //     await this.saveMessage(data);
      //   } catch (error: any) {
      //     // console.log(error.message);
      //     // throw new Error(error.message)
      //   }
      // });

      socket.on('disconnect', async () => {
        try { 
          console.log(socket.id);
          // await this.redis.remove(socket.user._id);
        } catch (error: any) {
          throw new Error(error.message)

        }
      });

    });
  }

  private async saveMessage(data: any) {
    try {

      if (await this.userService.checkConnection(data.sid, data.rid) as boolean) {

        const conversation = await this.chatService.searchConversation(data.sid, data.rid);

        const msg = await this.chatService.saveMessage({
          conversationid: conversation.conversationid,
          senderuserid: data.sid,
          receiveruserid: data.rid,
          content: data.content,
        });

        const receiverSocketId = await this.redis.get(data.rid);

        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('chat message', data.content);
        } else {
          // console.log('offline');
        }
      } else {

        // console.log("connection not found");
      }

    } catch (error: any) {
      // console.log(error.message);
    }
  }


}

export default SocketCon;