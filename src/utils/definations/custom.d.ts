
import { Schema } from 'mongoose';

declare global {
    namespace Express {
        export interface Request {
            user: User;
            userId:Schema.ObjectId;
            userAgent: string;
            IPAddress:String;
        }
    }
}
