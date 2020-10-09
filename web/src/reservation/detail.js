import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import './detail.css';
import { message, Button, Card, Modal, Tag, Tabs, List, DatePicker, TimePicker, Tooltip} from 'antd';
import MarkdownView from '../markdown/view.js';
import UserShow from '../user/show.js';
import Loading from '../loading.js';
import moment from 'moment';

const { confirm } = Modal;
const { TabPane } = Tabs;


const Week = new Array('Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.')

function number2String(number, l){
	let str = number.toString();
	while (str.length < l){
		str = '0' + str;
	}
	return str;
}
function max(a, b){return a>b?a:b;}
function min(a, b){return a<b?a:b;}
function getDateString(time = new Date()){
	return time.getFullYear() + '-' + number2String(time.getMonth()+1, 2) + '-' + number2String(time.getDate(), 2);
}
function getTimeString(time = new Date(), UTC = false, h = true, m = true, s = true){
	let res = '';
	let flag = new Array(h, m, s);
	let number = new Array(time.getHours(), time.getMinutes(), time.getSeconds());
	if (UTC) number[0] = time.getUTCHours();
	for (let i = 0; i < 3; i++)
	if (flag[i]){
		res += res == ''? '' : ':';
		res += number2String(number[i], 2);
	}
	return res;
}
function time2percent4Day(time){
	let res;
	return ((time.getHours()*60 + time.getMinutes())*60 + time.getSeconds())/24/60/60;
}
function time2percent4UTCDay(time){
	let res;
	return ((time.getUTCHours()*60 + time.getUTCMinutes())*60 + time.getUTCSeconds())/24/60/60;
}
function timeDivide(number){
	let list = new Array(new Array(1, 2, 3, 4, 6, 12, 24), new Array(1, 2, 4, 6, 12, 30, 60), new Array(1, 2, 4, 6, 12, 30, 60));
	let res = 1;
	for (let i = 0; i < list.length; i++){
		let maxN = list[i][list[i].length-1];
		if (number >= maxN){
			res *= maxN;
			number /= maxN;
			continue;
		}
		for (let j = 0; j < list[i].length; j++){
			if (number < list[i][j+1]){
				res *= list[i][j];
				number /= list[i][j];
				break;
			}
		}
		break;
	}
	return res;
}
function getOneDayTime(){
	let oneDay = new Date(0);
	oneDay.setDate(oneDay.getDate()+1);
	return oneDay.getTime();
}

