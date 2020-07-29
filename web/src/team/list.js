import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { Button, Card, Col, Row } from 'antd';


class List extends Component{
	state = {
	}
	getTeamList = () => {
		let url = global.constants.server + 'api/team/list/';
		this.teamListRequest = $.get({
			url: url,
			success: function (result) {
				this.setState({list : result});
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getTeamList();
	}
	render(){
		if (this.state.list == null){
			return (
				<Loading/>
			)
		}
		return (
			<div  id = "root"  style = {{padding: 60}}>
				<Row gutter={16}>
				{
					this.state.list.map((item, index) => {
						return (
							<Col span={8} key={item.id}>
								<Card title={item.name} hoverable={true} key={item.id} extra={
											<Link to={"/team/detail/" + item.id}>
												<Button type="primary">Detail</Button>
											</Link>
										} bodyStyle={{ height: 150, overflow: "auto" }}>
									<p>{item.introduction}</p>
								</Card>
							</Col>
						)
					})
					
				}
				</Row>
			</div>
		)
	}
}
export default List;
