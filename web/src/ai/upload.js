import '../config';
import React, { Component } from 'react';
import { message, Form, Icon, Input, Button, Upload, Card, Layout } from 'antd';

class AIUpload extends Component{
    state = {
		file_uploaded: null,
		filename: null,
		description: '',
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
		let d={filename:this.state.filename, description:this.state.description}
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
			this.props.history.push('/ai/list/');
		  } else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		  }
	}

	render(){
		const { user } = this.props
		if(!user)
		{
			this.props.history.push('/login/')
			return(<div>login first</div>)
		}
		if(!user.team)
		{
			const div_style={'text-align': 'center', 'font-size':30}
			return (
				<Layout>
					<Layout style={{ minHeight: '40vh'}}></Layout>
					<div style={div_style}>Please join or create a team first.</div>
				</Layout>
			)
		}
		else{
			const props = {
				name: 'file',
				action: global.constants.server + 'api/ai/upload/',
				showUploadList:false,
				headers: {
				authorization: 'authorization-text',
				},
				beforeUpload:this.beforeUpload,
				data:(file)=>this.handleUploadData(file),
				withCredentials: true,
				onChange:this.onChangefunc
			};

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
}

export default Form.create({ name: 'ai_upload' })(AIUpload);