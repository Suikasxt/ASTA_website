import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import Editor from 'for-editor';
import { message } from 'antd';

class MarkdownEditor extends Component{
	constructor() {
		super()
		this.editor = React.createRef()
	}
	addImg($file) {
		let data = new FormData()
		data.append("editormd-image-file", $file)
		$.post({
			url: global.constants.server + 'mdeditor/uploads/',
			data: data,
			crossDomain: true,
			processData: false,
			contentType: false,
			xhrFields: {
				withCredentials: true
			},
			success: function (result) {
				if (result.success){
					message.success(result.message)
				}else{
					message.error(result.message)
				}
				this.editor.current.$img2Url($file.name, result.url)
			}.bind(this),
			error: function (result) {
				message.error(result.responseText)
			}.bind(this),
		})
	}
	render(){
		return (
			<Editor
				placeholder='Begin editing...'
				preview={true}
				subfield={true}
				ref={this.editor}
				addImg={($file) => this.addImg($file)}
				{...this.props}
			/>
		)
	}
}

export default MarkdownEditor;