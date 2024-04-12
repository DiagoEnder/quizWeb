const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet= require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');



const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoute');
const quizRouter = require('./routes/quizRoute');
const questionRouter = require('./routes/questionRouter')


const app = express();
app.use(cors())


console.log(process.env.NODE_ENV);
// 1.Middleware or GET middlewarelobal middleware
// Set  security Http headers
app.use(helmet());


// development logging
if(process.env.NODE_ENV === 'development') {   
    app.use(morgan('dev'));
}

// limit request from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
})
app.use('/api',limiter)

// body parse, reading from body into rq.ody
app.use(express.json({limit: '10kb'}));

// after filter the data, we should to clean the data right now
// data sanitization against NoSQL query injection 
app.use(mongoSanitize());
 
// Data sanitization against XXS
app.use(xss());


// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingQuantity',
        'ratingsAverage',
        'ratings',
        'maxGroupSize',
        'difficulty',
        'price'
        
    ]
}));

// 2) Seriving static file
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers)
    next();
})

//test

// 3.ROUTES  
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/quiz', quizRouter)
app.use('/api/v1/question', questionRouter)




app.all('*', (req,res, next) => {
   
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;