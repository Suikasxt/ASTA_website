import '../config';
import $ from 'jquery';
import { withRouter, Link } from 'react-router-dom';
import React, { Component } from 'react';
import { message, Avatar, Tooltip } from 'antd';

class UserShow extends Component{
	state = {
	}
	componentWillMount(){
		if (this.props.username != null){
			if (this.props.avatar != null){
				this.setState({user: {username: this.props.username, avatar: this.props.avatar}})
				return
			}
			let url = global.constants.server + 'user/'
			$.get({
				url: url,
				data: {username: this.props.username},
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
						{user.username}
					</span>
				)
			}
		}
	}
}
export default UserShow;