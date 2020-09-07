const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/User')
const {registerValidation , loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken'); 

router.use(bodyParser.json());

// =========VALIDATION=========
const JOI = require('@hapi/joi');
const schema = {
    name:JOI.string().max(12).required(),
    email:JOI.string().min(6).required().email(),
    password: JOI.string().min(8).required()
}



//===============+ROUTES===================
router.get('/', (req,res)=>{
    res.json({message:"GET request"})
    
})

router.post('/register', async (req, res)=>{
    res.setHeader("Content-Type", "application/json")
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

//cheaking user is already is database or not
    const emailExists = await User.findOne({email:req.body.email});

    if(emailExists) return res.status(400).send("User already exists");


//=================hashing the password with bcrypt====================
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password , salt)



    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });
   const saveUser = await user.save();
   try{
       res.json(saveUser);
   }catch(err){
       res.status(400).send(err);
   }

});

//==================Login Route============

router.post('/login', async (req,res)=>{
    const {error} =  loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Email is correct or not!

    const user   = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email is not correct dont have any user with this email');

    //password is correct or not! 
    const validPassword = await bcrypt.compare(req.body.password , user.password);
    if(!validPassword) return res.status(404).send("Passowd is incorrect");
//Token based Auth
    const token = Jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    
})




module.exports = router;