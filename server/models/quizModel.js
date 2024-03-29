const mongoose = require('mongoose');

const slugify = require('slugify');


const quizSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A quiz must have a name'],
      trim: true,
      maxlength: [40, 'A quiz name must have less or equal then 40 charecters'],
      minlength: [10, 'A quiz name must have more or equal then 10 characters'],     
    },
    slug: String,
    duration: {
        type: Number,
        default: 30,
    },
    points: {
        type: Number,
        default: 10
    },
    nQuestion: {
        type: Number,
        
    },
    grades: {
        type: String,
        required: [true, 'A quiz must have a difficuty'],
        enum: {
          values: ['1st', '2nd','3rd', 'Univerity'],
          message: 'Difficulty is either: 1st, 2st, 3rd, University'
          
        }
    },
    subject:{
        type: String,
        required: [true, 'A quiz must have a Subject'],
        enum: {
          values: ['English', 'Maths', 'Science', 'History', 'Geography'],
          message: 'Difficulty is either: English, Maths, Science, History, Geography'
          
        }
    },

    description: {
       type: String,
       trim: true 
    },
    imageCover: {
       type: String, 
       required: [true, 'A quiz must have a cover image']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    expires: [Date],
    secretQuiz: {
      type: Boolean,
      default: false
    },
    
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        reuiqred: [true, 'Quiz must belong to a user!']
    },
    
    nplay: Number    
    
  }, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });

  
// quizSchema.index({price: 1});
// quizSchema.index({price: 1, ratingsAverage: -1});
// quizSchema.index({slug: 1});

//populate virtual
quizSchema.virtual('question', {
  ref: 'Question',
  foreignField: 'quiz',
  localField: '_id'
})

// DOCUMENT MIDDLEWARE: runs before .save) and .create()
quizSchema.pre('save', function (next) {
  this.slug = slugify(this.name,{lower: true});
  next();
});


//QUERY MIDDLEWARE 
quizSchema.pre(/^find/, function (next) {
// quizSchema.pre('find', function (next) {
  this.find({secretQuiz: {$ne: true }})
  
  this.start = Date.now();
  next();
}) 

// quizSchema.pre(/^find/, function(next) {
  
//   this.populate({
//     path: 'question',
//     select: '-__v -passwordChangedAt'
//   });
  
//   next();
// })

quizSchema.post(/^find/, function(docs,next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
 
  next()
})



// AGGREGATION MIDDLEWARE 
quizSchema.pre('aggregate', function(next) {
  
  this.pipeline().unshift({$match: {secretQuiz:  {$ne: true}}})
  console.log(this.pipeline())
  
  next();
})

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;