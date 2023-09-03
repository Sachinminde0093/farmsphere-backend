import Psql from "../../../psql";
import { Request } from "express";
import Post from "./interface/post.interface";
import ImageFileService from "../file/file.service";
import FileController from "../../resources/file/file.controller";
class PostService {

    private client = Psql.getInstance().getClient();
    private fileController:FileController = new FileController();

    public async createPost(req: Request): Promise<void> {
        try {

            const { title, body, type } = req.body;

            const user_id = req.user_id;

            const query = `INSERT INTO posts (user_id,title, body, type) VALUES ('${user_id}','${title}','${body}','${type}')`;

            await this.client.query(query).then(
                (data) => {
                    // // console.log(data);
                }).catch((err) => {
                    // console.log(err);
                    throw new Error(err.message);
                });

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async updatePreferences(req: Request): Promise<void> {
        try {


            const { post_id, type, image_url, video_url } = req.body;

            const query1 = `SELECT * from posts where post_id = '${post_id}'`;
            const res = (await this.client.query(query1)).rows[0];


            // // console.log(res);
            if (res) {
                let query2;
                if (type == 'image') {
                    query2 = `UPDATE posts SET image_url = '${image_url}' WHERE post_id = '${post_id}'`
                } else {
                    query2 = `UPDATE posts SET video_url = '${video_url}' WHERE post_id = '${post_id}'`
                }
                await this.client.query(query2).catch((err) => {
                    throw new Error("unable to update Post ");
                });

            } else {
                throw new Error("Post not found");

            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getPost(req: Request): Promise<Post[]> {
        try {
            const query = `SELECT * from posts`;

           let posts =  (await this.client.query<Post>(query)).rows;

            for(let i = 0; i<posts.length; i++){
                const post = posts[i];
                const images = await this.fileController.getFileUrls(post.post_id);
                posts[i].images = images as string[];
            }
            return posts;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createComment(req: Request): Promise<void> {
        try {

            const { post_id, content } = req.body;
            const user_id = req.user_id;
            const query1 = `SELECT * from posts where post_id = '${post_id}'`;

            const res = (await this.client.query(query1)).rows[0];
            if (res) {

                const query = `INSERT INTO comments (post_id,user_id,content) 
                    VALUES ( '${post_id}','${user_id}','${content}');`;

                await this.client.query(query);
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getPostComment(req: Request): Promise<Comment[]> {
        try {
            const  post_id   = req.params.id;

            const query = `SELECT * from comments WHERE post_id = '${post_id}';`;

            return (await this.client.query<Comment>(query)).rows;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async likePost(req: Request): Promise<void> {
        try {
            const  post_id   = req.params.id;
            const user_id = req.user_id;
            const query1 = `SELECT * from posts where post_id = '${post_id}'`;

            const res = (await this.client.query(query1)).rows[0];
            if (res) {

                const query3 = `SELECT * FROM likes
                    WHERE post_id = '${post_id}' AND user_id = '${user_id}';
                    `
                const like = (await this.client.query(query3)).rows[0];

                if (!like) {
                    const query = `INSERT INTO likes (post_id,user_id) 
                    VALUES ( '${post_id}','${user_id}');`;

                    await this.client.query(query);
                }
            } else {
                throw new Error("Post not found");

            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async likeComment(req: Request): Promise<void> {
        try {

            const  comment_id   = req.params.id;

            const user_id = req.user_id;
            const query1 = `SELECT * from comments where comment_id = '${comment_id}'`;

            const res = (await this.client.query(query1)).rows[0];
            if (res) {
                const query3 = `SELECT * FROM likes
                    WHERE comment_id = '${comment_id}' AND user_id = '${user_id}';
                    `
                const like = (await this.client.query(query3)).rows[0];
                if (!like) {
                    const query = `INSERT INTO likes (comment_id,user_id) 
                    VALUES ( '${comment_id}','${user_id}');`;

                    await this.client.query(query);
                }
            } else {
                throw new Error('comment not found');

            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }


}

export default PostService;