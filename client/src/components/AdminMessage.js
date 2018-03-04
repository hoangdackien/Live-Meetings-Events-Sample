import React, { Component } from "react";
const $ = window.jQuery;
class AdminMessage extends Component { 
    constructor(props) {
        super(props);
        this.state = {};
        this.highlight = this.highlight.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }
    highlight(e) {
        this.props.highlight(this.props.message.id);
    }
    edit(e) {
        $("#panel_msg_update_" + this.props.message.id).show();
        $("#real_msg_" + this.props.message.id).hide();
        var c_msg = $("#real_msg_" + this.props.message.id).html();
        $("#btn-input_"+ this.props.message.id).val(c_msg);
    }
    delete(e) {
        if (window.confirm('Are you sure want to delete this message ?')) {
            this.props.delete(this.props.message.id);
        } else {}
    }
    onCancelUpdate(e){
        $("#panel_msg_update_" + this.props.message.id).hide();
        $("#real_msg_" + this.props.message.id).show();
    }
    onUpdate(e){
        this.props.update(this.props.message.id, $("#btn-input_"+ this.props.message.id).val());
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.update(this.props.message.id, $("#btn-input_"+ this.props.message.id).val());
        }
    }
    componentDidUpdate() {
        $("#panel_msg_update_" + this.props.message.id).hide();
        $("#real_msg_" + this.props.message.id).show();
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
                        <i className='glyphicon glyphicon-heart-empty highlight' onClick={this.highlight.bind(this)}></i>
                        <i className='glyphicon glyphicon-edit edit' onClick={this.edit}></i>
                        <i className='	glyphicon glyphicon-remove remove' onClick={this.delete}></i>
                    </small>
                </div>
                <div id={"real_msg_" + this.props.message.id} className="real_msg">{this.props.message.msg}</div>
                <div id={"panel_msg_update_" + this.props.message.id} className="panel_msg_update">
                    <input id={"btn-input_" + this.props.message.id} type="text" className="form-control input-sm txt_box_msg_update" 
                        placeholder="Type your message here..." onKeyPress={this.handleKeyPress.bind(this)}/>
                    <div className="btn-group admin_box_update">
                        <button className="btn btn-secondary btn-sm popular m_right_20">
                            <span id="p_text" onClick={this.onCancelUpdate.bind(this)}>Cancel</span>
                        </button>
                        <button className="btn btn-secondary btn-sm popular m_right_20">
                            <span id="p_text" onClick={this.onUpdate.bind(this)}>Update</span>
                        </button>
                    </div>
                </div>
                <div className="header">
                    <small className="pull-left text-muted">
                        <span className="glyphicon glyphicon-time"></span>{this.props.message.time}</small>
                    <small className="pull-right text-muted">
                        <span className="glyphicon glyphicon-thumbs-up text_popular"></span>{this.props.message.like}</small>
                    <small className="pull-right text-muted space">|</small>
                    <small className="pull-right text-muted">
                        <span className="glyphicon glyphicon-thumbs-down text_popular"></span>{this.props.message.dislike}</small>
                </div>
            </div>
        </li>
        );
    }
}
export default AdminMessage;