import React, { Component } from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import { Typography, Divider, message, Carousel } from 'antd';
import MarkdownView from './markdown/view.js';
import $ from 'jquery';
import './home.css';
import './home.carousel.css';
import logo_1 from './assets/logo_1.jpg';
import logo_2 from './assets/logo_1.jpg';
import logo_Tra from './assets/学培部logo.jpg';
import logo_Com from './assets/竞赛部logo.jpg';
import logo_Tec from './assets/技术部logo.jpg';
import logo_Pro from './assets/项目部logo.jpg';
import img1 from './assets/img_1.jpg'
import img2 from './assets/img_2.jpg'
const { Title, Paragraph, Text } = Typography;

const pictures = [
	{
	  title: "第二十二届电子设计大赛——防疫先锋",
	  link: "/contest/1",
	  content: "",
	  image: img1,
	},
	{
	  title: "第二十二届电子设计大赛——防疫先锋",
	  link: "/contest/1",
	  content: "",
	  image: img2,
	},
  ];

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
			<div style={{backgroundColor : '#FFF', padding:30, minHeight: 500}}>
				<Carousel autoplay effect="fade">
					{pictures.map(news => (
						<Link to={news.link} key={news.title} className="container">
							<div className="background">
								<img className="background_img" src={news.image} alt={news.title} />
							</div>
							<div className="center">
								<img className="image" src={news.image} alt={news.title} />
							</div>
							<div className="description">
								<h2>{news.title}</h2>
								<p>{news.content}</p>
							</div>
						</Link>
					))}
				</Carousel>
				<div className='markdownContainer'>
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
			</div>
		)
	}
}

export default Home;