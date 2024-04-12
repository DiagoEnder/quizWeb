import { useState, useEffect } from 'react'
import './App.css'
import io from 'socket.io-client'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const socket = io('http://127.0.0.1:8000')
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjOGEyMTFmMmY4ZmI4MTRiNTZmYTE4OCIsImlhdCI6MTcxMjIwODc3MiwiZXhwIjoxNzE5OTg0NzcyfQ.HiZRiyUmuxqb7qLn9Fy1h4xnlqN-ibjACopSxxLKZVM'
// const headers = {
//   'Authorization': `Bearer ${token}`, // Token được thêm vào trong Authorization header
//   'Content-Type': 'application/json'
// };
function App() {
  
  const [name,setName] = useState();
  const [room,setRoom] = useState();
  const [info, setInfo] = useState(false);
  const [question, setQuestion] = useState('');
  const [options,setOptions] = useState([]);
  const [scores, setScores] =useState([]);
  const [seconds, setSeconds] = useState();
  const [dataQuiz, setDataQuiz] = useState();
  function handlesubmit(e) {
    e.preventDefault();
    if(name && room) setInfo(true);
    // console.warn(name,room)
  }
  
  // useEffect(() => {
  //   const getQuiz = async() => {
  //      const res = await axios.get('http://127.0.0.1:8000/api/v1/quiz/65facfbb83488c6544cd5972', {
  //        headers
  //      })
       
  //      const data = await res.data.data.data;
  //      setDataQuiz(data)
  //   }
  //   getQuiz()
  // },[])
  
  useEffect(() => {   
    if(name) {
      socket.emit('joinRoom', room, name)
    }
  }, [info])

  useEffect(() =>{
    socket.on('message', (message) => {
      toast(`${message} joined`,{
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    })
    
    return () => {
      socket.off('message');
    }
  },[])
  
  useEffect(() => {
    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      setOptions(data.answers);
      
      setSeconds(data.time)
      
    });
  })
  
  console.log(options)
  
  return (
    <div className='App'>  
      {!info ?     
        <div className='join-div'>
          <h1>QizClash</h1>
          <form onSubmit={handlesubmit}>
            <input required placeholder='Enter your name' value={name} onChange={(e)=> setName(e.target.value)} />
            <input required placeholder='Enter your romm' value={room} onChange={(e)=> setRoom(e.target.value)} />
            
            <button className='join-btn' type='submit'>JOIN</button>
          </form>
        </div> :
        (
          <div>
            <h1>QuizClash</h1>
            <p className='room-id'>RoomId: {room}</p>
            <ToastContainer/>
            {question ? (
                <div className='quiz-div'>
                  Remaning Time: {seconds}
                  
                  <div className='question'>
              <p className='question-text'>
                  {question}
              </p>
            </div>
            <ul>
               {options.map((answer, index) => 
               (
                  <li key={index}>
                    <button className='selected'>
                      {answer}
                      
                      </button>
                  </li>
               ))
               }
            </ul>
            
            {scores.map((player, index) => {
              <p key={index}>{player.name}: {player.score}</p>
            })}
                </div>
            ):
            (
              <p>Loading question ...</p>
            )}
           
          </div>
        )
      }
    
    </div>
  )
}

export default App
