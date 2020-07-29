import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import './detail.css';
import { message, Button, Card, Modal, Tag  } from 'antd';
import Loading from '../loading.js'
const { confirm } = Modal;


class List extends Component{
	state = {
	}
	getTeamInfo = (teamID = this.props.match.params.teamID) => {
		let url = global.constants.server + 'api/team/' + teamID + '/';
		$.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			async: true,
			success: function (result) {
				if (result.result){
					this.setState({team: result})
				}else{
					this.props.history.push('/');
				}
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getTeamInfo();
	}
	componentWillReceiveProps(nextProps){
		this.getTeamInfo(nextProps.match.params.teamID);
	}
	quitTeam = () => {
		let url = global.constants.server + 'api/team/quit/';
		$.post({
			url: url,
			async: true,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			success: function (result) {
				if (result.result){
					message.success(result.message)
				}else{
					message.error(result.message)
				}
				if (result.result){
					this.props.updateUser()
				}
			}.bind(this)
		})
	}
	applyTeam = (id) => {
		let url = global.constants.server + 'api/team/apply/' + id;
		$.post({
			url: url,
			async: true,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			success: function (result) {
				if (result.result){
					message.success(result.message)
				}else{
					message.error(result.message)
				}
				if (result.result){
					this.props.updateUser()
				}
			}.bind(this)
		})
	}
	giveConfirm = (title, content, onOk) => {
		confirm({
			title: title,
			content: content,
			onOk: onOk,
			onCancel() {},
		});
	}
	render(){
		if (this.state.team == null){
			return (
				<Loading/>
			)
		}
		const { user } = this.props
		const { teamID } = this.props.match.params
		let inThisTeam = false
		if (user){
			if (user.team){
				inThisTeam = user.team.id === this.state.team.id
			}else{
				inThisTeam = false
			}
		}
		return (
			<div  id = "root">
				<div  id = "team-name">
					{this.state.team.name}
				</div>
				<Card  id = "team-info">
					<div  className = "info-item">
						<div  className = "info-item-tip">
							Introduction : 
						</div>
						<div  className = "info-item-content">
							{this.state.team.introduction}
						</div>
					</div>
					
					<div  className = "info-item">
						<div  className = "info-item-tip">
							Caption : 
						</div>
						<div  className = "info-item-content">
							<Tag  color = "cyan">{this.state.team.captain.username}</Tag>
							
						</div>
					</div>
					
					<div  className = "info-item">
						<div  className = "info-item-tip">
							Members : 
						</div>
						<div  className = "info-item-content">
							{this.state.team.members.map((item) => {return (
								<Tag  color = "geekblue"  key = {item.id}>{item.username}</Tag>
							)})}
						</div>
					</div>
					<div  className = "team-info-opa">
						{user != null &&(
								inThisTeam === false ? (
									user.isMember === false &&(
										<Button type='primary' size = 'large' onClick={() => this.giveConfirm(
											'Apply confirm',
											'Do you want to apply as a member of ' + this.state.team.name + '?' +
											(user.team ? ('It will give up your application of ' + user.team.name) : ''),
											function(){this.applyTeam(this.state.team.id)}.bind(this)
										)}>
											Apply
										</Button>
									)
								) : user.isCaptain ? (
									<Button type='primary' size = 'large'>
										<Link to='/team/manage'>
											Manage
										</Link>
									</Button>
								) : user.isMember ? (
									<Button type='danger' size = 'large' onClick={() => this.giveConfirm(
										'Quit confirm',
										'Do you want to drop out of team ' + user.team.name + '?',
										this.quitTeam
									)}>
										Quit
									</Button>
								) : (
									<Button type='danger' size = 'large' onClick={() => this.giveConfirm(
										'Cancel confirm',
										'Do you want to cancel your application for team ' + user.team.name + '?',
										this.quitTeam
									)}>
										Cancel
									</Button>
								)
							)
						}
					</div>
				</Card>
			</div>
		)
	}
}

export default List;