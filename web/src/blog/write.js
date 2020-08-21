import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import './write.css';
import { Comment, message, Button, Card, Modal, Tag, Tabs, List, Divider, Form, Input, Avatar } from 'antd';
import Loading from '../loading.js'
import UserShow from '../user/show.js'
const { confirm } = Modal;
const { TabPane } = Tabs;
const { TextArea } = Input;



class Write extends Component{
	state = {
		content: '',
	}
	handleChange = (e) => {
		this.setState({content: e.target.value})
	}
	render(){
		return (
			<div id = "root">
				<div id='content-container'>
					<div style={{ flex:1 }}>
						<TextArea id='content' value={this.state.content} onChange={this.handleChange}/>
					</div>
					<div dangerouslySetInnerHTML={{ __html: this.state.content}} style={{ flex:1 }}></div>
				</div>
			</div>
		)
	}
}

export default Write;