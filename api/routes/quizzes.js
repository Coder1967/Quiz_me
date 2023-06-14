const router = require('express').Router();
const {getUserQuizzes, getQuiz,  updateQuiz, createQuiz, deleteQuiz} = require('../controllers/quizControl');

router.get('/', getUserQuizzes);

router.get('/:quizId', getQuiz);

router.put('/:quizId', updateQuiz)

router.post('/', createQuiz);

router.delete('/:quizId', deleteQuiz)

module.exports = router;