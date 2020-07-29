import './config';
import React, { Component } from 'react';
import { Spin  } from 'antd';


class Loading extends Component{
	render(){
		return (
			<div  id = "root"  style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spin  tip = "Loading..."  size = "large"></Spin>
			</div>
		)
	}
}

export default Loading;