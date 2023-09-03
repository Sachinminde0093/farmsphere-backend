const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
import * as serviceAccount from '../../../credentials/firebaseServiceAccountKey.json';
import Psql from '../../../psql';
import ImageFile from './image.file.interface';
import { Request } from 'express';
const { getDownloadURL } = require('firebase-admin/storage');

class ImageFileService {

    private client = Psql.getInstance().getClient();
    private static admin = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
    });

    private storageRef = ImageFileService.admin.storage().bucket(`gs://myhousehub-f2120.appspot.com`);

    public async generateUploadUrl(req: Request): Promise<ImageFile[] | Error> {

        try {

            const data = req.body;

            let result: ImageFile[] = new Array();

            for (let i = 0; i < data.length; i++) {
                const file = data[i];
                // // console.log(file);
                const options = {
                    version: 'v4',
                    action: 'write',
                    expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
                    contentType: `image/${file.extension}`,
                };
                const key = uuidv4();
                let url = await this.storageRef.file(`images/${key}${file.extension}`).getSignedUrl(options);
                result.push({
                    key: key,
                    //    name: data.path,
                    extension: file.extension,
                    order: file.order,
                    type: file.type,
                    url: url[0]
                }
                );

            }
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    public async generateStreamUrl(req: Request): Promise<string[] | Error> {

        try {

            const  post_id  = req.params.id;

            const query1 = `SELECT * from files where post_id = '${post_id}'`;

            const files: ImageFile[] = (await this.client.query(query1)).rows;
            const images: string[] = new Array<string>();

            for (let i = 0; i < files.length; i++) {
                const file: ImageFile = files[i];
                const fileRef = this.storageRef.file(`images/${file.key}${file.extension}`);
                const downloadURL = await getDownloadURL(fileRef);
                images.push(downloadURL);
                // console.log(downloadURL);
            }

            return images;
        } catch (error: any) {
            throw new Error(error.message);

        }
    }

    public async getFileUrls(post_id: string): Promise<string[] | Error> {
        try {

            const query1 = `SELECT * from files where post_id = '${post_id}'`;

            const files: ImageFile[] = (await this.client.query(query1)).rows;
            const images: string[] = new Array<string>();

            for (let i = 0; i < files.length; i++) {
                const file: ImageFile = files[i];
                const fileRef = this.storageRef.file(`images/${file.key}${file.extension}`);
                const downloadURL = await getDownloadURL(fileRef);
                images.push(downloadURL);
                // console.log(downloadURL);
            }

            return images;
        } catch (error: any) {
            throw new Error(error.message);

        }
    }


    public async saveFile(req: Request): Promise<boolean | Error> {

        try {

            const { post_id, file } = req.body;
            // // console.log(file);
            const query1 = `SELECT * from posts where post_id = '${post_id}'`;

            const res = (await this.client.query(query1)).rows[0];

            if (!res) {
                throw new Error('Post not found');
            }

            const query = `INSERT INTO files (post_id,key,extension,type,order_no) VALUES ('${post_id}', '${file.key}','${file.extension}','${file.type}','${file.order}');`;
            await this.client.query(query);

            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }


}

export default ImageFileService;