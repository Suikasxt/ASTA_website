import '../config';
import $ from 'jquery';
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Card, Modal, Empty, message } from 'antd';
import Loading from '../loading.js'
import './admin.css'
const { confirm } = Modal;
const { TextArea } = Input;


const TeamCreateForm = Form.create({ name: 'form_in_modal' })(
	class extends React.Component {
		render() {
			const { visible, onCancel, onCreate, form } = this.props;
			const { getFieldDecorator } = form;
			return (
				<Modal
					visible={visible}
					title="Create a new team"
					okText={this.props.name ? "Update" : "Create"}
					onCancel={onCancel}
					onOk={onCreate}
				>
					<Form layout="vertical">
						<Form.Item label="Tean name">
							{getFieldDecorator('name', {
								rules: [{ required: true, message: 'Please input the name of your team!' }],
								initialValue: this.props.name,
							})(<Input/>)}
						</Form.Item>
						<Form.Item label="Introduction">
							{getFieldDecorator('introduction', {
								initialValue: this.props.introduction,
							})(<Input type="textarea"/>)}
						</Form.Item>
					</Form>
				</Modal>
			);
		}
	},
);
class Admin extends Component{
	state = {
		createTeamFormVisible: false,
		createTeamFormConfirmLoading: false,
	}
	
	getTeamInfo = (username, contestId) => {
		let url = global.constants.server + 'team/';
		$.get({
			url: url,
			crossDomain: true,
			data: {'username': username, 'contest': contestId},
			xhrFields: {
				withCredentials: true
			},
			async: true,
			success: function (result) {
				this.setState({team: result})
			}.bind(this),
			error: function (result) {
				//message.error(result.responseText)
				this.setState({team: null})
			}.bind(this),
		})
	}
	sendManage = (data) => {
		let url = global.constants.server + 'team/admin/';
		data['contest'] = this.props.contestId
		this.updateRequest = $.post({
			url: url,
			data: data,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				message.success(result)
				this.getTeamInfo(this.props.user.username, this.props.contestId)
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.sendManage(values)
			}
		});
	}
	giveConfirm = (title, content, onOk) => {
		confirm({
			title: title,
			content: content,
			onOk: onOk,
			onCancel() {},
		});
	}
	createTeamStart = () => {
		this.setState({createTeamFormVisible: true})
	}
	componentWillMount(){
		if (this.props.contestId && this.props.user){
			this.getTeamInfo(this.props.user.username, this.props.contestId)
		}
	}
	createHandleCancel = ()=>{
		this.setState({createVisible: false})
	}
	saveFormRef = formRef => {
		this.formRef = formRef;
	}
	createTeamFormCancel = () => {
		this.setState({createTeamFormVisible: false})
	}
	createTeamFormOK = () => {
		const { form } = this.formRef.props;
		let url = global.constants.server + 'team/admin/';
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			
			form.resetFields()
			this.setState({ createTeamFormConfirmLoading: true })
			let data = values
			data['contest'] = this.props.contestId
			$.post({
				url: url,
				crossDomain: true,
				data: data,
				xhrFields: {
					withCredentials: true
				},
				async: true,
				success: function (result) {
					message.success(result)
					this.getTeamInfo(this.props.user.username, this.props.contestId)
				}.bind(this),
				error: function (result) {
					message.error(result.responseText)
				}.bind(this),
				complete: function (result) {
					this.setState({ createTeamFormVisible: false });
					this.setState({ createTeamFormConfirmLoading: false });
				}.bind(this),
			})
		});
	}
	render(){
		if (this.state.team === undefined){
			return (
				<Loading />
			)
		}
		if (this.props.user == null){
			return (
				<div>Please login first.</div>
			)
		}
		if (this.state.team == null){
			return (
				<div>
					Not in a team now.
					<Button type="primary" onClick={this.createTeamStart}>Create</Button>
					<Button type="primary" onClick={()=>this.props.changeTabKey('team')}>Team List</Button>
					<TeamCreateForm
						wrappedComponentRef={this.saveFormRef}
						visible={this.state.createTeamFormVisible}
						confirmLoading={this.state.createTeamFormConfirmLoading}
						onCancel={this.createTeamFormCancel}
						onCreate={this.createTeamFormOK}
					/>
				</div>
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
		let adminFlag = false
		if (this.props.user && this.state.team){
			adminFlag = this.props.user.username == this.state.team.captain
		}
		return (
			<div	id = "root">
				
				<TeamCreateForm
					name = {this.state.team.name}
					introduction = {this.state.team.introduction}
					wrappedComponentRef={this.saveFormRef}
					visible={this.state.createTeamFormVisible}
					confirmLoading={this.state.createTeamFormConfirmLoading}
					onCancel={this.createTeamFormCancel}
					onCreate={this.createTeamFormOK}
				/>
				<Card	title = {this.state.team.name}>
					<div>
						{this.state.team.introduction}
					</div>
					{adminFlag && (
						<div>
							<Button type="primary" onClick={this.createTeamStart}>
								Update
							</Button>
							<Button type="danger" onClick={() =>
								this.giveConfirm(
									'Disband confirm',
									'Do you want to disband your team ' + this.state.team.name + ' ?',
									() => this.sendManage({'disband': true}),
								)
							}>
								Disband
							</Button>
						</div>
					)}
				</Card>
				{adminFlag &&(
					<div>
						<Card	title = "Members">
							{this.state.team.members.length == 1 && (
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='None'/>
							)}
							{
								this.state.team.members.map((item) =>{
									if (item.username!=this.state.team.captain)
									return (
										<Button type="danger" key={item.username} onClick={() =>
											this.giveConfirm(
												'Dismiss confirm',
												'Do you want to dismiss ' + item.username + ' from ' + this.state.team.name + ' ?',
												() => this.sendManage({'dismiss': item.username}),
											)
										}>
											{item.username}
											<Icon type="close" />
										</Button>
									)
								})
							}
						</Card>
						
						<Card	title = "Applications">
							{this.state.team.candidates.length === 0 && (
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='None'/>
							)}
							{
								this.state.team.candidates.map((item) =>{
									return (
										<Button type="primary" key={item.username} onClick={() =>
											this.giveConfirm(
												'Accept confirm',
												'Do you allow ' + item.username + ' to join ' + this.state.team.name + ' ?',
												() => this.sendManage({'accept': item.username}),
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

export default Form.create({ name: 'team_admin' })(Admin);