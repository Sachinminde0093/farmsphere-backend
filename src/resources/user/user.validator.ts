import Joi from 'joi';

const register = Joi.object({

    // name: Joi.string().max(30).required(),

    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),

    // deviceId: Joi.string().required(),

    // deviceModel: Joi.string().required(),

    // deviceOs: Joi.string().required(),

    // messagingToken: Joi.string().required(),

    // appVersion: Joi.string().required(),
});

const login = Joi.object({
    
    email: Joi.string().required(),

    password: Joi.string().required(),

    // deviceId: Joi.string().required(),

    // deviceModel: Joi.string().required(),

    // deviceOs: Joi.string().required(),

    // messagingToken: Joi.string().required(),

    // appVersion: Joi.string().required(),
});

const friendRequest = Joi.object({
    receiverUserId:Joi.string().required(),
    relationShipType:Joi.number().required(),
});

const acceptReauest = Joi.object({
    receiverUserId:Joi.string().required()
    // relationshipid:Joi.string().required()
});

export default { register, login,friendRequest,acceptReauest };
// module.exports = { register, login };
