const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/rooms', (req, res) => {
  res.sendFile(__dirname + '/rooms.html');
});
app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

let rooms = {}; // { roomName: { users: { socketId: nickname }, maxUsers: number } }

io.on('connection', socket => {
  console.log('사용자 접속:', socket.id);

  // 방 생성
  socket.on('createRoom', ({ roomName, maxUsers }, callback) => {
    if (rooms[roomName]) {
      callback({ success: false, message: '이미 존재하는 방 이름입니다.' });
    } else {
      rooms[roomName] = { users: {}, maxUsers: maxUsers || 10 };
      callback({ success: true });
      console.log(`방 생성됨: ${roomName}`);
    }
  });

  // 방 참가
  socket.on('joinRoom', ({ roomName, nickname }, callback) => {
    const room = rooms[roomName];
    if (!room) {
      callback({ success: false, message: '존재하지 않는 방입니다.' });
      return;
    }
    if (Object.keys(room.users).length >= room.maxUsers) {
      callback({ success: false, message: '방이 꽉 찼습니다.' });
      return;
    }
    if (Object.values(room.users).includes(nickname)) {
      callback({ success: false, message: '닉네임이 중복됩니다.' });
      return;
    }

    room.users[socket.id] = nickname;
    socket.join(roomName);
    callback({ success: true });
    io.to(roomName).emit('userList', Object.values(room.users));
    io.to(roomName).emit('message', { sender: '서버', text: `${nickname} 님이 입장했습니다.` });

    console.log(`${nickname} 님이 ${roomName}에 입장`);
  });

  // 메시지 전송
  socket.on('sendMessage', ({ roomName, message }) => {
    const room = rooms[roomName];
    if (!room) return;
    const nickname = room.users[socket.id];
    if (!nickname) return;

    io.to(roomName).emit('message', { sender: nickname, text: message });
  });

  // 연결 해제
  socket.on('disconnect', () => {
    for (const roomName in rooms) {
      const room = rooms[roomName];
      if (room.users[socket.id]) {
        const nickname = room.users[socket.id];
        delete room.users[socket.id];
        io.to(roomName).emit('userList', Object.values(room.users));
        io.to(roomName).emit('message', { sender: '서버', text: `${nickname} 님이 나갔습니다.` });
        console.log(`${nickname} 님이 ${roomName}에서 나감`);
        if (Object.keys(room.users).length === 0) {
          delete rooms[roomName];
          console.log(`${roomName} 방이 삭제됨 (빈 방)`);
        }
        break;
      }
    }
  });
});

http.listen(PORT, () => {
  console.log(`서버 시작: http://localhost:${PORT}`);
});