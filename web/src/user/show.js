import '../config';
import $ from 'jquery';
import { withRouter, Link } from 'react-router-dom';
import React, { Component } from 'react';
import { message, Avatar, Tooltip } from 'antd';
import './show.css'

class UserShow extends Component{
	state = {
	}
	updateUser = (data) => {
		if (data.username != null){
			if (data.avatar != null){
				this.setState({user: {username: data.username, avatar: data.avatar}})
				return
			}
			let url = global.constants.server + 'user/'
			$.get({
				url: url,
				data: {username: data.username},
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				success: function (result) {
					this.setState({user: result})
				}.bind(this),
				error: function (result) {
					message.error(result.responseText)
				}.bind(this),
			});
		}
	}
	componentWillMount(){
		this.updateUser(this.props)
	}
	componentWillReceiveProps(nextProps){
		this.updateUser(nextProps)
	}
	render(){
		if (this.state.user == null){
			return (
				<span>
					<Avatar size={24} icon = "user"  />
					Loading
				</span>
			)
		}else{
			let {user} = this.state;
			if (this.props.mode && this.props.mode == 'mini'){
				return (
					<Tooltip title={user.username}>
						<Avatar size={24} src = {global.constants.server + user.avatar} />
					</Tooltip>
				)
			}else{
				return (
					<span>
						<Avatar size={24} src = {global.constants.server + user.avatar} />
						<span className='username'>{user.username}</span>
					</span>
				)
			}
		}
	}
}
export default UserShow;