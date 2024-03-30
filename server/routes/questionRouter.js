const express = require('express');
const questionController = require('./../controllers/questionController')
const authController = require('./../controllers/authController')

const router = express.Router({mergeParams: true})

router.use(authController.protect)

router.route('/')
      .get(questionController.getAllQuestion)
      .post(questionController.setQuizIds,questionController.createQuestion)
      
router.route('/:id')
      .get(questionController.getQuestion)
      .patch(questionController.updateQuestion)
      .delete(questionController.deleteQuestion)
      
module.exports = router