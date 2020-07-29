import '../config';
import $ from 'jquery';
import { withRouter, Link } from 'react-router-dom';
import React, { Component } from 'react';
import './login.css';
import { message, Form, Icon, Input, Button, Checkbox, Card } from 'antd';


class Login extends Component{
	state = {
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.unLogin === false){
			this.props.history.push('/');
		}
	}
	componentWillMount(){
		if (this.props.unLogin === false){
			this.props.history.push('/');
		}
		if (this.props.match.params.token != null){
			let url = global.constants.server + 'api/user/login/';
			this.serverRequest = $.post({
				url: url,
				data: {token: this.props.match.params.token},
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				success: function (result) {
					if (result.result){
						this.props.updateUser(result)
					}else{
						message.error(result.message)
					}
				}.bind(this)
			});
		}
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let url = global.constants.server + 'api/user/login/';
				this.serverRequest = $.post({
					url: url,
					data: values,
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					success: function (result) {
						if (result.result){
							this.props.updateUser(result)
						}else{
							message.error(result.message)
						}
					}.bind(this)
				});
			}
		});
	};

	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div  id = "root" style={{ minHeight: 500, alignItems : 'center', justifyContent: 'center', display : 'flex', flexDirection: 'column' }}>
				<Card>
					<Form onSubmit={this.handleSubmit} className="login-form">
						<Form.Item>
							{getFieldDecorator('username', {
								rules: [{ required: true, message: 'Please input your username!' }],
							})(
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Username"
								/>,
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('password', {
								rules: [{ required: true, message: 'Please input your Password!' }],
							})(
								<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="Password"
								/>,
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('remember', {
								valuePropName: 'checked',
								initialValue: true,
							})(<Checkbox>Remember me</Checkbox>)}
							<Button type="primary" htmlType="submit" className="login-form-button">
								Log in
							</Button>
						</Form.Item>
						<div style = {{ textAlign : 'center'}}>
							or <Link to="/register">Register</Link> now
						</div>
					</Form>
				</Card>
			</div>
		)
	}
}

export default Form.create({ name: 'normal_login' })(Login);