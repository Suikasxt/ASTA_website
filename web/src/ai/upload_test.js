import '../config';
import React, { Component } from 'react';
import { message, Form, Icon, Input, Button, Upload, Card, Layout } from 'antd';

class AIUpload_test extends Component{
    state = {
		file_uploaded: null,
		filename: null,
		description: '',
		team:'',
		team_member:['','',''],
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.unLogin === false){
			this.props.history.push('/');
		}
	}
	componentWillMount(){
		
	}

	handleUploadData(file)
	{
		if(!this.state.filename)
		{
			this.setState({filename:file.name})
		}
		let d={
			filename:this.state.filename,
			team_name:this.state.team,
			team_mate1:this.state.team_member[0],
			team_mate2:this.state.team_member[1],
			team_mate3:this.state.team_member[2],
			description:this.state.description,
		}
		return d;
	}

	beforeUpload=(file, fileList)=>{
		let SUFFIX = '.cpp'
		if(!this.state.filename)
		{
			alert('Please input file name!')
			return false
		}
		else if(file.size>10485760)
		{
			alert('Size of file should be less than 10MB!')
			return false
		}
		else if(file.name.indexOf(' ') !==-1)
		{
			alert('The name of the file should not contain space.')
			return false
		}
		else if(!file.name.endsWith(SUFFIX))
		{
			alert('Only .cpp file will be accepted.')
			return false
		}
		else if(this.state.team==='')
		{
			alert('Team name is required.')
			return false
		}
		else if(this.state.team_member[0]==='' && this.state.team_member[1]==='' && this.state.team_member[2]==='')
		{
			alert('At least one team member is required.')
			return false
		}
		else
		{
			return true
		}
	}
	
	onChangefunc=(info)=>{
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
		  }
		  if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
			this.props.history.push('/');
		  } else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		  }
	}

	render(){
		const props = {
			name: 'file',
			action: global.constants.server + 'api/ai_test/upload/',
			showUploadList:false,
			headers: {
			authorization: 'authorization-text',
			},
			beforeUpload:this.beforeUpload,
			data:(file)=>this.handleUploadData(file),
			withCredentials: true,
			onChange:this.onChangefunc
		};

		const team_member=[
			{property:'team_mate1',content:"team member 1"},
			{property:'team_mate2',content:"team member 2"},
			{property:'team_mate3',content:"team member 3"},
		];

		const { getFieldDecorator } = this.props.form;
		return (
			<div  id = "root" style={{ minHeight: 500, alignItems : 'center', justifyContent: 'center', display : 'flex', flexDirection: 'column' }}>
				<Card>
					<Form onSubmit={this.handleSubmit} className="fileupload-form">
						<Form.Item>
							{getFieldDecorator('filename', {
								rules: [{ required: true, message: 'Please input file name!' }],
							})(
								<Input
									prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="file name"
									onChange={(e)=>{this.setState({filename:e.target.value})}}
								/>
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('team_name', {
								rules: [{ required: true, message: 'Please input team name!' }],
							})(
								<Input
									prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="team name"
									onChange={(e)=>{this.setState({team:e.target.value})}}
								/>
							)}
						</Form.Item>
						{
							team_member.map((c,index) => (
								<Form.Item>
									{getFieldDecorator(c.property, {
										rules: [{ required: false}],
									})(
										<Input
											placeholder={c.content}
											onChange={(e)=>{this.state.team_member[index]=e.target.value}}
										/>
									)}
								</Form.Item>
							))
						}
						<Form.Item>
							{getFieldDecorator('description', {
								rules: [{ required: false}],
							})(
								<Input.TextArea
									size='large'
									placeholder="description"
									default = ''
									onChange={(e)=>{this.setState({description:e.target.value})}}
								/>,
							)}
						</Form.Item>
						
						<Form.Item>
							{getFieldDecorator('file', {
								rules: [{ required: true, message: 'Please choose a file!' }],
							})(
								<div>
									<Upload {...props}>
										<Button>
										<Icon type='upload'/> Click to Upload
										</Button>
									</Upload>,
								</div>
							)}
						</Form.Item>
					</Form>
				</Card>
			</div>
		)
	}
}

export default Form.create({ name: 'ai_upload' })(AIUpload_test);