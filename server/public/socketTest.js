
const socket = io('http://127.0.0.1:8000')

socket.on('connect', () => {
    console.log('Connected!');
    socket.emit('clientConnect')
    
})

socket.on('welcome',(data) => {
    console.log(data);
})