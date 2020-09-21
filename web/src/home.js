import React, { Component } from 'react';
import { Typography, Divider, message } from 'antd';
import MarkdownView from './markdown/view.js';
import $ from 'jquery';
import './home.css';
import logo_1 from './assets/logo_1.jpg';
import logo_2 from './assets/logo_1.jpg';
import logo_Tra from './assets/学培部logo.jpg';
import logo_Com from './assets/竞赛部logo.jpg';
import logo_Tec from './assets/技术部logo.jpg';
import logo_Pro from './assets/项目部logo.jpg';
const { Title, Paragraph, Text } = Typography;


class Home extends Component{
	state={
	}
	getInfo = () => {
		$.get({
			url: global.constants.server + 'static/introduction.md',
			success: function (result) {
				this.setState({introduction: result})
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
		return (
			<Typography style={{backgroundColor : '#FFF', padding:30, minHeight: 500}}>
				<div className='container'>
					<MarkdownView
						source={this.state.introduction}
					/>
					<img className="logo_inside" src={logo_1} alt="logo" />
					<img className="logo_inside" src={logo_2} alt="logo" />
					<img className="logo_inside" src={logo_Tra} alt="logo" />
					<img className="logo_inside" src={logo_Com} alt="logo" />
					<img className="logo_inside" src={logo_Tec} alt="logo" />
					<img className="logo_inside" src={logo_Pro} alt="logo" />
				</div>
			</Typography>
		)
	}
}

export default Home;