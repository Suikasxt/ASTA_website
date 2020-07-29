import '../config';
import {Grommet,Table,TableBody,TableHeader,TableRow,TableCell,Button,TableFooter,Text,Box,CheckBox} from 'grommet'
import $ from 'jquery';
import React, { Component } from 'react';
import Loading from '../loading.js'
import { message} from 'antd';
import {Layout} from 'antd';

class AIList_team extends Component{
	state = {
		list:[],
		selected_id:-1,
		load:true,
	}

	getAIList = () => {
		let url = global.constants.server + 'api/ai/list_team/';
		this.AIListRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			success: function (result) {
				this.setState({load:false})
				if(result.result){
					this.setState({list : result.data});
					console.log(this.state.list)
				}
				else{
					message.error('Can not get AI list!')
				}
				
			}.bind(this)
		})
	}

	submit_selection = () => {
		if(this.state.selected_id===-1){
			message.error('Please select a file.')
			return
		}
		
		let url = global.constants.server + 'api/ai/select/'+this.state.selected_id+'/';
		this.AIListRequest = $.get({
			url: url,
			crossDomain: true,
			xhrFields: {
                withCredentials: true
            },
			success: function (result) {
				if(result.result){
					message.success('Select file successfully!')
				}
				else{
					message.error('Selection failed.')
				}
				
			}.bind(this)
		})
	}

	dowload_request = (pk) => {
		let url = global.constants.server + 'api/ai/download/'+pk+'/';
		let a = document.createElement('a');
		a.href = url;
		a.click();
	}

	componentWillMount(){
		this.getAIList();
    }
    
    select_change = (checked, datum) => {
        var i=0;
        var newList = this.state.list;
        datum.selected = checked;
        for(i=0;i<this.state.list.length;i++){
            if(this.state.list[i]['ai id'] === datum['ai id']){
                newList[i]=datum;
			}
			else if(checked===true)
			{
				newList[i].selected=false;
			}
		}
		this.setState({list:newList})

		if(checked===true){
			this.setState({selected_id:datum['ai id']})
		}
		else{
			this.setState({selected_id:-1})
		}
		
    }

	table_item = (c,datum) =>{
		if(c.property==='selected')
		{
			return(
				<TableCell key={c.property} scope={c.dataScope} align={c.align}>
				<CheckBox disabled={!this.props.user.isCaptain} checked={datum.selected} onChange={(event)=>this.select_change(event.target.checked,datum)}/>
				</TableCell>
			)
		}
		else if(c.property==='download')
		{
			return(
				<TableCell key={c.property} scope={c.dataScope} align={c.align}>
				<Button label='Download' onClick={()=>this.dowload_request(datum['ai id'])}/>
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

	table_foot = (c) => {
		if(c.property==='selected'){
			return(
				<TableCell key={c.property} scope={c.dataScope} align={c.align}>
					<Button disabled={!this.props.user.isCaptain} label="Submit" onClick={this.submit_selection} />
				</TableCell>
				)
		}
		else{
			return(<TableCell key={c.property} scope={c.dataScope} align={c.align}/>)
		}
	}
	
	render(){
		const { user } = this.props
		if(!user)
		{
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
			{property:'username',align:'center',label:'user name'},
			{property:'filename',align:'center',label:'file name'},
			{property:'description',align:'center',label:'description'},
			{property:'upload time',align:'center',label:'upload time'},
			{property:'download',align:'center',label:'download'},
            {property:'selected',align:'center',label:'selected'},
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
						<TableFooter>
						<TableRow>
							{columns.map(this.table_foot)}
						</TableRow>
						</TableFooter>
					</Table>
				</Grommet>
				</Box>
			</div>
			)
            
    }
        
};

export default AIList_team;