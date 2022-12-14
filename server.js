const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
  });

app.use((req, res) => {
res.status(404).send('404 not found...');
});


const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
  });

  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', () => { console.log('Oh, I\'ve got something from ' + socket.id) });
    console.log('I\'ve added a listener on message event \n');
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
      });
    socket.on('login', (name) => { 
        users.push({ name: name, id: socket.id })
        console.log(users);
        socket.broadcast.emit('message', {
            author: 'Chatbot',
            content: `<i>${name} has joined...`,
        });

    })
    socket.on('disconnect', () => {
        findUser = users.filter((user) => user.id !== socket.id);
        userName = users.filter((user) => user.id === socket.id)[0].name;
        socket.broadcast.emit('message', {
            author: 'Chatbot',
            content: `<i>${userName} has left...`,
        });
        users.splice(findUser, 1);
        console.log(users);
    })

});
  