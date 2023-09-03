import Psql from "../../../psql";
import Conversation from "./interface/conversation.interface";
import Message from "./interface/message.interface";

class ChatService {

    private client = Psql.getInstance().getClient();


    public async saveMessage(msg:Message):Promise<Message>{
        try {

            const query = `INSERT INTO messages (conversationid, senderuserid, receiveruserid, content) VALUES ('${msg.conversationid}','${msg.senderuserid}','${msg.receiveruserid}','${msg.content}') RETURNING *;`;

            const data =  (await this.client.query<Message>(query)).rows[0];

            return data;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }

    public async getChat(sid:string,rid:string):Promise<Message[]>{
        try {

            const query = `SELECT * FROM messages WHERE senderuserid = '${sid}' AND receiveruserid = '${rid}'`;

            const data =  (await this.client.query<Message>(query)).rows;
            return data;
        } catch (error:any) {
            throw new Error(error.message);
        }
    }



    public async crearteConversation(user1:string,user2:string):Promise<Conversation>{
        try {
       
        
            const query = `INSERT INTO conversations (user1id, user2id) VALUES ('${user1}','${user2}') RETURNING *;`;

            const data =  (await this.client.query<Conversation>(query)).rows[0];
          
            return data;
        } catch (error:any) {
            throw new Error(error.message);
        }


    }

    public async searchConversation(user1:string,user2:string):Promise<Conversation>{
        try {
            
            const query: string = `SELECT * FROM conversations
             WHERE (user1id = '${user1}' AND user2id = '${user2}') OR (user1id = '${user2}' AND user2id = '${user1}') LIMIT 1`;

            const res: Conversation = (await this.client.query<Conversation>(query)).rows[0];
           
            if(res){
                return res
            }
            
            return await this.crearteConversation(user1, user2);
        } catch (error:any) {

            throw new Error(error.message);

        }
    }

}

export default ChatService;