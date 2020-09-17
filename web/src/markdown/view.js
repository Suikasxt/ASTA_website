import '../config';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock.js';

class MarkdownView extends Component{
	render(){
		return (
			<ReactMarkdown
				className='markdown-body'
				renderers={{
					code: CodeBlock,
				}}
				{...this.props}
			/>
		)
	}
}

export default MarkdownView;