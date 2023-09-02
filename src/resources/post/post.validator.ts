import Joi from 'joi';

const create = Joi.object({

    title: Joi.string().required(),
    body:Joi.string().required(),
    type: Joi.string().valid('text', 'image', 'video').required(),
});

const preferences = Joi.object({

    post_id: Joi.string().required(),
    type: Joi.string().valid('image', 'video').required(),
    image_url:Joi.string().allow(null),
    video_url:Joi.string().allow(null)
    // preferences: Joi.object({
    //     image_url: Joi.string().when('type', {
    //         is: 'image',
    //         then: Joi.required(),
    //         otherwise: Joi.forbidden(),
    //     }),
    //     video_url: Joi.string().when('type', {
    //         is: 'video',
    //         then: Joi.required(),
    //         otherwise: Joi.forbidden(),
    //     }),
    // }).required(),
});

const getPost = Joi.object({
    limit:Joi.number().required(),
    page:Joi.number().required()
});

const comment = Joi.object({
    post_id:Joi.string().required(),
    // user_id:Joi.string().required(),
    content:Joi.string().required()
});

const likePost = Joi.object({
    post_id:Joi.string().required(),
    // user_id:Joi.string().required(),
});

const likeComment = Joi.object({
    // user_id:Joi.string().required(),
    comment_id:Joi.string().required(),
});

export default { create, preferences, getPost,comment, likePost, likeComment };



