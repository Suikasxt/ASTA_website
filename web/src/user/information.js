import '../config';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import './information.css';
import { Upload, Button, message, Descriptions, Icon	} from 'antd';

function beforeUpload(file) {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}
class Informathion extends Component{
	state = {
		avatarUploading: false,
		uploadLoading: false,
		avatarUrl: null
	}
	avatarUploadChange = info => {
		console.log(info)
		if (info.file.status === 'uploading') {
			this.setState({ avatarUploading: true });
			return;
		}
		if (info.file.status === 'done') {
			this.props.updateUser({avatar: info.file.response})
			this.setState({
				avatarUploading: false,
				avatarUrl: info.file.response});
		}
	};
	render(){
		const { user } = this.props
		if (user == null) {
			this.props.history.push('/')
			return (
				<div id = 'root' >
					<div id = 'username' > 
						Please log in.
					</div>
				</div>
			)
		}
		
		return (
			<div	id = "root">
				<Upload
					name="avatar"
					listType="picture-card"
					className="avatar-uploader"
					showUploadList={false}
					action={global.constants.server + 'modify/'}
					withCredentials={true}
					beforeUpload={beforeUpload}
					onChange={this.avatarUploadChange}
				>
					{this.state.avatarUploading?(
						<div>
							<Icon type='loading' />
							<div className="ant-upload-text">Uploading</div>
						</div>
					):(
						<img alt="avatar" src = {global.constants.server + (this.state.avatarUrl ? this.state.avatarUrl : user.avatar)} className="avatar"/>
					)}
				</Upload>
				
				<div id = 'username'>{user.username}</div>
				<Descriptions	id = "information" bordered>
					<Descriptions.Item label="Name"> {user.name} </Descriptions.Item>
					<Descriptions.Item label="Email"> {user.email} </Descriptions.Item>
					<Descriptions.Item label="Class"> {user.className} </Descriptions.Item>
					<Descriptions.Item label="ID"> {user.id} </Descriptions.Item>
				</Descriptions>
			</div>
		)
	}
}

export default Informathion;