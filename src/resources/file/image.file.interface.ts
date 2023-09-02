import { Url } from "url";

export default interface ImageFile{
    key:String;
    file_id?:string,
    post_id?:string;
    size?:Number;
    extension:String;
    order:number,
    // meta:Map<String, String>;
    // module:String,
    url:Url,
    type:String
}



