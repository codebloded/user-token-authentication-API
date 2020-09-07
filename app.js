const express = require('express');
const mongoose = require('mongoose');
const port = "4000";
const host  = "localhost";
require('dotenv').config()
const router = require('./routes/auth');
const postRouter = require('./routes/posts')


const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.CONNECTION_DB,({ useUnifiedTopology: true ,useNewUrlParser: true } ),()=>{
    console.log("connect to mongodb ")
});
  


//API-Middlewares
app.use("/api/user", router); 
app.use("/api/posts", postRouter);



// ====================Listining the server===============
app.listen(port, ()=>{
    console.log(`The server is up and Running at http://${port}:${host}`);
})



