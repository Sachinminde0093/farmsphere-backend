export default interface Message {
    messageid?: string;
    conversationid: string;
    senderuserid: string;
    receiveruserid: string;
    content: string;
    createdat?: string;
}