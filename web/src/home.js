import React, { Component } from 'react';
import { Typography, Divider } from 'antd';
import './index.css';
const { Title, Paragraph, Text } = Typography;


class Home extends Component{
	render(){
		return (
			<Typography>
				<Title>电子设计大赛</Title>
				<Paragraph>“电子设计大赛”是由清华大学电子系和自动化系合办的面向全校的比赛，选手可以组成不多于四人的队伍报名参加比赛。比赛一般是要求选手设计一辆智能车，根据赛题内容设计机械结构，编写单片机代码，实现自动控制。比赛形式是让两支队伍的智能车进行对抗，根据规则，胜者晋级，比赛过程中智能车除了根据传感器检测场地情况之外，还可以通过官方提供的通信模块从上位机处获取信息或者给上位机发送指令；决赛在罗姆楼进行，每年都会吸引大批观众，一边欣赏紧张激烈的比赛，一边听着激情洋溢的解说，见证冠军的诞生。</Paragraph>
			</Typography>
		)
	}
}

export default Home