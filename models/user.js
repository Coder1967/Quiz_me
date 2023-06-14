const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    verified: {type: Boolean, default: false},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    quizzes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}]
},
{
    timestamps: true,
}
);



const User = mongoose.model("User", userSchema);
module.exports = User;
