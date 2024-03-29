const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: String,
    options: [
        {
            text: String,
            isCorrect:{
                type: Boolean,
                default: false
            }
        }
    ],
    quiz: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quiz'
    }     
  }, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });

  
// quizSchema.index({price: 1});
// quizSchema.index({price: 1, ratingsAverage: -1});
// quizSchema.index({slug: 1});

//populate virtual
// quizSchema.virtual('question', {
//   ref: 'Question',
//   foreignField: 'questions',
//   localField: '_id'
// })

// DOCUMENT MIDDLEWARE: runs before .save) and .create()


questionSchema.post(/^find/, function(docs,next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
 
  next()
})



// AGGREGATION MIDDLEWARE 
// questionSchema.pre('aggregate', function(next) {
  
//   this.pipeline().unshift({$match: {secretquestion:  {$ne: true}}})
//   console.log(this.pipeline())
  
//   next();
// })

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;