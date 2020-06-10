const io = require('socket.io')(3000);

io.on('connection', (socket) => {
    console.log('클라이언트 연결 성공!');

    socket.on('echo', (msg) => { 
        console.log(`echo 이벤트 발생 : ${msg}`); 
        socket.emit('echo-back', msg);
    });
});