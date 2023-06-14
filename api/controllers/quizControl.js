const {Quiz, populate} = require('../../models/quiz');
const User = require('../../models/user');
const aiCall = require('../helpers/callApi')
const parser = require('../helpers/parse')

async function getUserQuizzes(req, res) {
    let user = await populate(User, req.user.id);
    if (user) {
        let quizzes = user.quizzes;
        return res.status(200).json(quizzes);
    }
    res.status(404).json({error: 'User not found'});
}


async function getQuiz(req, res) {
    try {
         let quiz = await Quiz.findById(req.params.quizId);
         if (!quiz) return res.status(404).json({error: 'quiz not found'});
         quiz = {
            answers: quiz.answers,
            userAnswer: quiz.userAnswer, options: quiz.options,
            createdAt: quiz.createdAt, updatedAt: quiz.updatedAt
        }
         res.status(200).json(quiz);
    }catch (error) {
        return res.status(500).json({error: 'Something went wrong'});
    }
}


async function updateQuiz(req, res) {
    try {
        let quiz = await Quiz.findById(req.user.id);
        if (!quiz) return res.status(404).json({error: 'quiz not found'});
        const restricted = ['createdAt', 'updatedAt', 'id', '_id']
   
        for (let key of Object.keys(req.body)) {
        if (!restricted.includes(key)) {
            quiz[key] = req.body[key];
        }
    }
        await quiz.save();
        res.status(201).json(quiz);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: 'Something went wrong'})
    }
}


async function deleteQuiz(req, res) {
    const response = await Quiz.deleteOne({_id: req.params.quizId});
 
    if (response.deletedCount !== 1) {
     return res.status(404).json({error: 'quiz not found'});
    }
    return res.status(200).json({});  
 }


 async function createQuiz(req, res) {
    let user = {};
    
    try {
        user = await User.findById(req.user.id);
    }catch(err) {
        console.log(err)
        return res.status(404).json({error: 'User not found'})
    }

    try {
            let response = null;
            if (!req.body.course) return res.status(400).json({err: 'course not specified'})
            if (req.body.limit) {
                response =  await aiCall(req.body.course, Number(req.body.limit))
            }
            else {
                response = await aiCall(req.body.course)
            }
            let data = parser(response);
            let quiz = await new Quiz(data);
            quiz.user = user._id;
            quiz = await quiz.save();
            user.quizzes.push(quiz._id);
            await user.save();
            quiz = {
                _id: quiz.id, answers: quiz.answers, questions: quiz.questions,
                userAnswer: quiz.userAnswer, options: quiz.options,
                createdAt: quiz.createdAt, updatedAt: quiz.updatedAt
            }

            res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({error: 'Something went wrong'})
        console.log(error.message);
    }
 }

 module.exports = {getUserQuizzes, getQuiz,  updateQuiz, createQuiz, deleteQuiz};