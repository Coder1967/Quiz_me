const express = require('express')
const {login, logOut, refreshAuthToken} = require('./authControllers')
const mongoose = require('mongoose')
require('dotenv').config()

const DB_USER = process.env.DB_USER;
const DB_PASSWD = process.env.DB_PASSWD;
const DB_HOST =  process.env.DB_HOST || "127.0.0.1";
const DB_NAME =  process.env.DB_NAME;
const cors = require('cors')
const DB_PORT = process.env.DB_PORT || '27017';

const app = express();
app.use(express.json())
app.use(cors())

async function runAuth() {
	try {
		
		await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
		app.post('/auth/login', login);
		app.post('/auth/token', refreshAuthToken);
		app.delete('/auth/logout', logOut)

		app.listen(5001, ()=>{console.log('running on port 5001')})
	}catch(err) {
		console.log(err.message);
	}
}
runAuth()

