import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { message, Button, Card, Col, Row } from 'antd';


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
			success: function (result) {
				this.setState({list : result});
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getList();
	}
	sendApplication = (id) => {
		let url = global.constants.server + 'team/apply/'
		$.post({
			url: url,
			data: {'id': id},
			crossDomain: true,
			async: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				message.success(result)
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
						console.log(item)
						return (
							<Col span={8} key={item.id}>
								<Card title={item.name} key={item.id} bodyStyle={{ height: 150, overflow: "auto" }}>
									<p>{item.introduction}</p>
									<Button type="primary" onClick={()=>this.sendApplication(item.id)}>Join them</Button>
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
