
import { Schema } from 'mongoose';

declare global {
    namespace Express {
        export interface Request {
            user: User;
            user_id:string;
            userAgent: string;
            IPAddress:String;
        }
    }
}