const defaultTimelineHeight = 400;
const defaultItemHeight = 30;
const timeSpaceHeight = 2;
class TimeShow extends Component{
	state = {
		formVisible: false,
		formSubmitLoading: false,
		startDatePick: getDateString(new Date()),
		endDatePick: getDateString(new Date()),
		startTimePick: getTimeString(new Date()),
		endTimePick: getTimeString(new Date()),
	}
	moveState = 0
	moveRecord = null
	timeBlock = new Array()
	timeTip = new Array()
	timeAvai = new Array()
	timeline = new Array()
	changeTimeStage = (st, et) => {
		st = max(st, 0);
		et = min(et, getOneDayTime());
		this.setState({startTime: new Date(st), endTime: new Date(et)});
	}
	showForm = (startDatePick = this.state.startDatePick, startTimePick = this.state.startTimePick, endDatePick = this.state.startDatePick, endTimePick = this.state.endTimePick) => {
		this.setState({
			formVisible: true,
			startDatePick: startDatePick,
			endDatePick: endDatePick,
			startTimePick: startTimePick,
			endTimePick: endTimePick,
		});
	}
	onCancel = () => {
		this.setState({formVisible: false});
	}
	startDateChange = (date, dateString) => {
		this.setState({startDatePick: dateString});
	}
	endDateChange = (date, dateString) => {
		this.setState({endDatePick: dateString});
	}
	startTimeChange = (date, dateString) => {
		this.setState({startTimePick: dateString});
	}
	endTimeChange = (date, dateString) => {
		this.setState({endTimePick: dateString});
	}
	onSubmit = () => {
		let url = global.constants.server + 'reservation/apply/';
		let data = {
			startTime: new Date(this.state.startDatePick + ' ' + this.state.startTimePick).getTime(),
			endTime: new Date(this.state.endDatePick + ' ' + this.state.endTimePick).getTime(),
		};
		const list = this.state.data;
		for (let i = 0; i < list.length; i++){
			if (data.startTime >= list[i].available.startTime && data.endTime <= list[i].available.endTime){
				data.id = list[i].available.id;
			}
		}
		$.post({
			url: url,
			crossDomain: true,
			data: data,
			xhrFields: {
				withCredentials: true
			},
			async: true,
			beforeSend: function (result) {
				this.setState({ formSubmitLoading: false });
			}.bind(this),
			success: function (result) {
				message.success(result);
				this.getInfo();
			}.bind(this),
			error: function (result) {
				message.error(result.responseText);
			}.bind(this),
			complete: function (result) {
				this.setState({ formVisible: false });
				this.setState({ formSubmitLoading: false });
			}.bind(this),
		});
	}
	sendCancel = (id) => {
		let url = global.constants.server + 'reservation/cancel/';
		$.post({
			url: url,
			crossDomain: true,
			data: {id: id},
			xhrFields: {
				withCredentials: true
			},
			async: true,
			beforeSend: function (result) {
				this.setState({ formSubmitLoading: false });
			}.bind(this),
			success: function (result) {
				message.success(result);
				this.getInfo();
			}.bind(this),
			error: function (result) {
				message.error(result.responseText);
			}.bind(this),
		});
	}
	dataSet = (data) => {
		let available = new Array();
		let used = new Array();
		let oneDayTime = getOneDayTime();
		let offset = new Date().getTimezoneOffset()*(oneDayTime/24/60);
		let minTime = this.state.endTime;
		let maxTime = this.state.startTime;
		let full = false;
		for (let i = 0; i < data.length; i++){
			data[i].used.sort((a, b)=>{return a.startTime - b.startTime});
			if (parseInt((data[i].available.startTime - offset)/oneDayTime) != parseInt((data[i].available.endTime - offset)/oneDayTime)){
				full = true;
			}
			let stClock = (data[i].available.startTime - offset)%oneDayTime;
			let etClock = (data[i].available.endTime - offset)%oneDayTime;
			if (stClock < minTime.getTime()) minTime = new Date(stClock);
			if (etClock > maxTime.getTime()) maxTime = new Date(etClock);
			
			let last = data[i].available.startTime;
			for (let j = 0; j < data[i].used.length; j++){
				used.push(data[i].used[j]);
				if (data[i].used[j].startTime > last){
					available.push({id: data[i].available.id, startTime: last, endTime: data[i].used[j].startTime});
				}
				last = data[i].used[j].endTime;
			}
			if (data[i].available.endTime > last){
				available.push({id: data[i].available.id, startTime: last, endTime: data[i].available.endTime});
			}
		}
		this.setState({data, available, used});
		if (minTime < maxTime && full == false){
			this.setState({startTime: minTime, endTime: maxTime});
		}
	}
	getInfo = (id = this.props.id, startDate = this.state.startDate, endDate = this.state.endDate) => {
		let url = global.constants.server + 'reservation/data/'
		$.get({
			url: url,
			crossDomain: true,
			data: { id: id, startTime: startDate.getTime(), endTime: endDate.getTime() },
			xhrFields: {
				withCredentials: true
			},
			async: true,
			success: function (result) {
				this.dataSet(result);
			}.bind(this),
			error: function (result) {
				message.error(result.responseText);
			}.bind(this),
		})
	}
	componentWillMount(){
		let startDate = new Date();
		startDate.setHours(0, 0, 0, 0);
		
		let dayNumber = 7;
		if (this.props.dayNumber){
			dayNumber = this.props.dayNumber;
		}
		
		let endDate = new Date(startDate);
		endDate.setDate(endDate.getDate()+dayNumber);
		
		let startTime = new Date(0);
		let endTime = new Date(startTime);
		endTime.setDate(endTime.getDate()+1);
		
		this.state.startDate = startDate;
		this.state.endDate = endDate;
		this.state.dayNumber = dayNumber;
		this.state.startTime = startTime;
		this.state.endTime = endTime;
		
		this.getInfo();
	}
	componentDidUpdate(){
		var list = document.getElementsByClassName('timeShow-timeline');
		for (let i = 0; i < list.length; i++){
			list[i].addEventListener('wheel', this.handleScroll, {passive: false});
		}
	}
	handleScroll = (e) => {
		let pos = (e.pageY - this.timeline[0].offsetTop) / this.timelineHeight;
		let { startTime, endTime }= this.state;
		let mid = startTime.getTime() * (1-pos) + endTime.getTime() * pos;
		let rate = 0.8, st, et;
		if (e.deltaY <= 0) {
			/* scrolling up */
			e.preventDefault();
			st = mid - (mid - startTime.getTime()) * rate;
			et = mid - (mid - endTime.getTime()) * rate;
		}
		else
		{
			/* scrolling down */
			e.preventDefault();
			st = mid - (mid - startTime.getTime()) / rate;
			et = mid - (mid - endTime.getTime()) / rate;
		}
		this.changeTimeStage(st, et);
	}
	getTimeTip = (e, item = null) => {
		let oneDayTime = getOneDayTime();
		let stPercent = this.state.startTime.getTime() / oneDayTime;
		let etPercent = this.state.endTime.getTime() / oneDayTime;
		let percent = (e.nativeEvent.pageY - this.timeline[0].offsetTop) / this.timelineHeight * (etPercent - stPercent) + stPercent;
		let spaceIndex = parseInt(percent*this.timeSpaceNumber + 0.5);
		let timeNow = new Date(oneDayTime / this.timeSpaceNumber * spaceIndex);
		if (item != null){
			if (timeNow < item.st) timeNow = item.st;
			if (timeNow > item.et) timeNow = item.et;
		}
		return timeNow;
	}
	render(){
		if (this.state.data == null){
			return (
				<Loading/>
			)
		}
		let { startDate, dayNumber } = this.state;
		this.timelineHeight = defaultTimelineHeight;
		let itemHeight = defaultItemHeight;
		let timeData = new Array(dayNumber);
		const data = this.state.data;
		const {available, used} = this.state;
		let n = available.length;
		let m = used.length;
		let staticTimeline = new Array();
		
		let startPercent = time2percent4UTCDay(this.state.startTime);
		let endPercent = time2percent4UTCDay(this.state.endTime);
		if (this.state.endTime.getUTCDate() == 2) endPercent = 1;
		let lengthPercent = endPercent - startPercent;
		
		this.indexItemNumber = timeDivide(parseInt(this.timelineHeight / itemHeight / (endPercent - startPercent)));
		this.timeSpaceNumber = timeDivide(parseInt(this.timelineHeight / timeSpaceHeight / (endPercent - startPercent)));
		let tmp1 = new Date(0);
		let tmp2 = new Date(0);
		tmp2.setDate(tmp1.getDate()+1);
		let singleClock = new Date((tmp2-tmp1)/this.indexItemNumber);
		for (let i = 0; i <= this.indexItemNumber; i++){
			let item = new Date(singleClock.getTime() * i);
			if (item >= this.state.startTime && item <= this.state.endTime){
				staticTimeline.push({
					percent: i == this.indexItemNumber?1:time2percent4UTCDay(item),
					text: 	number2String(i == this.indexItemNumber?24:item.getUTCHours(), 2)
						+ ':' + number2String(item.getMinutes(), 2)
						+ (this.indexItemNumber>24*60?':' + number2String(item.getSeconds(), 2):''),
				});
			}
		}
		
		let avaiCount = 0;
		let usedCount = 0;
		for (let i = 0; i < dayNumber; i++){
			let DateNow = new Date(startDate);
			DateNow.setDate(DateNow.getDate()+i);
			let item =
				{
					date : (DateNow.getMonth()+1) + '/' + number2String(DateNow.getDate(), 2),
					week : Week[DateNow.getDay()],
					detailDate : DateNow,
					available : new Array(),
					used : new Array(),
				};
				
			let startTime = new Date(DateNow.getTime() + this.state.startTime.getTime());
			let endTime = new Date(DateNow.getTime() + this.state.endTime.getTime());
			for (let j = 0; j < n; j++){
				let itemStartTime = new Date(available[j].startTime);
				let itemEndTime = new Date(available[j].endTime);
				if (itemStartTime > endTime || itemEndTime < startTime){
					continue;
				}
				let title;
				if (itemStartTime.getSeconds() == 0 && itemEndTime.getSeconds() == 0){
					title = getTimeString(itemStartTime, false, true, true, false) + '~' + getTimeString(itemEndTime, false, true, true, false);
				}else{
					title = getTimeString(itemStartTime) + '~' + getTimeString(itemEndTime);
				}
				
				if (itemStartTime < startTime){
					itemStartTime = startTime;
				}
				if (itemEndTime > endTime){
					itemEndTime = endTime;
				}
				
				item.available.push({
					index: avaiCount,
					id:available[j].id,
					st: new Date(itemStartTime - DateNow),
					et: new Date(itemEndTime - DateNow),
					title: title
				});
				avaiCount++;
			}
			for (let j = 0; j < m; j++){
				let itemStartTime = new Date(used[j].startTime);
				let itemEndTime = new Date(used[j].endTime);
				if (itemStartTime > endTime || itemEndTime < startTime){
					continue;
				}
				let title;
				if (itemStartTime.getSeconds() == 0 && itemEndTime.getSeconds() == 0){
					title = {start: getTimeString(itemStartTime, false, true, true, false), end: getTimeString(itemEndTime, false, true, true, false)};
				}else{
					title = {start: getTimeString(itemStartTime), end: getTimeString(itemEndTime)};
				}
				
				if (itemStartTime < startTime){
					itemStartTime = startTime;
				}
				if (itemEndTime > endTime){
					itemEndTime = endTime;
				}
				item.used.push({
					index: usedCount,
					id: used[j].id,
					st: new Date(itemStartTime - DateNow),
					et: new Date(itemEndTime - DateNow),
					user: used[j].user,
					title: title
				});
				usedCount++;
			}
			timeData[i] = item;
		}
		
		return(
			<div
				onPointerUp={(e) =>{
					if (this.moveState == 2){
						let oneDayTime = getOneDayTime();
						let timeNow = this.getTimeTip(e, this.currentAvaiItem);
						let percent = timeNow.getTime() / oneDayTime;
						this.timeEndRecord = timeNow;
						this.timeBlock[this.currentIndex].style.display = 'none';
						/*
						this.timeBlock[this.currentIndex].style.height = '1px';
						this.timeBlock[this.currentIndex].style.top = ((percent - this.state.startTime.getTime() / oneDayTime) / ((this.state.endTime - this.state.startTime) / oneDayTime) * this.timelineHeight - this.timeAvai[this.currentIndex].offsetTop) + 'px';
						this.timeTip[this.currentIndex].innerHTML = getTimeString(timeNow, true, true, true, this.timeSpaceNumber>24*60);
						*/
						if (this.timeStartRecord.getTime() == this.timeEndRecord.getTime()){
							this.showForm(
								getDateString(this.dateNowRecord), getTimeString(this.currentAvaiItem.st, true),
								getDateString(this.dateNowRecord), getTimeString(this.currentAvaiItem.et, true));
						}else{
							this.showForm(
								getDateString(this.dateNowRecord), getTimeString(min(this.timeStartRecord, this.timeEndRecord), true),
								getDateString(this.dateNowRecord), getTimeString(max(this.timeStartRecord, this.timeEndRecord), true));
						}
					}
					this.moveState = 0;
				}}
				onPointerLeave={(e) => {
					if (this.moveState == 2){
						this.timeBlock[this.currentIndex].style.display = 'none';
						if (this.timeStartRecord.getTime() == this.timeEndRecord.getTime()){
							this.showForm(
								getDateString(this.dateNowRecord), getTimeString(this.currentAvaiItem.st, true),
								getDateString(this.dateNowRecord), getTimeString(this.currentAvaiItem.et, true));
						}else{
							this.showForm(
								getDateString(this.dateNowRecord), getTimeString(min(this.timeStartRecord, this.timeEndRecord), true),
								getDateString(this.dateNowRecord), getTimeString(max(this.timeStartRecord, this.timeEndRecord), true));
						}
					}
					this.moveState = 0;
				}}
				onPointerMove={(e) => {
					let oneDayTime = getOneDayTime();
					if (this.moveState == 1){
						let deltaX = e.pageX - this.moveRecord.X;
						let deltaY = e.pageY - this.moveRecord.Y;
						
						let percent = deltaY / this.timelineHeight;
						const { startTime, endTime } = this.state;
						let st = startTime.getTime();
						let et = endTime.getTime();
						let length = (et - st)*percent;
						length = min(length, st);
						length = max(length, et - oneDayTime);
						this.changeTimeStage(st - length, et - length);
						
						this.moveRecord = {X:e.pageX, Y:e.pageY};
					}else if (this.moveState == 2){
						let timeNow = this.getTimeTip(e, this.currentAvaiItem);
						this.timeEndRecord = timeNow;
						let percent = timeNow.getTime() / oneDayTime;
						let startPercent = this.timeStartRecord.getTime() / oneDayTime;
						let endPercent = this.timeEndRecord.getTime() / oneDayTime;
						if (startPercent > endPercent){
							let tmp = startPercent;
							startPercent = endPercent;
							endPercent = tmp;
						}
						this.timeBlock[this.currentIndex].style.display = 'flex';
						this.timeBlock[this.currentIndex].style.top = ((startPercent - this.state.startTime.getTime() / oneDayTime) / ((this.state.endTime - this.state.startTime) / oneDayTime) * this.timelineHeight - this.timeAvai[this.currentIndex].offsetTop) + 'px';
						this.timeBlock[this.currentIndex].style.height = ((endPercent - startPercent) / ((this.state.endTime - this.state.startTime) / oneDayTime) * this.timelineHeight) + 'px';
						
						this.timeTip[this.currentIndex].innerHTML =
							getTimeString(min(this.timeStartRecord, this.timeEndRecord), true, true, true, this.timeSpaceNumber>24*60) + '~' + 
							getTimeString(max(this.timeStartRecord, this.timeEndRecord), true, true, true, this.timeSpaceNumber>24*60);
					}
				}}
			>
				<Modal
					visible={this.state.formVisible}
					title="Reservation"
					onCancel={this.onCancel}
					onOk={this.onSubmit}
					footer={[
						<Button key="back" onClick={this.onCancel}>
							Cancel
						</Button>,
						<Button key="submit" type="primary" loading={this.state.formSubmitLoading} onClick={this.onSubmit}>
							Submit
						</Button>,
					]}
				>
					<div>
						Start :&nbsp;
						<DatePicker value={moment(this.state.startDatePick, "YYYY-MM-DD")} onChange={this.startDateChange}/>
						<TimePicker value={moment(this.state.startTimePick, "HH:mm:ss")} onChange={this.startTimeChange}/>
					</div>
					<br/>
					<div>
						 End :&nbsp;
						<DatePicker value={moment(this.state.endDatePick, "YYYY-MM-DD")} onChange={this.endDateChange}/>
						<TimePicker value={moment(this.state.endTimePick, "HH:mm:ss")} onChange={this.endTimeChange}/>
					</div>
				</Modal>
				<div className = "timeShow">
					<div className = "timeShow-index">
						<div className = "timeShow-title">
						</div>
						<div
							className = "timeShow-timeline"
							style={{height: this.timelineHeight}}
							onPointerDown={(e) => {this.moveState = 1; this.moveRecord = {X:e.pageX, Y:e.pageY};}}
						>
						{
							staticTimeline.map((item, index) =>{
								let lastOne = index == staticTimeline.length-1;
								return(
									<div className = "timeShow-index-item" 
										key = {index}
										style={{top: (item.percent - startPercent) / lengthPercent * (this.timelineHeight - itemHeight), height: itemHeight}}
									>
										{item.text}
									</div>
								)
							})
						}
						</div>
					</div>
					
					{timeData.map((dayItem, dayIndex) => {
						return(
							<div className = "timeShow-item" key = {dayIndex}>
								<div className = "timeShow-title">
									<div>
										{ dayItem.date }
									</div>
									<div>
										{ dayItem.week }
									</div>
								</div>
								<div 
									className = "timeShow-timeline"
									ref={(ref)=>this.timeline[dayIndex]=ref}
									style={{height: this.timelineHeight}}
									onPointerDown={(e) => {
										if (e.nativeEvent.target == this.timeline[dayIndex]){
											this.moveState = 1;
											this.moveRecord = {X:e.pageX, Y:e.pageY};
										}
									}}
									//onWheel={(e) => this.handleScroll(e)}
								>
									{dayItem.used.map((item, index) =>{
										let top = (time2percent4UTCDay(item.st) - startPercent) / lengthPercent * this.timelineHeight;
										let height = (time2percent4UTCDay(item.et)-time2percent4UTCDay(item.st)) / lengthPercent *this.timelineHeight;
										let cancelShow = this.props.user != null && item.user == this.props.user.id && ((item.et.getTime() + dayItem.detailDate.getTime()) > new Date().getTime());
										let insideNode = (
											<div className = "timeShow-used-inside">
												<UserShow id={item.user}/>
												<div style={{fontSize: 15}}>
													{item.title.start}
													~
													{item.title.end}
												</div>
												{cancelShow && (
													<Button type='danger' style={{marginRight: 0}} onClick={()=>this.sendCancel(item.id)}>Cancel</Button>
												)}
											</div>
										)
										if (height > 80 || (height>50 && cancelShow==false)){
											return(
												<div className = "timeShow-item-block timeShow-item-block-used" key = {index}
													style={{
														top: top,
														height: height,
													}}
												>
													{insideNode}
												</div>
											)
										}else{
											return(
												<Tooltip title={insideNode} key = {index}>
													<div className = "timeShow-item-block timeShow-item-block-used"
														style={{
															top: top,
															height: height,
														}}
													/>
												</Tooltip>
											)
										}
									})}
									{dayItem.available.map((item, index) =>{
										
										let top = (time2percent4UTCDay(item.st) - startPercent) / lengthPercent * this.timelineHeight;
										let height = (time2percent4UTCDay(item.et) - time2percent4UTCDay(item.st)) / lengthPercent * this.timelineHeight;
										
										return(
											<Tooltip title={item.title} key = {index} placement="right">
												<div 
													className = "timeShow-item-block timeShow-item-block-available"
													onPointerDown={(e)=>{
														let timeNow = this.getTimeTip(e, item);
														this.moveState = 2;
														this.timeStartRecord = timeNow;
														this.dateNowRecord = dayItem.detailDate;
														this.currentIndex = item.index;
														this.currentAvaiItem = item;
														//()=>this.showForm(getDateString(item.st), getTimeString(item.st), getDateString(item.et), getTimeString(item.et))
													}}
													ref={(ref)=>this.timeAvai[item.index]=ref}
													onPointerMove = {(e)=>{
														let oneDayTime = getOneDayTime();
														let timeNow = this.getTimeTip(e, item);
														this.timeEndRecord = timeNow;
														let percent = timeNow.getTime() / oneDayTime;
														if (this.moveState == 0){
															this.timeBlock[item.index].style.display = 'flex';
															this.timeBlock[item.index].style.height = '1px';
															this.timeBlock[item.index].style.top = ((percent - this.state.startTime.getTime() / oneDayTime) / ((this.state.endTime - this.state.startTime) / oneDayTime) * this.timelineHeight - this.timeAvai[item.index].offsetTop) + 'px';
															this.timeTip[item.index].innerHTML = getTimeString(timeNow, true, true, true, this.timeSpaceNumber>24*60);
														}
													}}
													onPointerLeave = {(e)=>{
														if (this.moveState != 2){
															this.timeBlock[item.index].style.display = 'none';
														}
													}}
													style={{
														top: top,
														height: height,
													}}
												>
														<div
															className = "timeShow-item-block timeShow-item-block-select"
															ref={(ref)=>this.timeBlock[item.index]=ref}
															style={{
																display: 'none',
															}}
														>
															<div
																className = "timeShow-tip"
																ref={(ref)=>this.timeTip[item.index]=ref}
															/>
														</div>
												</div>
											</Tooltip>
										)
									})}
								</div>
							</div>
						)
					})}
				</div>
				<br/>
				<Button type="primary" onClick={()=>this.showForm()}>
					Edit Reservation
				</Button>
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
				withCredentials: true,
			},
			async: true,
			success: function (result) {
				this.setState({data: result});
				this.forceUpdate();
			}.bind(this),
			error: function (result) {
				message.error(result.responseText);
			}.bind(this),
		})
	}
	componentWillMount(){
		this.getInfo();
	}
	componentWillReceiveProps(nextProps){
		this.props = nextProps;
		this.getInfo();
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
					<TimeShow id = {id} {...this.props}/>
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