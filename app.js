
const socket = io();

function setNickname() {
  const nickname = document.getElementById("nicknameInput").value;
  socket.emit("set_nickname", nickname, (res) => {
    if (res.success) {
      localStorage.setItem("nickname", nickname);
      window.location.href = "/rooms";
    } else {
      document.getElementById("nicknameError").innerText = res.error;
    }
  });
}

function createRoom() {
  const roomName = document.getElementById("newRoomName").value;
  const maxUsers = parseInt(document.getElementById("maxUsers").value);
  socket.emit("create_room", { roomName, maxUsers }, (res) => {
    if (res.success) {
      localStorage.setItem("room", roomName);
      window.location.href = "/chat";
    } else {
      alert(res.error);
    }
  });
}

function joinRoom(roomName) {
  socket.emit("join_room", roomName, (res) => {
    if (res.success) {
      localStorage.setItem("room", roomName);
      window.location.href = "/chat";
    } else {
      alert(res.error);
    }
  });
}

function sendMessage() {
  const msg = document.getElementById("messageInput").value;
  socket.emit("send_message", msg);
  document.getElementById("messageInput").value = "";
}

socket.on("receive_message", (data) => {
  const div = document.createElement("div");
  div.innerText = `${data.nickname}: ${data.message}`;
  document.getElementById("messages").appendChild(div);
});
