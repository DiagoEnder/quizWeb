const Quiz = require('./../models/quizModel');

const factory = require('./handlerFactory')

exports.setTourUserIds = (req,res,next) => {
    if(!req.body.user) req.body.user = req.user._id
    
    next();
}

exports.getAllQuiz = factory.getAll(Quiz);
exports.updateQuiz = factory.updateOne(Quiz);
exports.deleteQuiz = factory.deleteOne(Quiz);
exports.createQuiz = factory.createOne(Quiz);
exports.getQuiz = factory.getOne(Quiz, {path: 'question'})
// exports.getQuiz = factory.getOne(Quiz)

