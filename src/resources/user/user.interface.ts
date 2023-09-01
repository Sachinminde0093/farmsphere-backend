import { Document } from "mongoose";

export default interface User {
    user_id:string,
    email:string;
    user_name:string;
    // password:string;
    role:string,
	first_name:string,
	last_name:string,
}                       