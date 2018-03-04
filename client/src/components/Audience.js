import React, { Component } from "react";
import AudienceMassage from './AudienceMessage';
import '../assets/css/admin_chat.css';
const $ = window.jQuery;
class Audience extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            sent_massage: "",
            sort_by_default : true // default sort by most like, else sort by created time
        };
        this.send = this.send.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleVotedChange = this.handleVotedChange.bind(this);
        this.sort_by_most_like = this.sort_by_most_like.bind(this);
        this.sort_by_created_time = this.sort_by_created_time.bind(this);
    }
    handleChangeMessage(e) {
        this.setState({sent_massage: e.target.value});
    }
    handleVotedChange(msgid, voted_value) {
        this.props.voted(msgid, voted_value);
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
          this.send(e)
        }
    }
    send(e) {
        e.preventDefault();
        const msg = this.state.sent_massage;
        if(msg.trim() === "")
            return;
        this.setState({message: ""});
        this.props.handle(msg);
        $("#btn-input").val("");
    }

    sort_by_most_like(e) {
        e.preventDefault();
        this.setState({
            sort_by_default : true
        })
        $("#p_text").html("Most Like ");
    }
    sort_by_created_time(e) {
        e.preventDefault();
        this.setState({
            sort_by_default : false
        })
        $("#p_text").html("Newest ");
    }
  
    render() {
        return (
        <div>
            <div className="container admin_page">
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading" id="accordion">
                                <div className="btn-group pull-left">
                                <span className="glyphicon glyphicon-home"></span><span> {this.props.eventInfo.evt_name} (<span className="evt_code_s">{this.props.eventInfo.evt_code}</span> joined : {this.props.joined} )</span>
                                </div>
                                <span className="glyphicon glyphicon-time"></span><span> {this.props.eventInfo.date_from} - {this.props.eventInfo.date_to}</span>
                                <div className="btn-group pull-right">
                                    <div className="btn-group">
                                        <button className="btn btn-secondary btn-sm dropdown-toggle popular" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span id="p_text">Popular </span>
                                          <span className="glyphicon glyphicon glyphicon-chevron-down"></span>
                                        </button>
                                        <div className="dropdown-menu">
                                            <button className="dropdown-item" type="button" onClick={this.sort_by_most_like} >Most like</button>
                                            <button className="dropdown-item" type="button" onClick={this.sort_by_created_time}>Newest</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className="panel-collapse" id="collapseOne">
                            <div className="panel-body">
                                <ul className="chat">
                                    { 
                                        [].concat(this.props.messages).sort((a, b) =>   this.state.sort_by_default ? a.like < b.like : Date.parse(a.time) <  Date.parse(b.time))
                                        .map(function(msg, index) {
                                            return <AudienceMassage key={index} message={msg} onChange={this.handleVotedChange} />
                                        }, this) 
                                        // this.props.messages.map(function(msg, index) {
                                        //     return <AudienceMassage key={index} message={msg} onChange={this.handleVotedChange} />
                                        // }, this) 
                                    }
                                </ul>
                            </div>
                            <div className="panel-footer">
                                <div className="input-group">
                                    <input id="btn-input" type="text" className="form-control input-sm" 
                                    placeholder="Type your message here..." onChange={this.handleChangeMessage.bind(this)} onKeyPress={this.handleKeyPress}/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-warning btn-sm" id="btn-chat" onClick={this.send}>Send</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
export default Audience;