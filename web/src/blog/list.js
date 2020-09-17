import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { Button, Card, Col, Row, List, Input, Form, Icon, Divider, message, Tag } from 'antd';
import UserShow from '../user/show.js';
import './list.css';



class ListElement extends Component{
	state = {
	}
	getList = (data = {}) => {
		let url = global.constants.server + 'blog/list/';
		$.get({
			url: url,
			data: data,
			success: function (result) {
				this.setState({list : result});
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	componentWillMount(){
		let data = {}
		if (this.props.author){
			data['author'] = this.props.author
		}
		if (this.props.tag){
			data['tag'] = this.props.tag
		}
		this.getList(data)
	}
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.getList(values)
			}
		})
	}
	render(){
		if (this.state.list == null){
			return (
				<Loading/>
			)
		}
		const { getFieldDecorator } = this.props.form;
		return (
			<div id = "root" style = {{padding: this.props.padding ? this.props.padding : 60}}>
				<Form layout="inline" onSubmit={this.handleSubmit}>
					<Form.Item label='Author'>
						{getFieldDecorator('author', {
							initialValue: this.props.author,
						})(
							<Input
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="author"
							/>,
						)}
					</Form.Item>
					<Form.Item label='Tag'>
						{getFieldDecorator('tag', {
							initialValue: this.props.tag,
						})(
							<Input
								prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="tag"
							/>,
						)}
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit" icon="search"/>
					</Form.Item>
					<Form.Item>
						{this.props.user&&(
							<Link to="/blogEdit">
								<Button type="primary" icon="edit" style={{marginBottom: 20}}>
									New Blog
								</Button>
							</Link>
						)}
					</Form.Item>
				</Form>
				<Divider />
				<List
					itemLayout="horizontal"
					dataSource={this.state.list}
					renderItem={item => (
						<List.Item key={item.id}>
							<List.Item.Meta
								title={<Link to={"/blog/"+item.id} className='blogTitle'>{item.title}</Link>}
								description={<div>
									<UserShow 
										username={item.author}
										mode='mini'
									/>
									&nbsp;&nbsp;
									{item.time}
									<div className='tags'>
										{
											item.tags.map((item) => {
												return (
													<Tag key={item}>{item}</Tag>
												)
											})
										}
									</div>
								</div>}
							/>
						</List.Item>
					)}
				/>
			</div>
		)
	}
}
export default Form.create({ name: 'Blog_list' })(ListElement);
