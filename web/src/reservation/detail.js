import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import './detail.css';
import { message, Button, Card, Modal, Tag, Tabs, List, Popconfirm} from 'antd';
import MarkdownView from '../markdown/view.js';
import UserShow from '../user/show.js';
import Loading from '../loading.js';

const { confirm } = Modal;
const { TabPane } = Tabs;


const Week = new Array('Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri', 'Sat')

function number2String(number, l){
	let str = number.toString();
	while (str.length < l){
		str = '0' + str;
	}
	return str;
}

function time2percent4Day(time){
	let res;
	console.log(time);
	return ((time.getHours()*60 + time.getMinutes())*60 + time.getSeconds())/24/60/60;
}

class TimeShow extends Component{
	state = {
		staticTimeline: new Array({0:0, 1:0}, {0:6, 1:0}, {0:12, 1:0}, {0:18, 1:0}, {0:24, 1:0}),
	}
	getInfo = (id = this.props.id, startTime = this.state.startTime, endTime = this.state.endTime) => {
		let url = global.constants.server + 'reservation/data/'
		$.get({
			url: url,
			crossDomain: true,
			data: { id: id, startTime: startTime.getTime(), endTime: endTime.getTime() },
			xhrFields: {
				withCredentials: true
			},
			async: true,
			success: function (result) {
				this.setState({data: result})
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	componentWillMount(){
		let startTime = new Date();
		startTime.setHours(0, 0, 0, 0);
		
		let dayNumber = 7;
		if (this.props.dayNumber){
			dayNumber = this.props.dayNumber;
		}
		
		let endTime = new Date(startTime);
		endTime.setDate(endTime.getDate()+dayNumber);
		this.state.startTime = startTime;
		this.state.endTime = endTime;
		this.state.dayNumber = dayNumber;
		
		this.getInfo();
	}
	sendApply = (id, startTime, endTime) => {
		let url = global.constants.server + 'reservation/apply/'
		$.post({
			url: url,
			crossDomain: true,
			data: { id: id, startTime: startTime.getTime(), endTime: endTime.getTime() },
			xhrFields: {
				withCredentials: true
			},
			async: true,
			success: function (result) {
				message.success(result)
				this.getInfo();
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	render(){
		if (this.state.data == null){
			return (
				<Loading/>
			)
		}
		let { startTime, dayNumber } = this.state;
		let timeData = new Array(dayNumber);
		const { available, used } = this.state.data;
		let n = available.length;
		let m = used.length;
		for (let i = 0; i < dayNumber; i++){
			let DateNow = new Date(this.state.startTime);
			DateNow.setDate(DateNow.getDate()+i);
			let item =
				{
					date : (DateNow.getMonth()+1) + '/' + number2String(DateNow.getDate(), 2),
					week : Week[DateNow.getDay()],
					available : new Array(),
					used : new Array(),
				};
				
			let startTime = new Date(DateNow);
			let endTime = new Date(DateNow);
			endTime.setHours(23, 59, 59);
			for (let j = 0; j < n; j++){
				let itemStartTime = new Date(available[j].startTime);
				let itemEndTime = new Date(available[j].endTime);
				if (itemStartTime > endTime || itemEndTime < startTime){
					continue;
				}
				if (itemStartTime < startTime){
					itemStartTime = startTime;
				}
				if (itemEndTime > endTime){
					itemEndTime = endTime;
				}
				item.available.push({id:available[j].id, st: itemStartTime, et: itemEndTime});
			}
			for (let j = 0; j < m; j++){
				let itemStartTime = new Date(used[j].startTime);
				let itemEndTime = new Date(used[j].endTime);
				if (itemStartTime > endTime || itemEndTime < startTime){
					continue;
				}
				if (itemStartTime < startTime){
					itemStartTime = startTime;
				}
				if (itemEndTime > endTime){
					itemEndTime = endTime;
				}
				item.used.push({st: itemStartTime, et: itemEndTime, user: used[j].user});
			}
			timeData[i] = item;
		}
		let timelineHeight = 400;
		let itemHeight = 30;
		return(
			<div className = "timeShow">
				<div className = "timeShow-index">
					<div className = "timeShow-title">
					</div>
					<div className = "timeShow-timeline" style={{height: timelineHeight}}>
					{
						this.state.staticTimeline.map((item, index) =>{
							return(
								<div className = "timeShow-index-item" 
									key = {index}
									style={{top: (item[0]*60+item[1])/(24*60)*(timelineHeight - itemHeight), height: itemHeight}}
								>
									{number2String(item[0], 2) + ':' + number2String(item[1], 2)}
								</div>
							)
						})
					}
					</div>
				</div>
				
				{timeData.map((item, index) => {
					return(
						<div className = "timeShow-item" key = {index}>
							<div className = "timeShow-title">
								<div>
									{ item.date }
								</div>
								<div>
									{ item.week }
								</div>
							</div>
							<div className = "timeShow-timeline" style={{height: timelineHeight}}>
								{item.available.map((item, index) =>{
									return(
										<Popconfirm
											key = {index}
											title="Are you sure to reserve it?"
											onConfirm={()=>this.sendApply(item.id, item.st, item.et)}
											okText="Yes"
											cancelText="No"
										>
											<div className = "timeShow-item-block timeShow-item-block-available"
												style={{
													top: parseInt(time2percent4Day(item.st)*timelineHeight),
													height: parseInt((time2percent4Day(item.et)-time2percent4Day(item.st))*timelineHeight),
												}}
											/>
										</Popconfirm>
									)
								})}
								{item.used.map((item, index) =>{
									return(
										<div className = "timeShow-item-block timeShow-item-block-used" key = {index}
											style={{
												top: parseInt(time2percent4Day(item.st)*timelineHeight),
												height: parseInt((time2percent4Day(item.et)-time2percent4Day(item.st))*timelineHeight),
											}}
										>
											<UserShow id={item.user}/>
										</div>
									)
								})}
							</div>
						</div>
					)
				})}
			</div>
		)
	}
}

class Detail extends Component{
	state = {
	}
	getInfo = (id = this.props.match.params.id) => {
		let url = global.constants.server + 'reservation/'
		$.get({
			url: url,
			crossDomain: true,
			data: {'id': id},
			xhrFields: {
				withCredentials: true
			},
			async: true,
			success: function (result) {
				this.setState({data: result})
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	componentWillMount(){
		this.getInfo()
	}
	componentWillReceiveProps(nextProps){
		this.props = nextProps
		this.getInfo()
	}
	render(){
		if (this.state.data == null){
			return (
				<Loading/>
			)
		}
		const { user } = this.props;
		const { id } = this.props.match.params;
		const { data } = this.state;
		return (
			<div id = "root">
				<div className='title'> {data.name} </div>
				<div align='center'>
					<TimeShow id = {id}/>
				</div>
				<div style={{padding: 30}}>
					<MarkdownView
						source={data.introduction}
					/>
				</div>
			</div>
		)
	}
}

export default Detail;