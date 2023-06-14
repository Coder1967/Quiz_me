require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

async function hash_pwd(req, res, next){
    if (req.body.password) {
        
        try {
            let pwd = req.body.password;
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(pwd, salt);
            req.body.password = hashedPassword;
        } catch (error) {
            res.status(500).json({error: 'Something went wrong'})
            console.log(error);
        }
    }
    next();
}


async function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    token = authHeader && authHeader.split(' ')[1] //BEARER <TOKEN>

    if (token == null) return res.status(401).json({error: "Unauthorized"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    });

}
module.exports = {hash_pwd, authenticateToken}