import '../config';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import './information.css';
import { Upload, Button, message, Descriptions, Icon, Form, Input, Card, Result } from 'antd';

const formItemLayout = {
	labelCol: {
		xs: { span: 4 },
		sm: { span: 4 },
	},
	wrapperCol: {
		xs: { span: 20 },
		sm: { span: 20 },
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 24,
			offset: 0,
		},
	},
};

function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}
class Informathion extends Component{
	state = {
		avatarUploading: false,
		uploadLoading: false,
		avatarUrl: null
	}
	avatarUploadChange = info => {
		console.log(info)
		if (info.file.status === 'uploading') {
			this.setState({ avatarUploading: true });
			return;
		}
		if (info.file.status === 'done') {
			this.props.updateUser()
			this.setState({
				avatarUploading: false,
				avatarUrl: info.file.response});
		}
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let url = global.constants.server + 'modify/'
				this.serverRequest = $.post({
					url: url,
					data: values,
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					success: function (result) {
						message.success(result)
						this.props.updateUser()
					}.bind(this),
					error: function (result) {
						message.error(result.responseText)
					}.bind(this),
				})
			}
		});
	}
	render(){
		const { user } = this.props;
		const { getFieldDecorator } = this.props.form;
		if (user == null) {
			return (
				<div id = 'root' >
					<Result
						title=<div>Please <Link to="/login">log in</Link> first.</div>
						extra={
							<div>
								This is a page to show your <b>personal information</b>. <br/>
								You must log in to your account or <Link to="/register">register</Link> a new one.
							</div>
						}
					/>
				</div>
			)
		}
		console.log(user)
		return (
			<div id = "root" style={{ alignItems : 'center', justifyContent: 'center', display : 'flex', flexDirection: 'column' }}>
				<Upload
					name="avatar"
					listType="picture-card"
					className="avatar-uploader"
					showUploadList={false}
					action={global.constants.server + 'modify/'}
					withCredentials={true}
					beforeUpload={beforeUpload}
					onChange={this.avatarUploadChange}
				>
					{this.state.avatarUploading?(
						<div>
							<Icon type='loading' />
							<div className="ant-upload-text">Uploading</div>
						</div>
					):(
						<img alt="avatar" src = {global.constants.server + (this.state.avatarUrl ? this.state.avatarUrl : user.avatar)} className="avatar"/>
					)}
				</Upload>
				
				<Card style = {{width: '50%'}}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit} className="form">
						<Form.Item label="邮箱">
							{getFieldDecorator('email', {
								initialValue: user.email,
								rules: [
									{ required: true, message: 'Please input your email!', },
									{ type: 'email', message: 'The input is not valid E-mail!', },
								],
							})(
								<Input
									prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
									disabled={true}
								/>,
							)}
						</Form.Item>
						<Form.Item label="昵称">
							{getFieldDecorator('username', {
								initialValue: user.username,
								rules: [{ required: true, message: 'Please input your username!' }],
							})(
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								/>,
							)}
						</Form.Item>
						<Form.Item label="学号">
							{getFieldDecorator('studentId', {
								initialValue: user.studentId,
							})(
								<Input
									prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
								/>,
							)}
						</Form.Item>
						<Form.Item label="姓名">
							{getFieldDecorator('name', {
								initialValue: user.name,
							})(
								<Input
									prefix={<Icon type="contacts" style={{ color: 'rgba(0,0,0,.25)' }} />}
								/>,
							)}
						</Form.Item>
						<Form.Item label="班级">
							{getFieldDecorator('className', {
								initialValue: user.className,
							})(
								<Input
									prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />}
								/>,
							)}
						</Form.Item>
						<Form.Item {...tailFormItemLayout} style = {{ textAlign : 'center'}}>
							<Button type="primary" htmlType="submit" className="form-button">
								Modify
							</Button>
						</Form.Item>
						<div style = {{ textAlign : 'center'}}>
							<Link to="/resetPassword">Reset password</Link>
						</div>
					</Form>
				</Card>
			</div>
		)
	}
}

export default Form.create({ name: 'modify' })(Informathion);