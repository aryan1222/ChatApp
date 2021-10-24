const socket = io();

const chatForm = document.getElementById('chat-form');
const chatBox = document.querySelector('.chat-messages');

socket.on('message',(msgObj)=>{
    // console.log(`Message Received : ${msg}`);
    displayMessage(msgObj);

    chatBox.scrollTop = chatBox.scrollHeight;
})

const displayMessage = (msgObj) =>{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msgObj.userName} <span>${msgObj.time}</span></p>
    <p class="text">
        ${msgObj.message}
    </p>`

    chatBox.appendChild(div);
}

// Message submit 
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // Get Message Text
    const msg = e.target.elements.msg.value;

    // Emit message to the server
    socket.emit('chatMessage', msg); // sending msg as a payload of chatMessage Event

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Get User and Room from url
const url = new URL(document.URL); // to convert url string to url object

const userName = url.searchParams.get("username");
const room = url.searchParams.get("room");

// Send request/ event to server to join ChatRoom
socket.emit('join-room', {userName, room});



// Updates in The Room
socket.on('info', ({room, users}) =>{
    outputRoom(room);
    outputUsers(users);
});

function outputRoom(room) {
    const displayRoom = document.getElementById('room-name');
    displayRoom.innerText = room;
}

function outputUsers(users) {
    const usersList = document.getElementById('users');

    // console.log(users);
    // users.map(user =>{
    //     const row = document.createElement('li');
    //     row.textContent = user.userName;
    //     console.log(user.userName);

    //     usersList.appendChild(row);
    // });
    usersList.innerHTML = `${users.map(user => `<li>${user.userName}</li>`).join('')}`;

}