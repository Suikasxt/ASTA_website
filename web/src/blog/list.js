import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { Button, Card, Col, Row, List } from 'antd';


class ListElement extends Component{
	state = {
	}
	getList = () => {
		let url = global.constants.server + 'blog/list/';
		let data = {}
		if (this.props.tag){
			data['tag'] = this.props.tag
		}
		this.teamListRequest = $.get({
			url: url,
			data: data,
			success: function (result) {
				this.setState({list : result});
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getList()
	}
	componentWillReceiveProps(nextProps){
		this.getList()
	}
	render(){
		if (this.state.list == null){
			return (
				<Loading/>
			)
		}
		return (
			<div id = "root" style = {{padding: this.props.padding ? this.props.padding : 60}}>
				<List
					itemLayout="horizontal"
					dataSource={this.state.list}
					renderItem={item => (
						<List.Item key={item.id}>
							<List.Item.Meta
								title={<Link to={"blog/"+item.id}>{item.title}</Link>}
								description={item.author + '  ' + item.time}
							/>
						</List.Item>
					)}
				/>
			</div>
		)
	}
}
export default ListElement;
