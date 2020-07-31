import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
//import './detail.css';
import { message, Button, Card, Modal, Tag, Tabs, List} from 'antd';
import Loading from '../loading.js'
const { confirm } = Modal;
const { TabPane } = Tabs;


class Detail extends Component{
	state = {
	}
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
				<div dangerouslySetInnerHTML={{ __html: this.state.data.content}}></div>
			</div>
		)
	}
}

export default Detail;