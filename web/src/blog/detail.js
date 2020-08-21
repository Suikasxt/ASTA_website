import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import './detail.css';
import { Comment, message, Button, Card, Modal, Tag, Tabs, List, Divider, Form, Input, Avatar } from 'antd';
import Loading from '../loading.js'
import UserShow from '../user/show.js'
const { confirm } = Modal;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
	<div>
		<Form.Item>
			<TextArea rows={4} onChange={onChange} value={value} />
		</Form.Item>
		<Form.Item>
			<Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
				Add Comment
			</Button>
		</Form.Item>
	</div>
);
class Detail extends Component{
	state = {
		submitting: false,
		content: '',
	}
	handleChange = e => {
		this.setState({
			content: e.target.value,
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
				</div>
				<Divider />
				<div dangerouslySetInnerHTML={{ __html: this.state.data.content}} className='content'></div>
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
									author={item.author}
									avatar={global.constants.server + item.avatar}
									content={item.content}
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
								<Editor
									onChange={this.handleChange}
									onSubmit={this.handleSubmit}
									submitting={this.state.submitting}
									value={this.state.content}
								/>
							}
						/>
					</div>
				)}
			</div>
		)
	}
}

export default Detail;