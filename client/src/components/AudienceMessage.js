import React, { Component } from "react";
class AudienceMessage extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            is_voted: false,
            voted_value: 0
        };
        this.like = this.like.bind(this);
        this.dislike = this.dislike.bind(this);
    }
    like(e) {
        this.props.onChange(this.props.message.id, true);
    }
    dislike(e) {
        this.props.onChange(this.props.message.id, false);
    }
    componentDidUpdate(){
    }
    render() {
        return (
        <li className={this.props.message.highlight > 0 ? "left clearfix highlight_msg" : "left clearfix"}>
            <span className="chat-img pull-left">
                <img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" className="img-circle" />
            </span>
            <div className="chat-body clearfix">
                <div className="header">
                    <strong className="primary-font">{this.props.message.uname}</strong> 
                    <small className="pull-right text-muted">
                        
                    </small>
                </div>
                <p>{this.props.message.msg}</p>
                <div className="header">
                    <small className="pull-left text-muted">
                        <span className="glyphicon glyphicon-time"></span>{this.props.message.time}</small>
                    <small className="pull-right text-muted" onClick={this.like}>
                        <span className="glyphicon glyphicon-thumbs-up text_popular"></span>{this.props.message.like}</small>
                    <small className="pull-right text-muted space">|</small>
                    <small className="pull-right text-muted" onClick={this.dislike}>
                        <span className="glyphicon glyphicon-thumbs-down text_popular"></span>{this.props.message.dislike}</small>
                </div>
            </div>
        </li>
        );
    }
}
export default AudienceMessage;