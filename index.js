let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');
let port = process.env.PORT || 3000;



var users = [];
var log = [];



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


io.on('connection', function(socket){

     let user = makeUser(socket);
     console.log("NEW USER");
     for(let i = 0 ; i < log.length; i++) {
          user.socket.emit('chat message', log[i]);
     }


     io.emit('chat message', user.name + " has joined the chat.");
     log.push(user.name + " has joined the chat.");

     socket.on('chat message', function(msg){
          if(msg.startsWith("/nickcolor")) {
               changeNameColor(user, msg.substr(11, msg.length - 11).trim());
          } else if(msg.startsWith("/nick")) {
               changeName(user, msg.substr(6, msg.length - 6). trim());
          } else {
               displayMessage(user, msg);
          }

     });

     socket.on('disconnect', function() {
          rmUser(user);
          displayUsers();
          io.emit('chat message', user.name + " has disconnected from the chat.");
          log.push(user.name + " has disconnected from the chat.");
     });

     socket.on('get name', function(name) {

     });

     socket.on('get color', function(color) {

     });

     socket.on('show names', displayUsers);

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

function displayUsers() {
     let userNames = [];
     users.forEach(function(user) {
          userNames.push(user.name);
     });
}

function displayMessage(user, message) {
     console.log(user.name + " (" + timeStamp(new Date()) + "): " + message);
     io.emit('chat message', user.name + " (" + timeStamp(new Date()) + "): " + message);
     if(log.length > 200) {
          log.shift();
     }
     log.push(user.name + " (" + timeStamp(new Date()) + "): " + message);
}

function makeUser(socket) {
     let name;
     if (users === undefined || users.length == 0) {
          name = "User1";
     } else {
          let userno = users.length + 1;
          name = "User" + userno;
     }
     let color = "000000";
     let user = {socket: socket, name: name, color: color};
     users.push(user);
     return user;

}

function rmUser(user) {
     let i;
     for(i = 0; i < users.length; i++) {
          if (users[i].name === user.name) break;
     }
     users.splice(i, 1); //remove user at index i
}

function changeName(user, name) {
     if (validName(name)) {
          let prevName = user.name;
          user.name = name;
          user.socket.emit('chat message', "Name set to: " + name);

          io.emit('chat message', prevName + " has change their name to: " + name);
          log.push(prevName + " has change their name to: " + name);
          console.log(prevName + " has change their name to: " + name);
     } else {
          user.socket.emit('notification', "The name " + name + " is already taken. Please choose a new name.")
     }
}

function validName(name) {
     for(let i = 0; i < users.length; i++) {
          if(users[i].name === name) return false;
     }
     return true;
}

function changeNameColor(user, color) {
     if(color.length != 6 && !isNaN(parseInt(user, 16))) {
          user.socket.emit('chat message', "Please enter a color in the hexadecimal format RRGGBB");
          return;
     }
     let i = 0;
     for(i; i < users.length; i++) {
          if(users[i].name === user.name) {
               users[i].color = color;
               user.socket.emit('chat message', "Your nickname color has been changed to: #" + color);
               break;
          }
     }
}

function timeStamp(date) {
     let hh = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
     let mm = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
     let ss = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();

     return hh + ":" + mm + ":" + ss;
}
