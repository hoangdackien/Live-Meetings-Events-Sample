var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var express = require("express");
var moment = require("moment");
app.use(express.static(__dirname + "client/build"));

// Serve root
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/client/build/index.html");
});

// Associative array, tracks amount of connected users per room.
var rooms = new Object();

// Tracks a chatroom's persisted properties.
// Also an accidental pun.
class Room {
  constructor(evt_name, evt_code, start_time, end_time, admin_name) {
    this.evt_name = evt_name;
    this.evt_code = evt_code;
    this.start_time = Date.parse(start_time);
    this.end_time = Date.parse(end_time);
    this.admin_name = admin_name;
    this.connected = 0;
    this.messages = {};
  }

  userConnected() {
    return ++this.connected;
  }

  userDisonnected() {
    return --this.connected;
  }

  get connectedUsers() {
    return this.connected;
  }

  validateJoinEvent(evt_code){
    var current_date =  Date.parse(new Date());
    return this.evt_code == evt_code && current_date > this.start_time && current_date < this.end_time;
    return true;
  }
}

class Message{
  constructor(uname, time, msg) {
    this.uname = uname;
    this.time = time;
    this.msg = msg;
    this.dislike = 0;
    this.like = 0;
    this.highlight = 0;
    this.voted_by = new Object();
    this.id = generate_message_id();
  }

  validateVoted(socket_id){
    if (socket_id in this.voted_by) 
      return false;
    this.voted_by[socket_id] = 1;
    return true;
  }

  updateVoted(bool){
    if(bool)
      this.like++
    else
      this.dislike++;
    return this;
  }
}

function generate_event_code(){
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

function generate_message_id(){
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return "msg" + firstPart + secondPart;
}

io.on("connection", function(socket) {
  // Creates a event room
  socket.on("create_evt_room", function( evt_name, date_from, date_to, admin_name) {
    var evt_code = generate_event_code();
    if ((evt_code in rooms)) {
      io.to(socket.id).emit("created_evt_room_failed", "event already created");
      return;
    } 
    rooms[evt_code] = new Room(evt_name, evt_code, date_from, date_to, admin_name);
    io.to(socket.id).emit("created_evt_room_ok", evt_name, evt_code, date_from, date_to, admin_name);
    console.log("Created event room: " + evt_name + " with start_time: " + date_from + " and end time " + date_to + " and evt_code : " + evt_code);
    socket.join(evt_code);
    socket.roomID = evt_code;
    socket.highlight = 0;
    // Get all messages when you offline
    io.to(socket.id).emit("all_msg", rooms[socket.roomID].messages);
  });

  // Joining a event room
  socket.on("join_evt_room", function(evt_code, username) {
    if (!(evt_code in rooms) || !rooms[evt_code].validateJoinEvent(evt_code)) {
      io.to(socket.id).emit("joined_evt_room_failed", "The event is expired time or event not found");
      return;
    } 
    // Track number of users in room
    rooms[evt_code].userConnected();
    // Propagate number of users
    socket.join(evt_code);
    io.to(evt_code).emit("user_joined", rooms[evt_code].connectedUsers);
    io.to(socket.id).emit("joined_evt_room_ok", rooms[evt_code].evt_name, evt_code, rooms[evt_code].start_time,  rooms[evt_code].end_time);
    // Persist room ID and username on the socket itself
    socket.roomID = evt_code;
    socket.username = username == "" ? "Anonymous" : username;
    socket.admin = false;
    // Handle disconnects
    socket.on("disconnect", function(data) {
      rooms[socket.roomID].userDisonnected();
      io.to(socket.roomID).emit("user_disconnect", rooms[socket.roomID].connectedUsers, socket.username);
      io.to(evt_code).emit("user_joined", rooms[evt_code].connectedUsers);
    });
  });

  

  // Propagate recieved messages
  socket.on("msg", function(msg) {
    var time =  new Date();
    time = moment(time).format("DD/MM/YYYY h:mm:ss")
    var message = new Message(socket.username, time, msg);
    rooms[socket.roomID].messages[message.id] = message;
    io.to(socket.roomID).emit("msg", message);
  });

   // voted message
  socket.on("voted", function(msgid, bool) {
    var message = rooms[socket.roomID].messages[msgid];
    if(message){
      if(!message.validateVoted(socket.id)){
        io.to(socket.id).emit("voted_failed", "You already voted!");
      }
      else{
        var u_msg = message.updateVoted(bool);
        io.to(socket.roomID).emit("user_voted", u_msg);
      }
    }
  });

  socket.on("update_msg", function(msgid, msg) {
    console.log("update_msg on server");
    var message = rooms[socket.roomID].messages[msgid];
    if(message){
      message.msg = msg;
      io.to(socket.roomID).emit("updated_msg_ok", message);
    }
  });

  socket.on("delete_msg", function(msgid, msg) {
    var message = rooms[socket.roomID].messages[msgid];
    if(message){
      console.log("delete_msg");
      console.log(message.highlight);
      if(message.highlight > 0)
        --socket.highlight;
      delete rooms[socket.roomID].messages[msgid];
      io.to(socket.roomID).emit("deleted_msg_ok", msgid);
    }
    else
      io.to(socket.roomID).emit("deleted_msg_failed", msgid);
  });

  socket.on("highlight_msg", function(msgid) {
    console.log(socket.highlight)
    var message = rooms[socket.roomID].messages[msgid];
    if(message){
      if(socket.highlight < 3 && message.highlight <= 0){
        message.highlight = 1;
        socket.highlight++;
        io.to(socket.roomID).emit("highlighted_msg_ok", message);
      } 
      else
        io.to(socket.id).emit("highlighted_msg_full", "You're max highligh or already highlight this message!");
    }
  });

});

http.listen(process.env.PORT || 5000, function() {});
