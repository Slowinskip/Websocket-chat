
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = "";

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content))
socket.on('login', (userName) => login(userName))


function login(e) {
    e.preventDefault();

    if(userNameInput.value == ''){
        alert('Login cannot be empty')
    } else {
        userName = userNameInput.value;
        socket.emit('login', userName )

        messagesSection.classList.add('show');
        loginForm.classList.remove('show');
    }
    
}

function sendMessage(e) {
    e.preventDefault();
  
    let messageContent = messageContentInput.value;
  
    if(!messageContent.length) {
      alert('You have to type something!');
    }
    else {
      addMessage(userName, messageContent);
      socket.emit('message', { author: userName, content: messageContent })
      messageContentInput.value = '';
    }
  
  }

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  }

loginForm.addEventListener('submit', (e) => {
    login(e);
});

addMessageForm.addEventListener('submit', (e) => {
    sendMessage(e);
})