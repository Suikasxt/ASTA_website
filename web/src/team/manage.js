import '../config';
import $ from 'jquery';
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Card, Modal, Empty, message } from 'antd';
import Loading from '../loading.js'
import './manage.css'
const { confirm } = Modal;
const { TextArea } = Input;


class Manage extends Component{
	state = {
		team: null
	}
	getTeamInfo = () => {
		let url = global.constants.server + 'api/team/';
		$.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			async: true,
			success: function (result) {
				this.setState({team: result})
			}.bind(this)
		})
	}
	sendManage = (data) => {
		let url = global.constants.server + 'api/team/manage/';
		this.updateRequest = $.post({
			url: url,
			data: data,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				if (result.result){
					message.success(result.message)
					this.props.updateUser()
					this.getTeamInfo()
					this.forceUpdate()
				}else{
					message.error(result.message)
				}
			}.bind(this)
		});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let url = global.constants.server + 'api/team/manage/';
				this.updateRequest = $.post({
					url: url,
					data: values,
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					success: function (result) {
						if (result.result){
							message.success(result.message)
							this.props.updateUser()
							this.getTeamInfo()
							this.forceUpdate()
						}else{
							message.error(result.message)
						}
					}.bind(this)
				});
			}
		});
	};
	giveConfirm = (title, content, onOk) => {
		confirm({
			title: title,
			content: content,
			onOk: onOk,
			onCancel() {},
		});
	}
	componentWillMount(){
		this.getTeamInfo();
	}

	render(){
		if (this.state.team == null){
			return (
				<Loading />
			)
		}
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 16,
					offset: 8,
				},
			},
		};
		return (
			<div  id = "root">
				<div  id = "team-name">
					{this.state.team.name ? this.state.team.name : "Not in any team now"}
				</div>
				<Card  title = {this.state.team.name ? "Team Information" : "Create a new team" + ((this.props.user && this.props.user.team) ? '    (Cancel your application for ' + this.props.user.team.name + ')' : '')}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
						<Form.Item label="Team name">
							{getFieldDecorator('name', {
								initialValue: this.state.team.name,
								rules: [{ required: true, message: 'Please input the name of your team!' }],
							})( <Input/>)}
						</Form.Item>
						<Form.Item label="Team introduction">
							{getFieldDecorator('introduction', {
								initialValue: this.state.team.introduction,
							})(<TextArea/>)}
						</Form.Item>
						<Form.Item {...tailFormItemLayout}>
							<Button type="primary" htmlType="submit" className="login-form-button">
								{this.state.team.name?'Update':'Create'}
							</Button>
						</Form.Item>
						{this.state.team.name &&
							<Form.Item {...tailFormItemLayout}>
								<Button type="danger" className="login-form-button" onClick={() =>
									this.giveConfirm(
										'Disband confirm',
										'Do you want to disband your team ' + this.state.team.name + ' ?',
										() => this.sendManage({'disband': true}),
									)
								}>
									Disband
								</Button>
							</Form.Item>
						}
					</Form>
				</Card>
				{this.state.team.name &&(
					<div>
						<Card  title = "Members">
							{this.state.team.members.length === 0 && (
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='None'/>
							)}
							{
								this.state.team.members.map((item) =>{
									return (
										<Button type="danger" key={item.id} onClick={() =>
											this.giveConfirm(
												'Dismiss confirm',
												'Do you want to dismiss ' + item.username + ' from ' + this.state.team.name + ' ?',
												() => this.sendManage({'dismiss': item.id}),
											)
										}>
											{item.username}
											<Icon type="close" />
										</Button>
									)
								})
							}
						</Card>
						
						<Card  title = "Applications">
							{this.state.team.candidates.length === 0 && (
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='None'/>
							)}
							{
								this.state.team.candidates.map((item) =>{
									return (
										<Button type="primary" key={item.id} onClick={() =>
											this.giveConfirm(
												'Accept confirm',
												'Do you allow ' + item.username + ' to join ' + this.state.team.name + ' ?',
												() => this.sendManage({'accept': item.id}),
											)
										}>
											{item.username}
											<Icon type="check" />
										</Button>
									)
								})
							}
						</Card>
					</div>
				)}
				
			</div>
		)
	}
}

export default Form.create({ name: 'team_manage' })(Manage);