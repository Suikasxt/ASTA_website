import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import { Table, Tabs } from 'antd';
const { TabPane } = Tabs;


const columnsDaily = [
	{
		title: 'Rank',
		dataIndex: 'rank',
		key: 'rank',
	},
	{
		title: 'Filename',
		dataIndex: 'filename',
		key: 'filename',
		render: (text, record) => {
			if (record.dll){
				return (
					<a href={global.constants.server + record.dll}>{text}</a>
				)
			}else{
				return (
					<span>{text}</span>
				)
			}
		}
	},
	{
		title: 'Description',
		dataIndex: 'description',
		key: 'description',
	},
	{
		title: 'Score',
		dataIndex: 'score',
		key: 'score',
	},
	{
		title: 'team',
		dataIndex: 'teamName',
		key: 'teamName',
	},
];

class Leaderboard_test extends Component{
	state = {
		daily : [],
	}
	getTeamList = () => {
		
		let url = global.constants.server + 'api/leaderboard_test/daily';
		this.teamListRequest = $.get({
			url: url,
			success: function (result) {
				for(let index in result) {
					result[index].key = index.toString();
				}
				this.setState({daily : result});
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getTeamList();
	}
	render(){
		return (
			<div  id = "root">
                <Table columns={columnsDaily} dataSource={this.state.daily} />
			</div>
		)
	}
}
export default Leaderboard_test;
