// window.onload = () => {
//     const socket = io();
//     const form = document.querySelector('#form');
//     const name = document.querySelector('#name');

//     form.addEventListener('submit', (event) => {
//         if (name.value == "") return false;
//         event.preventDefault();
//         socket.emit('login', name.value);
//         window.location.assign('/chat');
//     })

//     socket.on('already', () => {
//         window.location.assign('/chat');
//     });
// }
$(document).ready( init => M.AutoInit());