const JOI = require('@hapi/joi');



const registerValidation = (data)=>{
    const schema = {
        name:JOI.string().max(12).required(),
        email:JOI.string().min(6).required().email(),
        password: JOI.string().min(8).required()
    }
    return JOI.validate(data, schema);
}

const loginValidation = (data)=>{
    const schema = {
        email:JOI.string().min(6).required().email(),
        password: JOI.string().min(8).required()
    }
    return JOI.validate(data, schema);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;