import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import { Table, Tabs } from 'antd';
const { TabPane } = Tabs;

const columnsTotal = [
	{
		title: 'Rank',
		dataIndex: 'rank',
		key: 'rank',
	},
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		render: (text, record) => <Link to={"/team/detail/" + record.id}>{text}</Link>,
	},
	{
		title: 'Introduction',
		dataIndex: 'introduction',
		key: 'introduction',
	},
	{
		title: 'Score',
		dataIndex: 'score',
		key: 'score',
	},
];
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
	},
	{
		title: 'Team',
		dataIndex: 'teamName',
		key: 'team',
		render: (text, record) => <Link to={"/team/detail/" + record.teamID}>{text}</Link>,
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
		title: 'Dll',
		dataIndex: 'dll',
		key: 'dll',
		render: (text, record) => (
			<span>
				{text?(
					<a href={global.constants.server + text}>Download</a>
				) : (
					<span>None</span>
				)}
			</span>
		)
	},
	{
		title: 'Detail',
		dataIndex: 'detail',
		key: 'detail',
	},
];

class Leaderboard extends Component{
	state = {
		total : [],
		daily : [],
	}
	getTeamList = () => {
		let url = global.constants.server + 'api/leaderboard/total';
		this.teamListRequest = $.get({
			url: url,
			success: function (result) {
				for(let index in result) {
					result[index].key = index.toString();
				}
				this.setState({total : result});
			}.bind(this)
		})
		url = global.constants.server + 'api/leaderboard/daily';
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
				<Tabs defaultActiveKey="1">
					<TabPane tab="Total" key="total">
						<Table columns={columnsTotal} dataSource={this.state.total} />
					</TabPane>
					<TabPane tab="Daily" key="daily">
						<Table columns={columnsDaily} dataSource={this.state.daily} />
					</TabPane>
				</Tabs>
			</div>
		)
	}
}
export default Leaderboard;
