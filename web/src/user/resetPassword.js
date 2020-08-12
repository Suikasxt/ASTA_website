import '../config';
import $ from 'jquery';
import { withRouter, Link } from 'react-router-dom';
import React, { Component } from 'react';
import { message, Form, Icon, Input, Button, Checkbox, Card } from 'antd';
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
class ResetPassword extends Component{
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
				let url = global.constants.server + 'resetPassword/'
				this.serverRequest = $.post({
					url: url,
					data: values,
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					success: function (result) {
						message.success(result)
						this.props.logout()
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
				<span className="title">Reset Passward</span>
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
						<Form.Item {...tailFormItemLayout} style = {{ textAlign : 'center'}}>
							<Button type="primary" htmlType="submit" className="form-button">
								Reset
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</div>
		)
	}
}

export default Form.create({ name: 'normal_register' })(ResetPassword);