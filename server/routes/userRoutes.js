const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userContorller');



const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

//Protect All route after this Middlewares
router.use(authController.protect);

router.patch('/updateMyPassword', 
     authController.updatePassword);
router.get('/me', 
    userController.getMe, 
    userController.getUser)
router.patch('/updateMe', userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

// Protect All routes after this Middlewares just 'Admin'
router.use(authController.restrictTo('admin'))

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

    
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(
      userController.deleteUser);
   
      
module.exports = router;
