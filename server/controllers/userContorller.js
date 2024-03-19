const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
    const filteredObj = {};
    
    allowedFields.forEach(field => {
        if(obj[field]) {
            filteredObj[field] = obj[field];
        }
    })
 
    return filteredObj;
}

 
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
     //1) Create error if user Posted password data
     if( req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password. Please use /updateMypassword', 400))
     }  
     
     //2) filter out unwanted fields names that not allowed to be updated  
     const filterBody = filterObj(req.body, 'name', 'email');
     
     
     //3) update document
     const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
        
     });
     
     res.status(200).json({
        status: 'success',
        data: {
            user
        }
     })
});


exports.deleteMe = catchAsync(async (req,res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})
    
    res.status(204).json({
        status: 'success',
        data: null
    })
})


exports.createUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined!Please use signup instead!'
    });
};


exports.getAllUsers = factory.getAll(User);
exports.getUser= factory.getOne(User)
// /DO NOT UPDATE PASSWORD WITH THIS
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
