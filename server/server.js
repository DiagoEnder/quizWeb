const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
process.on('uncaughtException', err => {
  console.log('Uncaught Exception: Shutting down')
  console.log(err.name, err.message);
   
    process.exit(1);
  
})


const app = require('./app');
const handleQuiz = require('./socketQuiz/quizSocketRoute');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  })
  .then(()=> {console.log('DB connection successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//setupSOcket
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

handleQuiz(io)

process.on('unhandledRejection' , err => {
  console.log('unhandledRejection: Shutting down')
  console.log(err.name, err.message);
  server.close(() => {
    
    process.exit(1);
  })
})
