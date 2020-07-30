import React, { Component } from 'react';
import { Typography, Divider } from 'antd';
import './index.css';
const { Title, Paragraph, Text } = Typography;


class Home extends Component{
	render(){
		return (
			<Typography style={{backgroundColor : '#FFF', padding:30, minHeight: 500}}>
				<Title>自动化科协</Title>
				<Paragraph>广告位招租</Paragraph>
			</Typography>
		)
	}
}

export default Home