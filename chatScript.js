const socket = "";
const room = "";

document.addEventListener('DOMContentLoaded', () => {
    var img = document.querySelector('.image');
    var usr_name = document.querySelector('.usr-name');
    usr_name.innerHTML = localStorage.getItem('Name');
    img.src = localStorage.getItem('Image');

    socket = io();
     room = "localStorage.getItem('Mobile')";
    
    socket.emit('join-room', room);    
})


//-------------------------Create connection of Websockets-------------------------


const inputField = document.querySelector('.inputval');
const btn = document.querySelector('.btn');

btn.addEventListener('click',() => {
    alert('don')
    let val = inputField.value;
    socket.emit('message', {room: room, message: val});
    inputField.value = "";
})

socket.on('chat message', (message) => {
  console.log(message);
    var chatbox = document.getElementsByClassName('chat-body');
    var receive = document.createElement('div');
    receive.className = 'chat-message';
    receive.textContent = message;
    chatbox.appendChild(receive);
    // Removed unused variable 'sent'

})




