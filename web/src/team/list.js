import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { message, Button, Card, Col, Row } from 'antd';
import UserShow from '../user/show.js'


class List extends Component{
	state = {
	}
	getList = () => {
		let url = global.constants.server + 'team/list/'
		let data = {}
		if (this.props.contest){
			data['contest'] = this.props.contest.id
		}
		this.teamListRequest = $.get({
			url: url,
			data: data,
			crossDomain: true,
			async: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				this.setState({list : result});
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getList()
	}
	sendApplication = (id, cancel = false) => {
		let url = global.constants.server + 'team/apply/'
		$.post({
			url: url,
			data: {id: id, cancel: cancel},
			crossDomain: true,
			async: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				message.success(result)
				this.getList()
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	render(){
		if (this.state.list == null){
			return (
				<Loading/>
			)
		}
		return (
			<div  id = "root"  style = {{padding: this.props.padding ? this.props.padding : 60}}>
				<Row gutter={16}>
				{
					this.state.list.map((item, index) => {
						return (
							<Col span={8} key={item.id}>
								<Card title={item.name} key={item.id} bodyStyle={{ minHeight: 150, overflow: "auto" }} extra={
									item.application?(
										<Button type="danger" onClick={()=>this.sendApplication(item.id, true)}>Cancel</Button>
									):(
										<Button type="primary" onClick={()=>this.sendApplication(item.id)}>Join them</Button>
									)
										
								}>
									<div>
										{item.introduction}
									</div>
									<div style={{marginTop: 10, lineHeight: 2}}>
										<div>
											<b>Captain</b> :&nbsp;
											<UserShow
												username = {item.captain}
											/>
										</div>
										<div style = {{marginBottom: 15}}>
											<b>Members</b> :&nbsp;
											{item.members.map((user, index) => {
												return (
													<UserShow style={{marginLeft: 2}} key={user.username}
														mode = 'mini'
														username = {user.username}
														avatar = {user.avatar}
													/>
												)
											})}
										</div>
									</div>
								</Card>
							</Col>
						)
					})
					
				}
				</Row>
			</div>
		)
	}
}
export default List;
