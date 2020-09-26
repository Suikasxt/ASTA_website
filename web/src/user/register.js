import '../config';
import $ from 'jquery';
import { withRouter, Link } from 'react-router-dom';
import React, { Component } from 'react';
import { message, Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import md5 from 'js-md5';
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
class Register extends Component{
	state = {
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.unLogin === false){
			this.props.history.push('/')
		}
	}
	sendToken = () => {
		let email = this.props.form.getFieldValue('email')
		if (this.props.form.getFieldValue('email') == null){
			message.error('Please input your email')
			return
		}
		let url = global.constants.server + 'sendToken/'
		console.log(email)
		$.get({
			url: url,
			data: {email: email},
			crossDomain: true,
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
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let url = global.constants.server + 'register/'
				let data = values
				data.password = md5(data.password)
				this.serverRequest = $.post({
					url: url,
					data: data,
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					success: function (result) {
						message.success(result)
						this.props.history.push('/login')
					}.bind(this),
					error: function (result) {
						message.error(result.responseText)
					}.bind(this),
				})
			}
		});
	}
	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!')
		} else {
			callback()
		}
	}

	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div	id = "root" style={{ alignItems : 'center', justifyContent: 'center', display : 'flex', flexDirection: 'column' }}>
				<span className="title">Register</span>
				<Card style = {{width: '70%'}}>
					<Form {...formItemLayout} onSubmit={this.handleSubmit} className="form">
						<Form.Item label="邮箱">
							{getFieldDecorator('email', {
								rules: [
									{ required: true, message: 'Please input your email!', },
									{ type: 'email', message: 'The input is not valid E-mail!', },
								],
							})(
								<Input
									prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Email"
								/>,
							)}
							<Button onClick={this.sendToken}>Send token</Button>
						</Form.Item>
						<Form.Item label="Token">
							{getFieldDecorator('token', {
								rules: [
									{ required: true, message: 'Please input your token!', },
								],
							})(
								<Input
									prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Token"
								/>,
							)}
						</Form.Item>
						<Form.Item label="昵称">
							{getFieldDecorator('username', {
								rules: [{ required: true, message: 'Please input your username!' }],
							})(
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Username"
								/>,
							)}
						</Form.Item>
						<Form.Item label="密码">
							{getFieldDecorator('password', {
								rules: [{ required: true, message: 'Please input your password!' }],
							})(
								<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="Password"
								/>,
							)}
						</Form.Item>
						<Form.Item label="确认密码">
							{getFieldDecorator('password_again', {
								rules: [
										{ required: true, message: 'Please input your password!' },
										{ validator: this.compareToFirstPassword, },
									],
							})(
								<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="Confirm Password"
								/>,
							)}
						</Form.Item>
						<Form.Item label="学号">
							{getFieldDecorator('studentId')(
								<Input
									prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="id"
								/>,
							)}
						</Form.Item>
						<Form.Item label="姓名">
							{getFieldDecorator('name')(
								<Input
									prefix={<Icon type="contacts" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Name"
								/>,
							)}
						</Form.Item>
						<Form.Item label="班级">
							{getFieldDecorator('className')(
								<Input
									prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Class"
								/>,
							)}
						</Form.Item>
						<Form.Item {...tailFormItemLayout} style = {{ textAlign : 'center'}}>
							<Button type="primary" htmlType="submit" className="form-button">
								Register
							</Button>
						</Form.Item>
						<div style = {{ textAlign : 'center'}}>
							or <Link to="/login">Login</Link> now
						</div>
					</Form>
				</Card>
			</div>
		)
	}
}

export default Form.create({ name: 'normal_register' })(Register);