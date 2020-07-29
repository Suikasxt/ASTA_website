import '../config';
import {Grommet,Table,TableBody,TableHeader,TableRow,TableCell,Button,Text,Box} from 'grommet'
import {Upload} from "grommet-icons"
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { message} from 'antd';

class AIList extends Component{
	state = {
		list:[],
		load:true,
	}
	getAIList = () => {
		let url = global.constants.server + 'api/ai/list/';
		this.AIListRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			success: function (result) {
				this.setState({load:false});
				if(result.result)
				{
					this.setState({list : result.data});
				}
				else
				{
					message.error('Can not get AI list!')
				}
				
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getAIList();
    }
	
	dowload_request = (pk) => {
		let url = global.constants.server + 'api/ai/download/'+pk+'/';
		let a = document.createElement('a');
		a.href = url;
		a.click();
	}

	upload_redirect = (event) => {
		this.props.history.push("/ai/upload");
	  }

	delete_file = (datum)=>{
		let url = global.constants.server + 'api/ai/delete/'+datum['ai id']+'/';
		this.AIdeleteRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			success: function (result) {
				if(result.result)
				{
					var newList = new Array();
					var i=0;
					for(i=0;i<this.state.list.length;i++)
					{
						if(this.state.list[i]['ai id'] !== datum['ai id'])
						{
							newList.push(this.state.list[i])
						}
					}

					this.setState({list : newList});
					console.log(this.state.list)
					message.success(`${datum['filename']} file deleted successfully`);
				}
				else
				{
					message.error(result.message)
				}
				
			}.bind(this)
		})
	}
	
	table_item = (c,datum) =>{
		if(c.property==='deleteButton')
		{
			return(
				<TableCell key={c.property} scope={c.dataScope} align={c.align}>
				<Button primary color="#111111" label = 'Delete' onClick={()=>this.delete_file(datum)}/>
				</TableCell>
			)
		}
		else if(c.property==='download')
		{
			return(
				<TableCell key={c.property} scope={c.dataScope} align={c.align}>
				<Button primary label='Download' onClick={()=>this.dowload_request(datum['ai id'])}/>
				</TableCell>
			)
		}
		else
		{
			return(
				<TableCell key={c.property} scope={c.dataScope} align={c.align}>
				<Text>{c.format ? c.format(datum) : datum[c.property]}</Text>
				</TableCell>
				)
		}
	}
	
	render(){
		if (this.state.load == true){
			return (
				<Loading></Loading>
			)
		}

		const customTheme = {
			global: {
			  font: {
				family: "Helvetica"
			  }
			},
			table: {
			  body: {
				align: "center",
				pad: { horizontal: "large", vertical: "xsmall" },
				border: "horizontal"
			  },
			  extend: () => `font-family: Arial`,
			  footer: {
				align: "start",
				border: undefined,
				pad: { horizontal: "large", vertical: "small" },
				verticalAlign: "bottom"
			  },
			  header: {
				align: "center",
				border: "bottom",
				fill: "horizontal",
				pad: { horizontal: "large", vertical: "xsmall" },
				verticalAlign: "bottom",
				background: {
				  color: "accent-1",
				  opacity: "strong"
				}
			  }
			}
		  };

		const columns = [
			//{property:'username',align:'center',label:'user name'},
			{property:'filename',align:'center',label:'file name'},
			{property:'description',align:'center',label:'description'},
			{property:'upload time',align:'center',label:'upload time'},
			{property:'download',align:'center',label:'download'},
			{property:'deleteButton',align:'center',label:'delete'},
		]

        return(
			<div align="center">
				<Box align="center" pad="large">
				<Grommet theme={customTheme}>
					<Table caption="AI list">
						<TableHeader>
						<TableRow>
							{columns.map(c => (
							<TableCell key={c.property} scope="col" align={c.align}>
								<Text>{c.label}</Text>
							</TableCell>
							))}
						</TableRow>
						</TableHeader>
						<TableBody>
						{this.state.list.map(datum => (
							<TableRow key={datum.id}>
							{columns.map((c)=>this.table_item(c,datum))}
							</TableRow>
						))}
						</TableBody>
					</Table>
				</Grommet>
				</Box>
			<Button icon={<Upload/>}
				history={this.props.history}
				label="Upload" onClick={this.upload_redirect}></Button>
			</div>
			)
            
    }
        
};

export default AIList;