import e, { Request, Response, NextFunction, Router } from "express";
import HttpException from "../../utils/exceptions/http.exception";
import Controller from "../../utils/interfaces/controller.interface";
import ImageFileService from "./file.service";
import authenticatedMiddleware from "../../middleware/authentication.middleware";


class FileController implements Controller {
    path: string = '/file';
    router: Router = Router();
    private fileService = new ImageFileService();
    constructor() {
        this.initialiseRoutes();
    }

    initialiseRoutes() {
        this.router.post(`${this.path}/generate-url`, authenticatedMiddleware, this.getUrl);
        this.router.get(`${this.path}/:id`, authenticatedMiddleware, this.getSignedUrl);
        this.router.post(`${this.path}/save`, authenticatedMiddleware, this.saveFile);
    }

    private getUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.fileService.generateUploadUrl(req);
            res.status(201).send(result);
        } catch (error: any) {
            next(new HttpException(401, error.message))
        }
    }

    private getSignedUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.fileService.generateStreamUrl(req);
            res.status(201).send(result);
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    }

    private saveFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.fileService.saveFile(req);
            res.status(201).send(result);
        } catch (error: any) {
            next(new HttpException(401, error.message))
        }
    }

    public getFileUrls = async (post_id: string): Promise<string[] | Error> => {
        try {
            // const { post_id } = req.body; 

            const result = await this.fileService.getFileUrls(post_id);
            // res.status(201).send(result);
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}

export default FileController;