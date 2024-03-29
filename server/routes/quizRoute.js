const express = require('express');
const quizController = require('./../controllers/quizController');
const authController = require('./../controllers/authController');
const questionRouter = require('./questionRouter')


const router = express.Router();

router.use('/:quizId/questions', questionRouter)

router
    .route('/')
    .get(quizController.getAllQuiz)
    .post(
        authController.protect,
        authController.restrictTo('user', 'admin'),
        quizController.setTourUserIds,
        quizController.createQuiz)

router.use(authController.protect);
        
router.route('/:id')
    .get(quizController.getQuiz)
    .patch(authController.restrictTo('user', 'admin'),quizController.updateQuiz)
    .delete(authController.restrictTo('admin', 'user'),quizController.deleteQuiz)  

module.exports = router;