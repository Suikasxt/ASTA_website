import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import { Comment, message, Button, Card, Modal, Tag, Tabs, List, Divider, Form, Input, Avatar, Popconfirm } from 'antd';
import Loading from '../loading.js';
import UserShow from '../user/show.js';
import MarkdownView from '../markdown/view.js'
import MarkdownEditor from '../markdown/edit.js';
import './detail.css';
const { confirm } = Modal;
const { TabPane } = Tabs;
const { TextArea } = Input;

class Detail extends Component{
	state = {
		submitting: false,
		content: '',
	}
	handleChange = value => {
		this.setState({
			content: value,
		});
	}
	getCommentList = () => {
		$.get({
			url: global.constants.server + 'comment/list/',
			data: { blog: this.props.match.params.id },
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				this.setState({comments: result})
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	handleSubmit = () => {
		if (!this.state.content) {
			return;
		}
		this.setState({
			submitting: true,
		});

		$.post({
			url: global.constants.server + 'comment/add/',
			data: { blog: this.props.match.params.id, content: this.state.content },
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				message.success(result)
				this.setState({content: ''})
				this.getCommentList()
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
			complete: function (result){
				this.setState({submitting: false})
			}.bind(this),
		})
	};
	getInfo = (id = this.props.match.params.id) => {
		let url = global.constants.server + 'blog/';
		$.get({
			url: url,
			crossDomain: true,
			data: {'id': id},
			xhrFields: {
				withCredentials: true
			},
			async: true,
			success: function (result) {
				this.setState({data: result})
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	componentWillMount(){
		this.getInfo()
		this.getCommentList()
	}
	componentWillReceiveProps(nextProps){
		this.props = nextProps
		this.getInfo()
		this.getCommentList()
	}
	deleteBlog(id = this.props.match.params.id){
		let url = global.constants.server + 'blog/delete/';
		$.post({
			url: url,
			crossDomain: true,
			data: {'id': id},
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				message.success(result)
				this.props.history.push('/blog')
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	render(){
		if (this.state.data == null){
			return (
				<Loading/>
			)
		}
		const { user } = this.props
		const { id } = this.props.match.params
		return (
			<div id = "root">
				<div className='title'> {this.state.data.title} </div>
				<div className='info'>
					<UserShow username={this.state.data.author}/>
					<span className='time'>{this.state.data.time}</span>
					 
					{(this.props.user && this.props.user.username==this.state.data.author)&&(
						<span style={{marginLeft: 20}}>
							<Link to={'/blogEdit/' + id}>
								<Button type="primary" shape="circle" icon="edit"/>
							</Link>
							<Popconfirm
								placement="bottom"
								title={(
									<div>
										<p>Do you want to <b>delete</b> this blog?</p>
									</div>
								)}
								onConfirm={() => this.deleteBlog()}
								okText="Yes"
								cancelText="No"
							>
								<Button type="danger" shape="circle" icon="delete"/>
							</Popconfirm>
						</span>
					)}
				</div>
				<Divider />
				
				
				<MarkdownView
					source={this.state.data.content}
				/>
				
				
				<Divider />
				<div className='tags'>
					{
						this.state.data.tags.map((item) => {
							return (
								<Tag key={item}>{item}</Tag>
							)
						})
					}
				</div>
				{this.state.comments &&(
					<List
						locale={{emptyText:'No comment now.'}}
						className="comment-list"
						header={`${this.state.comments.length} replies`}
						itemLayout="horizontal"
						dataSource={this.state.comments}
						renderItem={item => (
							<li>
								<Comment
									className='comment'
									author={item.author}
									avatar={global.constants.server + item.avatar}
									content=<MarkdownView
											source={item.content}
										/>
									datetime={item.time}
								/>
							</li>
						)}
					/>
				)}
				{user && (
					<div>
						<Comment
							avatar={
								<Avatar
									src={global.constants.server + user.avatar}
									alt={user.username}
								/>
							}
							content={
								<Form>
									<Form.Item>
										<MarkdownEditor
											style={{height: 300}}
											onChange={this.handleChange}
											value={this.state.content}
										/>
									</Form.Item>
									<Form.Item>
										<Button htmlType="submit" loading={this.state.submitting} onClick={this.handleSubmit} type="primary">
											Add Comment
										</Button>
									</Form.Item>
								</Form>
							}
						/>
					</div>
				)}
			</div>
		)
	}
}

export default Detail;