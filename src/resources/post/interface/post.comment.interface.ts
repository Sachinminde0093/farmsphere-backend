export default interface PostComment{
    comment_id:string,
    post_id:string,
    user_id:string,
    content:string,
    createdat:Date,
    like_count:number
}