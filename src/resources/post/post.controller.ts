import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import authenticatedMiddleware from "../../middleware/authentication.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import validator from './post.validator';
import HttpException from "../../utils/exceptions/http.exception";
import PostService from "./post.service";
import Post from "./interface/post.interface";

class PostController implements Controller {

    path: string = '/post';

    router: Router = Router();

    private postService = new PostService();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/create`, authenticatedMiddleware, validationMiddleware(validator.create), this.createPost);
        this.router.post(`${this.path}/preferences`, authenticatedMiddleware, validationMiddleware(validator.preferences), this.updatePreferences);
        this.router.post(`${this.path}`, authenticatedMiddleware, validationMiddleware(validator.getPost), this.getPost);
        this.router.post(`${this.path}/comment`, authenticatedMiddleware, validationMiddleware(validator.comment), this.createComment);
        this.router.get(`${this.path}/comment/:id`, authenticatedMiddleware, this.getPostComment);
        this.router.get(`${this.path}/like/:id`, authenticatedMiddleware, this.likePost);
        this.router.get(`${this.path}/comment/like/:id`, authenticatedMiddleware, this.likeComment);
    }

    private createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {

            await this.postService.createPost(req);
            res.status(201).send('post created succesfully');

        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    }

    private updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const url = await this.postService.updatePreferences(req);
            res.status(201).send({ data: 'post updated succesfully', url: url });
        } catch (error: any) {
            next(new HttpException(401, error.message));

        }
    }

    private getPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts: Post[] = await this.postService.getPost(req);
            res.status(200).send(posts);
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    }

    private createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.postService.createComment(req);
            res.status(201).send('comment created succesfully');

        } catch (error: any) {
            next(new HttpException(401, error.message));

        }
    }

    private getPostComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts: Comment[] = await this.postService.getPostComment(req);
            res.status(200).send(posts);
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    }

    private likePost = async (req: Request, res: Response, next: NextFunction) => {
        try {

            await this.postService.likePost(req);
            res.status(201).send('post like succesfully');
        } catch (error: any) {
            next(new HttpException(401, error.message));

        }
    }

    private likeComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.postService.likeComment(req);
            res.status(201).send('comment like succesfully');
        } catch (error: any) {
            next(new HttpException(401, error.message));
        }
    }

}

export default PostController;