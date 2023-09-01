
import { Schema } from 'mongoose';

declare global {
    namespace Express {
        export interface Request {
            user: User;
            user_id:Schema.ObjectId;
            userAgent: string;
            IPAddress:String;
        }
    }
}
