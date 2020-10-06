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
		let url = global.constants.server + 'reservation/list/';
		this.teamListRequest = $.get({
			url: url,
			success: function (result) {
				this.setState({list : result});
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getList();
	}
	render(){
		if (this.state.list == null){
			return (
				<Loading/>
			)
		}
		return (
			<div id = "root" style = {{padding: 60}}>
				<h1 style={{lineHeight: 5, fontSize: 20,fontWeight: 700}}>Reservations</h1>
				<List
					itemLayout="horizontal"
					dataSource={this.state.list}
					renderItem={item => (
						<List.Item>
							<Link to={"/reservation/"+item.id}>
								<h1>
									{item.name}
								</h1>
							</Link>
						</List.Item>
					)}
				/>
			</div>
		)
	}
}
export default ListElement;
