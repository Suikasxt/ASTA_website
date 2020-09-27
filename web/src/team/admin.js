import '../config';
import $ from 'jquery';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Popconfirm, Form, Icon, Input, Button, Card, Modal, Empty, message, Table, Divider, Result } from 'antd';
import Loading from '../loading.js'
import './admin.css'
import UserShow from '../user/show.js'
const { confirm } = Modal;
const { TextArea } = Input;
const { Column } = Table;


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
class UserList extends Component{
	render(){
		return (
			<Table dataSource={this.props.data}>
				<Column
					title="User"
					key="user"
					render={(text, record) => (
						<UserShow username = {record.username} avatar = {record.avatar}/>
					)}
				/>
				<Column title="Name" dataIndex="name" key="name" />
				<Column title="ID" dataIndex="studentId" key="id" />
				<Column title="Class" dataIndex="className" key="className" />
				<Column
					title="Action"
					key="action"
					render={this.props.actions}
				/>
			</Table>
		)
	}
}

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
				for (let i = 0; i < result.members.length; i++){
					result.members[i].key = result.members[i].id;
				}
				for (let i = 0; i < result.candidates.length; i++){
					result.candidates[i].key = result.candidates[i].id;
				}
				this.setState({team: result})
			}.bind(this),
			error: function (result) {
				//message.error(result.responseText)
				this.setState({team: null})
			}.bind(this),
		})
	}
	sendManage = (data, teamId) => {
		let url = global.constants.server + 'team/admin/';
		data['team'] = teamId
		$.post({
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
	createTeamStart = () => {
		this.setState({createTeamFormVisible: true})
	}
	componentWillMount(){
		if (this.props.contestId && this.props.user){
			this.getTeamInfo(this.props.user.username, this.props.contestId)
		}else{
			this.state.team = null
		}
	}
	componentWillReceiveProps(){
		if (this.props.contestId && this.props.user){
			this.getTeamInfo(this.props.user.username, this.props.contestId)
		}else{
			this.state.team = null
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
			if (this.state.team == null){
				data['contest'] = this.props.contestId
			}else{
				data['team'] = this.state.team.id
			}
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
				<div>
					<Result
						title={
							<div>
								Please <Link to='/login'>login</Link> first.
							</div>
						}
					/>
					
				</div>
			)
		}
		if (this.state.team == null){
			return (
				<div>
					<TeamCreateForm
						wrappedComponentRef={this.saveFormRef}
						visible={this.state.createTeamFormVisible}
						confirmLoading={this.state.createTeamFormConfirmLoading}
						onCancel={this.createTeamFormCancel}
						onCreate={this.createTeamFormOK}
					/>
					<Result
						title="You're not in a team now."
						extra={
							<div>
								<p>
									You can <a onClick={this.createTeamStart}>Create a new Team</a>
								</p>
								<p>
									or join a team in <a onClick={()=>this.props.changeTabKey('team')}>Team List</a>
								</p>
							</div>
						}
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
				<Card bordered={false} title = 
					<div
						align='center'
						style={{fontSize: 23, fontWeight:700}}
					>
						{this.state.team.name}
					</div>
				>
				
					<div style={{paddingBottom: 20, fontSize: 18}}>
						{this.state.team.introduction}
					</div>
					{adminFlag?(
						<div>
							<Button type="primary" onClick={this.createTeamStart}>
								Update
							</Button>
							<Popconfirm
								placement="topRight"
								title={(
									<div>
										<p>Do you want to <b>disband</b> the team?</p>
									</div>
								)}
								onConfirm={() => this.sendManage({'disband': true}, this.state.team.id)}
								okText="Yes"
								cancelText="No"
							>
								<Button type="danger"> Disband </Button>
							</Popconfirm>
						</div>
					):(
						<div>
							<Popconfirm
								placement="topRight"
								title={(
									<div>
										<p>Do you want to <b>quit</b> the team?</p>
									</div>
								)}
								onConfirm={() => this.sendManage({'quit': true}, this.state.team.id)}
								okText="Yes"
								cancelText="No"
							>
								<Button type="danger"> Quit </Button>
							</Popconfirm>
						</div>
					)}
				</Card>
				{adminFlag &&(
					<div>
						<div className='subtitle' style={{marginTop: 50}}>Members</div>
						<UserList data={this.state.team.members} actions={(text, record) => (
							<div>
								<Popconfirm
									placement="topRight"
									title={(
										<div>
											<p>Do you want to <b>dismiss</b> the member?</p>
											<UserShow username = {record.username} avatar = {record.avatar}/>
										</div>
									)}
									onConfirm={() => this.sendManage({'dismiss': record.id}, this.state.team.id)}
									okText="Yes"
									cancelText="No"
								>
									<Button type="danger"> Dismiss </Button>
								</Popconfirm>
							</div>
						)}/>
						
						<div className='subtitle' style={{marginTop: 50}}>Applications</div>
						<UserList data={this.state.team.candidates} actions={(text, record) => (
							<div>
								<Popconfirm
									placement="topRight"
									title={(
										<div>
											<p>Do you want to <b>accept</b> the application?</p>
											<UserShow username = {record.username} avatar = {record.avatar}/>
										</div>
									)}
									onConfirm={() => this.sendManage({'accept': record.id}, this.state.team.id)}
									okText="Yes"
									cancelText="No"
								>
									<Button type="primary" icon="check"/>
								</Popconfirm>
								
								<Popconfirm
									placement="topRight"
									title={(
										<div>
											<p>Do you want to <b>refuse</b> the application?</p>
											<UserShow username = {record.username} avatar = {record.avatar}/>
										</div>
									)}
									onConfirm={() => this.sendManage({'refuse': record.id}, this.state.team.id)}
									okText="Yes"
									cancelText="No"
								>
									<Button type="danger" icon="close"/>
								</Popconfirm>
							</div>
						)}/>
					</div>
				)}
				
			</div>
		)
	}
}

export default Form.create({ name: 'team_admin' })(Admin);