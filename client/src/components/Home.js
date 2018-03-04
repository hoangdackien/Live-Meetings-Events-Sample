import React, { Component } from "react";
import 'bootstrap-datepicker';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.css'
import '../assets/css/home.css';
import moment from 'moment';
const $ = window.jQuery;
var that;
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            evt_name: "",
            date_from: "",
            date_to: "",
            admin_name: "",
            evt_code : "",
            audience_name : ""
        };

        this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
        this.handleJoinSubmit = this.handleJoinSubmit.bind(this);
    }
    handleChangeEventName(e) {
        this.setState({evt_name: e.target.value});
        
    }
    handleChangeAdminName(e) {
        this.setState({admin_name: e.target.value});
    }
    handleChangeEventCode(e) {
        this.setState({evt_code: e.target.value});
    }
    handleChangeAudienceName(e) {
        this.setState({audience_name: e.target.value});
    }    
    handleCreateSubmit(event) {
        this.props.handleCreate(this.state.evt_name, this.state.date_from, this.state.date_to, this.state.admin_name);
        event.preventDefault();
    }
    handleJoinSubmit(event) {
        this.props.handleJoin(this.state.evt_code, this.state.audience_name);
        event.preventDefault();
    }
    componentDidMount() {
        that = this;
        $('#form-date-from').datepicker({
            startDate: new Date(),
            autoclose: true,
        });
        $('#form-date-from').on('changeDate', function() {
            var date =  $('#form-date-from').datepicker('getDate');
            date = moment(date).startOf("day").toDate(); 
            that.setState({date_from: date});
            
        });
        $('#form-date-to').datepicker({
            startDate: new Date(),
            autoclose: true,
        });
        $('#form-date-to').on('changeDate', function() {
            var date =  $('#form-date-to').datepicker('getDate');
            date = moment(date).endOf("day").toDate(); 
            that.setState({date_to: date});
        });
    }
    render() {
        return (
        <div>
            <div className="top-content">
                <div className="inner-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8 col-sm-offset-2 text">
                                <h1>Audience Interaction Made Easy</h1>
                                <div className="description">
                                    <p className="force_center">
                                        Live Q&A and Polls for your Meetings & Events
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-sm-5">
                                <div className="form-box">
                                    <div className="form-top">
                                        <div className="form-top-left">
                                            <h3>JOIN EVENT</h3>
                                            <p>Enter event code to join</p>
                                        </div>
                                        <div className="form-top-right">
                                            <i className="fa fa-lock"></i>
                                        </div>
                                    </div>
                                    <div className="form-bottom">
                                        <form role="form" action="" method="" className="login-form" onSubmit={this.handleJoinSubmit.bind(this)}>
                                            <div className="form-group">
                                                <label className="sr-only" htmlFor="form-eventcode">Event Code</label>
                                                <input type="text" name="form-eventcode" placeholder="# Enter Event Code..." className="form-username form-control" id="form-username" required onChange={this.handleChangeEventCode.bind(this)}/>
                                            </div>
                                            <div className="form-group">
                                                <label className="sr-only" htmlFor="form-audiencename">Audience Name</label>
                                                <input type="text" name="form-audiencename" placeholder="Audience Name..." className="form-username form-control" id="form-username" onChange={this.handleChangeAudienceName.bind(this)}/>
                                            </div>
                                            <button type="submit" className="btn">Join</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-sm-1 middle-border"></div>
                            <div className="col-sm-1"></div>
                                
                            <div className="col-sm-5">
                                
                                <div className="form-box">
                                    <div className="form-top">
                                        <div className="form-top-left">
                                            <h3>CREATE EVENT</h3>
                                            <p>Fill in the form below to create event</p>
                                        </div>
                                        <div className="form-top-right">
                                            <i className="fa fa-pencil"></i>
                                        </div>
                                    </div>
                                    <div className="form-bottom">
                                        <form role="form" action="" method="" className="registration-form" onSubmit={this.handleCreateSubmit.bind(this)}>
                                            <div className="form-group">
                                                <label className="sr-only" htmlFor="form-event-name">Event Name</label>
                                                <input type="text" name="form-event-name" placeholder="Event Name..." className="form-event-name form-control" 
                                                id="form-event-name" required onChange={this.handleChangeEventName.bind(this)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="sr-only" htmlFor="form-date-from" >Date From</label>
                                                <input type="text" name="form-date-from" placeholder="Date From..." className="form-date-from form-control" 
                                                id="form-date-from" required data-date-format="dd/mm/yyyy"/>
                                                
                                            </div>
                                            <div className="form-group">
                                                <label className="sr-only" htmlFor="form-date-to">Date To</label>
                                                <input type="text" name="form-date-to" placeholder="Date To..." className="form-date-to form-control" 
                                                id="form-date-to" required data-date-format="dd/mm/yyyy" />
                                            </div>
                                            <div className="form-group">
                                                <label className="sr-only" htmlFor="form-admin-name">Admin Name</label>
                                                <input type="text" name="form-admin-name" placeholder="Admin Name..." className="form-admin-name form-control" id="form-admin-name" required onChange={this.handleChangeAdminName.bind(this)}/>
                                            </div>
                                            <button type="submit" className="btn">CREATE</button>
                                        </form>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 col-sm-offset-2">
                            <div className="footer-border"></div>
                            <p className="force_center">A sample realtime Meetings & Events, having a lot of fun. <i className="fa fa-smile-o"></i></p>
                        </div>
                        
                    </div>
                </div>
            </footer>
        </div>
        );
    }
}
export default Home;