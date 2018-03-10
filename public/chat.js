$(document).ready(init);
let socket;
let user;
function init() {


     socket = io();
     // socket.on('chat message', newMessage);
     socket.on('notification', newNotification);
     socket.on('set name', setName);
     socket.on('set color', setColor);
     socket.on('active users', displayUsers);
     socket.on('show log', showLog);



     // socket.emit('find user', getCookie());

     // $("#m").keyup(function(event) {
     //      if(event.keyCode === 13) sendMessage();
     // });
     // $("#m").focus();
}

// $(function () {
//   var socket = io();
//   $('form').submit(function(){
//    socket.emit('chat message', $('#m').val());
//    $('#m').val('');
//    return false;
//   });
//   socket.on('chat message', function(msg){
//    $('#messages').append($('<li>').text(msg));
//   });
// });

function setName() {

}

function setColor() {

}

function displayUsers(users) {
     $("#users").empty();

    users.forEach(function(user) {
        $("#users").append("<li><p>" + user + "</p></li>");
    });

}

function showLog() {

}

function sendMessage() {
     socket.emit('chat message', $("#m").val());
     $("#m").val("");
}

function newMessage(msg) {
     $("#messages").append("<li><p><b>" + msg + "</b></p></li>");
     // $("#m").parent().scrollTop($("#m").parent()[0].scrollHeight);
     console.log(msg);
}

function newNotification(msg) {
     $("#messages").append("<li><p><b>" + msg + "</b></p></li>");
     // $("#m").parent().scrollTop($("#m").parent()[0].scrollHeight);
     console.log(msg);
}

function reconnect() {

}

function getCookie() {

}
