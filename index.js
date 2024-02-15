const express = require('express');
const cors = require("cors")
const {Connection} = require("./config/db");
const {userRouter} = require("./routes/user.route")
const {postRouter} = require("./routes/post.route")
require("dotenv").config()

const PORT=process.env.PORT || 8000

const app=express()

app.use(express.json())
app.use(cors());

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(PORT,async()=>{
    try {
        await Connection
        console.log("Connected to DB")
    } catch (error) {
        console.log('failed to connect to DB')
    }
    console.log(`Server running @ ${PORT}`);
})