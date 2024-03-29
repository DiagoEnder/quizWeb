const express = require('express');
const questionController = require('./../controllers/questionController')
const authController = require('./../controllers/authController')

const router = express.Router({mergeParam: true})

router.use(authController.protect)

router.route('/')
      .get(questionController.getAllQuestion)
      .post(questionController.createQuestion)
      
router.route('/:id')
      .get(questionController.getQuestion)
      .patch(questionController.updateQuestion)
      .delete(questionController.deleteQuestion)
      
module.exports = router