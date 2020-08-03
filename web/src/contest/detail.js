import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
//import './detail.css';
import { message, Button, Card, Modal, Tag, Tabs, List} from 'antd';
import Loading from '../loading.js'
import TeamList from '../team/list.js';
import TeamAdmin from '../team/admin.js';
import BlogList from '../blog/list.js';
const { confirm } = Modal;
const { TabPane } = Tabs;

class Detail extends Component{
	state = {
		activeKey: 'home'
	}
	changeTabKey = (key) => {
		this.setState({activeKey: key})
	}
	getInfo = (id = this.props.match.params.id) => {
		let url = global.constants.server + 'contest/'
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
	tabChage = (key) => {
		this.changeTabKey(key)
	}
	render(){
		if (this.state.data == null){
			return (
				<Loading/>
			)
		}
		const { user } = this.props
		const { id } = this.props.match.params
		return (
			<div id = "root">
				<div className='title'> {this.state.data.name} </div>
				<Tabs activeKey={this.state.activeKey} onTabClick={this.tabChage}>
					<TabPane tab="Home" key="home">
						<div dangerouslySetInnerHTML={{ __html: this.state.data.detail}}></div>
					</TabPane>
					
					<TabPane tab="Blogs" key="blog">
						<BlogList
							user={this.props.user}
							padding={10}
							tag={this.state.data.name}
							{...this.props}
						/>
					</TabPane>
					<TabPane tab="My Team" key="admin">
						<TeamAdmin
							changeTabKey={this.changeTabKey}
							contestId={id}
							padding={10}
							{...this.props}
						/>
					</TabPane>
					<TabPane tab="Team List" key="team">
						<TeamList
							user={this.props.user}
							contestId={id}
							padding={10}
							{...this.props}
						/>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}

export default Detail;