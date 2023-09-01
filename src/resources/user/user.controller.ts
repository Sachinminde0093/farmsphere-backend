import Controller from "../../utils/interfaces/controller.interface";
import { Request, Response, NextFunction, Router } from "express";
import Psql from "../../../psql";
import validationMiddleware from "../../middleware/validation.middleware";
import validator from "./user.validator";
import UserService from "./user.service";
import HttpException from "../../utils/exceptions/http.exception";
import authenticatedMiddleware from "../../middleware/authentication.middleware";

class UserController implements Controller {
    public path: string = "/user";
    public router: Router = Router();
    private client = Psql.getInstance().getClient();
    private userService = new UserService();


    constructor() {
        this.initialiseRoutes();
    }


    initialiseRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(validator.register), this.register);

        this.router.post(`${this.path}/login`, validationMiddleware(validator.login), this.login);

        this.router.get(`${this.path}`,authenticatedMiddleware, this.getUser);

    }


    private register = async (
        req: Request,
        res: Response,
        next: NextFunction): Promise<Response | void> => {
        try {

            const { email, password } = req.body;

            // const query = `INSERT INTO users (email, password)
            // VALUES ('${email}', '${password}');`

            // await this.client.query(query);

            const result = await this.userService.register(email, password);

            res.status(201).send(result);
        } catch (error) {
            console.error('Error creating table:', error);
        }

    }

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction): Promise<Response | void> => {
        try {

            const { email, password } = req.body;

            const data = await this.userService.login(email, password);

            res.status(200).send(data);

        } catch (error: any) {
            next(new HttpException(401, error.message));
        }

    }


    private getUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
           
            res.status(200).send(req.user);
        } catch (error) {
            
            console.error('Error creating table:', error);
        }
    };



}

export default UserController;

