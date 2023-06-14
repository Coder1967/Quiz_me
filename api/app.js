const express = require('express');
const mongoose = require('mongoose')
const {authenticateToken} = require('./middleWares');
const userRouter = require('./routes/users.js');
const cors = require('cors')
const quizRouter = require('./routes/quizzes.js');
const app = express();
require('dotenv').config()
const DB_USER = process.env.DB_USER;
const DB_PASSWD = process.env.DB_PASSWD;
const DB_HOST =  process.env.DB_HOST || "127.0.0.1";
const DB_NAME =  process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || '27017';
app.use(cors())
app.use(express.json())

async function run() {
	try{
		await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
		app.use('/api/Quiz_me/users', userRouter);
		app.use('/api/Quiz_me/quizzes', [authenticateToken, quizRouter]);
		app.listen(5000, ()=>{
			console.log('running on port 5000');
		});
		
	}catch(err){
		console.log(err);
	}
	
}
run();
