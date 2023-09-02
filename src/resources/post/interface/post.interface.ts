export default interface Post {
    post_id:string,
    type:string,
    user_id:string,
    title:string,
    images:Array<String>,
    video_url:String,
    body:string,
    like_count:number,
    share_count:number,
    createdat:Date,
}