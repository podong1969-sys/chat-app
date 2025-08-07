const socket = io();

let currentRoom = null;
let nickname = null;

function joinRoom(roomName, userNickname) {
  currentRoom = roomName;
  nickname = userNickname;

  socket.emit('joinRoom', { roomName, nickname }, (response) => {
    if (!response.success) {
      alert(response.message);
      return;
    }
    document.getElementById('status').textContent = `${nickname} 님, ${roomName} 방에 접속했습니다.`;
  });
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const msg = input.value.trim();
  if (!msg) return;
  socket.emit('sendMessage', { roomName: currentRoom, message: msg });
  input.value = '';
}

socket.on('message', (data) => {
  const chatBox = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.textContent = `${data.sender}: ${data.text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('userList', (users) => {
  const userListElem = document.getElementById('userList');
  userListElem.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user;
    userListElem.appendChild(li);
  });
});
