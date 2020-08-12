import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { Button, Card, Col, Row, Collapse } from 'antd';
const { Panel } = Collapse;


class ListElement extends Component{
	state = {
	}
	getList = () => {
		let url = global.constants.server + 'contest/list/';
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
				<h1 style={{lineHeight: 5, fontSize: 20,fontWeight: 700}}>Contests</h1>
				<Collapse accordion>
					{
						this.state.list.map((item, index) => {
							let title = item.name
							return (
								<Panel header={item.name} key={index} extra={item.time}>
									<p dangerouslySetInnerHTML={{ __html: item.introduction}}></p>
									<Link to={"/contest/" + item.id} style={{display: 'inline'}}>
										<Button style={{display: 'inline'}}>Enter</Button>
									</Link>
								</Panel>
							)
						})
					}
				</Collapse>
			</div>
		)
	}
}
export default ListElement;
