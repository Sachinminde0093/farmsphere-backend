import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import authenticatedMiddleware from "../../middleware/authentication.middleware";
import ChatService from "./chat.service";
import HttpException from "../../utils/exceptions/http.exception";


class ChatController implements Controller {
    path: string = '/chat';
    router: Router = Router();

    private chatService:ChatService = new ChatService();

    constructor() {
        this.initialiseRoutes();
    }


    private initialiseRoutes() {
        this.router.get(`${this.path}/:id`, authenticatedMiddleware, this.getchat);
    }

    private getchat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const receiveruserid = req.params.id;
            const user_id = req.user_id;

            const chat = await this.chatService.getChat(user_id, receiveruserid);
            res.status(200).send(chat);
        } catch (error: any) {
            next(new HttpException(401, error.message));

        }
    }

}

export default ChatController;