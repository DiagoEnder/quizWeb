const Question = require('./../models/questionModel');
const factory = require('./handlerFactory')

exports.setQuizIds = (req,rex,next) => {
    if(!req.body.quiz) req.body.quiz = req.params.quizId;  
    next()
}


exports.getQuestion = factory.getOne(Question,{path: 'question'})
exports.getAllQuestion = factory.getAll(Question);
exports.createQuestion = factory.createOne(Question);
exports.updateQuestion = factory.updateOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);