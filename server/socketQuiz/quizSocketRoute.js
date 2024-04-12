
const handleQuiz = (io) => {
    
    const questions = [
        {
          question: "What is the capital of France?",
          answers: [
            { text: "Paris", correct: true },
            { text: "Berlin", correct: false },
            { text: "London", correct: false },
            { text: "Madrid", correct: false },
          ],
        },
        {
          question: "What is the chemical symbol for water?",
          answers: [
            { text: "H2O", correct: true },
            { text: "CO2", correct: false },
            { text: "O2", correct: false },
            { text: "NaCl", correct: false },
          ],
        },
        {
          question: "What is the largest planet in our solar system?",
          answers: [
            { text: "Mercury", correct: false },
            { text: "Venus", correct: false },
            { text: "Mars", correct: false },
            { text: "Jupiter", correct: true },
          ],
        },
        {
          question: "What is the chemical symbol for iron?",
          answers: [
            { text: "Fe", correct: true },
            { text: "Ag", correct: false },
            { text: "Au", correct: false },
            { text: "Cu", correct: false },
          ],
        },
        {
          question: "Which famous scientist is known for the theory of evolution?",
          answers: [
            { text: "Galileo Galilei", correct: false },
            { text: "Isaac Newton", correct: false },
            { text: "Charles Darwin", correct: true },
            { text: "Marie Curie", correct: false },
          ],
        },
        {
          question: "In which country was the game of chess invented?",
          answers: [
            { text: "China", correct: false },
            { text: "India", correct: true },
            { text: "Greece", correct: false },
            { text: "Egypt", correct: false },
          ],
        },
      
        {
          question: "Which gas is responsible for the Earth's ozone layer?",
          answers: [
            { text: "Oxygen", correct: false },
            { text: "Carbon Dioxide", correct: false },
            { text: "Nitrogen", correct: false },
            { text: "Ozone", correct: true },
          ],
        },
        {
          question: "Which planet is known as the Red Planet?",
          answers: [
            { text: "Mars", correct: true },
            { text: "Venus", correct: false },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
          ],
        },
        {
          question: "Which gas do plants use for photosynthesis?",
          answers: [
            { text: "Oxygen", correct: false },
            { text: "Carbon Dioxide", correct: true },
            { text: "Nitrogen", correct: false },
            { text: "Helium", correct: false },
          ],
        },
      
        {
          question: "What is the capital of Japan?",
          answers: [
            { text: "Beijing", correct: false },
            { text: "Tokyo", correct: true },
            { text: "Seoul", correct: false },
            { text: "Bangkok", correct: false },
          ],
        },
        {
          question:
            "Which famous scientist developed the theory of general relativity?",
          answers: [
            { text: "Isaac Newton", correct: false },
            { text: "Albert Einstein", correct: true },
            { text: "Nikola Tesla", correct: false },
            { text: "Marie Curie", correct: false },
          ],
        },
        {
          question: "Which country is known as the 'Land of the Rising Sun'?",
          answers: [
            { text: "China", correct: false },
            { text: "Japan", correct: true },
            { text: "India", correct: false },
            { text: "Egypt", correct: false },
          ],
        },
      
        {
          question: "What is the chemical symbol for gold?",
          answers: [
            { text: "Ag", correct: false },
            { text: "Au", correct: true },
            { text: "Fe", correct: false },
            { text: "Hg", correct: false },
          ],
        },
        {
          question: "Which planet is known as the 'Morning Star' or 'Evening Star'?",
          answers: [
            { text: "Mars", correct: false },
            { text: "Venus", correct: true },
            { text: "Mercury", correct: false },
            { text: "Neptune", correct: false },
          ],
        },
      
        {
          question: "What is the smallest prime number?",
          answers: [
            { text: "1", correct: false },
            { text: "2", correct: true },
            { text: "3", correct: false },
            { text: "5", correct: false },
          ],
        },
        {
          question: "Which country is known as the 'Land of the Rising Sun'?",
          answers: [
            { text: "China", correct: false },
            { text: "South Korea", correct: false },
            { text: "Japan", correct: true },
            { text: "Thailand", correct: false },
          ],
        },
        {
          question: "What is the largest ocean on Earth?",
          answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true },
          ],
        },
        {
          question: "Which element has the chemical symbol 'K'?",
          answers: [
            { text: "Krypton", correct: false },
            { text: "Potassium", correct: true },
            { text: "Kryptonite", correct: false },
            { text: "Kallium", correct: false },
          ],
        },
        {
          question: "What is the capital city of India?",
          answers: [
            { text: "Mumbai", correct: false },
            { text: "New Delhi", correct: true },
            { text: "Bangalore", correct: false },
            { text: "Kolkata", correct: false },
          ],
        },
      ];
    
    const rooms ={};
    
    function askNewQuestion (room,ios) {
        if(rooms[room].players.length === 0) {
            clearTimeout(rooms[room].questionTimeout);
            delete rooms[room];
            return
        }
        
        const ransdomIndex= Math.floor(Math.random() * questions.length)
        const question = questions[ransdomIndex];
        rooms[room].currentQuestion = question;
        
        
        const correctAnswerIndex = question.answers.findIndex((answers) => answers.correct)
        rooms[room].correctAnswer = correctAnswerIndex
        
        ios.to(room).emit('newQuestion', {
            question: question.question,
            answers: question.answers.map((answer)=> answer.text),
            time: 10
        })
        
        rooms[room].   = setTimeout(() => {
            io.to(room).emit("answerResult", {
              playerName: "No one",
              isCorrect: false,
              correctAnswer: rooms[room].correctAnswer,
              scores: rooms[room].players.map((player) => ({
                name: player.name,
                score: player.score || 0,
              })),
            });
        
            askNewQuestion(room);
          }, 10000);
        
        
    }
    
    io.on('connection', (socket) => {
        
        console.log('a user connected')
            
        socket.on('joinRoom', (room, name) => {
            
            
            
            socket.join(room);
            
            
            io.to(room).emit('message', `${name} has join the game`)
            
            
            if(!rooms[room]) {
                rooms[room] =
                {players: [],
                currentQuestion: null,
                correctAnswer: null,
                questionTimeout: null,
                shouldAskNewQuestion: true
                }
            }
            
            rooms[room].players.push({id: socket.id, name})
            console.log(rooms)
            
            
            if(!rooms[room].currentQuestion){
                askNewQuestion(room,io)
            }
        })
        
        socket.on("submitAnswer", (room, answerIndex) => {
            const currentPlayer = rooms[room].players.find(
              (player) => player.id === socket.id
            );
        
            if (currentPlayer) {
              const {correctAnswer} = rooms[room].correctAnswer;
              const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;
              currentPlayer.score = isCorrect
                ? (currentPlayer.score || 0) + 1
                : (currentPlayer.score || 0) - 1;
        
              clearTimeout(rooms[room].questionTimeout);
        
              io.to(room).emit("answerResult", {
                playerName: currentPlayer.name,
                isCorrect,
                correctAnswer,
                scores: rooms[room].players.map((player) => ({
                  name: player.name,
                  score: player.score || 0,
                })),
              });
              
              const winningThreshold = 5;
              const winner = rooms[room].players.find(
               (player) => (player.score || 0) >= winningThreshold
      );

      if (winner) {
        io.to(room).emit("gameOver", { winner: winner.name });
        delete rooms[room];
      } else {
        askNewQuestion(room);
      }
    }
  });
  socket.on("disconnect", () => {
    // for (const room in rooms) {
    //   rooms[room].players = rooms[room].players.filter(
    //     (player) => player.id !== socket.id
    //   )};

    console.log("A user disconnected");
  });
    })
  
}

module.exports = handleQuiz


