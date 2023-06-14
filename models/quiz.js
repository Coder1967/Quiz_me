const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    questions: {type: [], required: true},
    answers: {type: [], required: true},
    userAnswer: {type: []},
    options: {type: [], required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
  {
    timestamps: true,
  }
);


async function populate(model, id) {

  try {

  if (model.modelName === 'User') {
    let user = await model.findById(id).populate('quizzes').
    exec();
    return user;
  }
  else if (model.modelName === 'Quiz') {
    let quiz = await model.findById(id).populate('user').
    exec();
    return quiz;
  }
}catch(err) {
  return null;
}
}




module.exports = {Quiz: mongoose.model("Quiz", quizSchema), populate}