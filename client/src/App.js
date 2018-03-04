import React, { Component } from 'react';
import io from 'socket.io-client';
import './include/bootstrap3';
import './assets/css/form_elements.css';
import './assets/css/style.css';
import moment from 'moment';
import Home from './components/Home';
import Admin from './components/Admin';
import Audience from './components/Audience';
import * as Helper from './utils/helper';
import 'bootstrap-notify';
const $ = window.jQuery;
var RenderStep = {
  HomePage: 0,
  AdminPage: 1,
  AudiencePage: 2,
};
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderStep: RenderStep.HomePage,
      eventInfo: {},
      messages: [],
      joined : 0
    };
    const PORT = process.env.PORT || 5000;
    // Starting connect to server
    console.log(this.socket);
    this.socket = io("http://localhost:" + PORT);
    
    this.handleCreateRoom = this.handleCreateRoom.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleVoted = this.handleVoted.bind(this);
    
  }

  componentDidMount() {
    this.socket.on("user_joined", this.user_joined.bind(this));
    this.socket.on("msg", this.recieveMessage.bind(this));
    this.socket.on("all_msg", this.recieveAllMessage.bind(this));
    this.socket.on("created_evt_room_ok", this.created_evt_room_ok.bind(this));
    this.socket.on("created_evt_room_failed", this.create_evt_room_failed.bind(this));
    this.socket.on("joined_evt_room_ok", this.joined_evt_room_ok.bind(this));
    this.socket.on("joined_evt_room_failed", this.joined_evt_room_failed.bind(this));
    this.socket.on("user_disconnect", this.user_disconnect.bind(this));
    this.socket.on("user_voted", this.user_voted.bind(this));
    this.socket.on("voted_failed", this.voted_failed.bind(this));
    this.socket.on("updated_msg_ok", this.updatedMsgOK.bind(this));
    this.socket.on("deleted_msg_ok", this.deletedMsgOK.bind(this));
    this.socket.on("highlighted_msg_ok", this.highlightMsgOK.bind(this));
    this.socket.on("highlighted_msg_full", this.highlightMsgMax.bind(this));
  }

  user_joined(no) {
    this.setState({ joined: no });
  }

  created_evt_room_ok(evt_name, evt_code, date_from, date_to, admin_name) {
    $.notify("You just created new Event with code : "  + evt_code);
    this.setState({renderStep: RenderStep.AdminPage}); 
    this.setState({ eventInfo: { 
      evt_name : evt_name,
      evt_code : evt_code,
      date_from : moment(date_from).format("DD/MM/YYYY"),
      date_to : moment(date_to).format("DD/MM/YYYY"),
      admin_name : admin_name,
      joined: this.state.joined
    }});
  }

  create_evt_room_failed(msg) {
    $.notify("create_evt_room_failed : "  + msg);
  }

  joined_evt_room_ok(evt_name, evt_code, date_from, date_to) {
    this.setState({renderStep: RenderStep.AudiencePage}); 
    this.setState({ eventInfo: { 
      evt_name : evt_name,
      evt_code : evt_code,
      date_from : this.formatTime(date_from),
      date_to : this.formatTime(date_to),
      joined: this.state.joined
    }});
  }

  joined_evt_room_failed(msg) {
    $.notify(msg);
  }

  user_disconnect(msg, uname) {
    $.notify(uname + " has left room");
  }

  user_voted(message) {
    var arr_clone = Helper.arrayClone(this.state.messages);
    var index = Helper.find_message_in_arr_by_id(arr_clone, message.id);
    arr_clone[index] = message;
    this.setState({ messages: arr_clone });
  }
  voted_failed(message) {
    $.notify("you just voted failed : "  + message);
  }

  recieveMessage(message) {
    var arr_clone = this.state.messages.slice();    
    arr_clone.push(message);   
    this.setState({ messages: arr_clone });
    
  }

  recieveAllMessage(messages) {
    console.log("recieveAllMessage");
    console.log(messages);
  }

  handleCreateRoom(evt_name, date_from, date_to, admin_name) {
    this.socket.emit("create_evt_room", evt_name, date_from, date_to, admin_name);
  }

  handleJoinRoom(evt_code, audience_name) {
    this.socket.emit("join_evt_room", evt_code, audience_name);
  }
  handleSend(msg) {
    this.socket.emit("msg", msg);
  }

  handleVoted(msgid, bool) {
    this.socket.emit("voted", msgid, bool);
  }
  onUpdateMsg(msgid, msg){
    this.socket.emit("update_msg", msgid, msg);
  }
  onDelMsg(msgid){
    this.socket.emit("delete_msg", msgid);
  }
  onHighlight(msgid){
    this.socket.emit("highlight_msg", msgid);
  }
  updatedMsgOK(message){
    var arr_clone = Helper.arrayClone(this.state.messages);
    var index = Helper.find_message_in_arr_by_id(arr_clone, message.id);
    arr_clone[index] = message;
    this.setState({ messages: arr_clone });
  }
  deletedMsgOK(msgid){
    var arr_clone = Helper.arrayClone(this.state.messages);
    var new_arrs = Helper.removeByKey(arr_clone, msgid);
    this.setState({ messages: new_arrs });
  }
  highlightMsgOK(message){
    var arr_clone = Helper.arrayClone(this.state.messages);
    var index = Helper.find_message_in_arr_by_id(arr_clone, message.id);
    arr_clone[index] = message;
    this.setState({ messages: arr_clone });
  }
  highlightMsgMax(msg){
    $.notify(msg);
  }
  formatTime(time){
    return moment(time).format("DD/MM/YYYY");
  }
  formatTimeInChat(time){
    return moment(time).format("DD/MM/YYYY h:mm:ss");
  }
  render() {
    switch (this.state.renderStep) {
      case RenderStep.AdminPage:
        return <Admin {...this.state} messages={this.state.messages} update={this.onUpdateMsg.bind(this)} 
          delete={this.onDelMsg.bind(this)} highlight={this.onHighlight.bind(this)}/>;
      case RenderStep.AudiencePage:
        return <Audience {...this.state} messages={this.state.messages} handle={this.handleSend} voted={this.handleVoted}/>;    
      default:
        return <Home handleCreate={this.handleCreateRoom} handleJoin={this.handleJoinRoom}/>;    
    }
  }
}

export default App;
