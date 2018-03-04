import React, { Component } from "react";
import AdminMassage from './AdminMessage';
import '../assets/css/admin_chat.css';
class Admin extends Component {
    constructor(props) {
        super(props);
    }
    handleUpdateMsg(msgid, msg){
        this.props.update(msgid, msg);
    }
    handelDelMsg(msgid){
        this.props.delete(msgid);
    }
    handleHighlight(msgid){
        this.props.highlight(msgid);
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
                                    <span className="glyphicon glyphicon-home"></span><span> {this.props.eventInfo.evt_name} ( joined : {this.props.joined} )</span>
                                </div>
                                <span className="glyphicon glyphicon-time"></span><span> {this.props.eventInfo.date_from} - {this.props.eventInfo.date_to}</span>
                                <div className="btn-group pull-right">
                                <span className="glyphicon glyphicon-share"></span> Join with us by <span className="evt_code">{this.props.eventInfo.evt_code}</span>
                                </div>
                            </div>
                        <div className="panel-collapse" id="collapseOne">
                            <div className="panel-body panel-body-admin">
                                <ul className="chat">
                                    {
                                        [].concat(this.props.messages).sort((a, b) => a.highlight < b.highlight)
                                        .map(function(msg, index) {
                                            return <AdminMassage key={index} message={msg} update={this.handleUpdateMsg.bind(this)} 
                                            delete={this.handelDelMsg.bind(this)} highlight={this.handleHighlight.bind(this)}/>
                                        }, this) 
                                    }
                                </ul>
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
export default Admin;