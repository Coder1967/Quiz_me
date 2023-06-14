const User = require('../../models/user.js')
const randomString = require('../helpers/randomString')
const sendEmail = require('../helpers/send_mail')
const HOST = 'http://localhost:5000/api/Quiz_me/users/'

async function getUser(req, res) {
    try {
   const user = await User.findById(req.params.userId);
   if (user === null) return res.status(404).json({error: 'user not found'});
   res.status(200).json({
    email: user.email, id: user.id, 
    verified: user.verified
});
}catch(err){
    return res.status(404).json({error: 'Something went wrong'});
}
}


async function createUser(req, res){
    if (!req.body.email) return res.status(400).json({error: 'Missing email'})
    if (!req.body.password) return res.status(400).json({error: 'Missing password'})
    
    try {
        const user = await new User(req.body);
        await user.save();
        let text = `
        verify account
        ${HOST}/${user.id}/verify
        `
        sendEmail(user.email, "Click to verify account", text)
        res.status(201).json({email: user.email, id: user.id,
                              verified: user.verified});
    } catch (error) {
        res.status(400).json({error: 'Email already in use'})
        console.log(error.message);
    }
}


async function updateUser(req, res) {
    if (req.user.fresh != true) res.status(422).json({error: 'Token not fresh'})
    try {
        const user = await User.findById(req.user.id);
        if (user === null) return res.status(404).json({error: 'user not found'});
        const restricted = ['email', 'createdAt', 'updatedAt', 'id', '_id']
   
        for (let key of Object.keys(req.body)) {
        if (!restricted.includes(key)) {
            user[key] = req.body[key];
        }
    }
        await user.save();
        res.status(201).json({'msg': 'success'});
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong'})
    }
}


async function deleteUser(req, res) {
   if (req.user.fresh != true) return res.status(422).json({error: 'Token not fresh'})   
   const response = await User.deleteOne({_id: req.user.id});

   if (response.deletedCount !== 1) {
    return res.status(404).json({error: 'user not found'});
   }
   res.status(200).json({});  
}

async function verifyAccount(req, res) {
    try {
        const user = await User.findById(req.params.userId);
        if (user === null) return res.status(404).json({error: 'user not found'});
        user.verified = true;
        await user.save();
        res.status(201).json({'msg': 'Account verified'});
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong'})
    }   
}


async function recoverPassword(req, res) {
    try {
          let newPassword = '';
          let user = await User.findOne({email: req.body.email});

          if (!user) return res.status(404).json({error: 'User not found'});

          [newPassword, user.password] = await randomString(12);
          await user.save();
          sendEmail(user.email, "here is your new password", newPassword)
          res.status(200).json({msg: 'success'})
          } catch (error) {
            console.log(error.message)
            res.status(500).json({error: "Something went wrong"})
        }
      
}

module.exports = {getUser, createUser, updateUser, recoverPassword, deleteUser, verifyAccount}