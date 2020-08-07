import './config';
import React from 'react';
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import $ from 'jquery';
import { Layout, Menu, Typography, Icon, Button } from 'antd';
import Home from './home.js';
import Login from './user/login.js';
import Register from './user/register.js';
import Information from './user/information.js';
import ContestList from './contest/list.js';
import ContestDetail from './contest/detail.js';
import BlogList from './blog/list.js';
import BlogDetail from './blog/detail.js';
import TeamList from './team/list.js';
import TeamAdmin from './team/admin.js';
import ASTA_logo from './assets/ASTA_logo.jpg'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const Title_word = "自动化系科协"
const Tips_word = ""


class App extends React.Component {
	state = {
		collapsed: false,
		user: null,
		userLoading: false,
	}
	
	onCollapse = collapsed => {
		console.log(collapsed);
		this.setState({ collapsed });
	}
	
	componentDidMount(){
		this.updateUser();
	}
	
	download = (url) => {
		let a = document.createElement('a');
		a.href = url;
		a.click();
	};
	updateUser = (data = null) => {
		if (data != null){
			if (data.avatar != null){
				this.state.user.avatar = data.avatar
			}
			return
		}
		if (this.state.userLoading) return;
		let url = global.constants.server + 'user/';
		this.loginRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			async: true,
			success: function (result) {
				if (result.id !== undefined && result !== this.state.user){
					this.setState({user: result});
				}
			}.bind(this),
			beforeSend: function(){
				this.setState({userLoading: true})
			}.bind(this),
			complete: function(){
				this.setState({userLoading: false})
			}.bind(this),
		});
	}
	
	logout = (e) => {
		let url = global.constants.server + 'logout/';
		this.logoutRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				this.setState({user : null});
			}.bind(this)
		});
	}
	
	getUserMenu = () =>{
		if (this.state.user != null){
			return (
			<SubMenu
				key="user"
				title={
					<span>
						<Icon type="user" />
						<span>{this.state.user.username}</span>
					</span>
				}
			>
				<Menu.Item key="information" >
					<Link to="/information">
						<span>Information</span>
					</Link>
				</Menu.Item>
				<Menu.Item key="logout" onClick={this.logout}>Log out</Menu.Item>
			</SubMenu>
			)
		}else{
			return (
			<Menu.Item key="login">
				<Link to="/login">
					<Icon type="user" />
					<span>Login</span>
				</Link>
			</Menu.Item>
			)
		}
	}

	render() {
		let user = this.getUserMenu()
		
		return (
			<Router>
				<Layout style={{ minHeight: '100vh' }}>
					<Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} theme="light">
						<div className="logo">
							<img className="logo_img" src={ASTA_logo} alt="logo" />
						</div>
						<Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
							<Menu.Item key="home">
								<Link to="/">
									<Icon type="pie-chart" />
									<span>Home</span>
								</Link>
							</Menu.Item>
							{user}
							<Menu.Item key="Contest">
								<Link to="/contest">
									<Icon type="trophy" />
									<span>Contest</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="Blog">
								<Link to="/blog">
									<Icon type="read" />
									<span>Blog</span>
								</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Header style={{ background: 'white', padding: 0, display: 'flex', flexDirection: 'row'}} >
							<div style={{ flex: 1 }}>
								<div style={{ flex: 2, fontSize: 25, fontWeight: 'bolder'}}>{Title_word}</div>
								<div>{Tips_word}</div>
							</div>
						</Header>
						<Content style={{ margin: '10px 16px' }}>
							<Route path="/" exact component={Home}/>
							<Route path="/information" render={props => 
								<Information
									user={this.state.user}
									updateUser={this.updateUser.bind(this)}
									{...props} 
								/>}
							/>
							<Route path="/login" exact render={props =>
								<Login
									unLogin={this.state.user == null}
									updateUser={this.updateUser.bind(this)}
									{...props}
								/>}
							/>
							<Route path="/register" exact render={props =>
								<Register {...props}/>}
							/>
							<Route path="/contest" exact render={props =>
								<ContestList
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path="/contest/:id" exact render={props =>
								<ContestDetail
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path="/blog" exact render={props =>
								<BlogList
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path="/blog/:id" exact render={props =>
								<BlogDetail
									user={this.state.user}
									{...props}
								/>}
							/>
							<Route path="/team" exact render={props =>
								<TeamList
									user={this.state.user}
									{...props}
								/>}
							/>
						</Content>
						<Footer style={{ textAlign: 'center' }}>&copy; ASTA, 2020</Footer>
					</Layout>
				</Layout>
			</Router>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('container'));