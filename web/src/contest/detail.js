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
		let url = global.constants.server + 'contest/';
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
				<div className='title'> {this.state.data.name} </div>
				<Tabs defaultActiveKey="1">
					<TabPane tab="Home" key="1">
						<div dangerouslySetInnerHTML={{ __html: this.state.data.detail}}></div>
					</TabPane>
					<TabPane tab="Teams" key="2">
						Content of Tab Pane 2
					</TabPane>
					<TabPane tab="Blogs" key="3">
					<List
						itemLayout="horizontal"
						dataSource={this.state.data.blog}
						renderItem={item => (
							<List.Item>
								<List.Item.Meta
									title={<Link to={"blog/"+item.id}>{item.title}</Link>}
									description={item.author + '  ' + item.time}
								/>
							</List.Item>
						)}
					/>
					</TabPane>
				</Tabs>
			</div>
		)
	}
}

export default Detail;