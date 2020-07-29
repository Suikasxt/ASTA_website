import './config';
import {List, Collapse, Empty } from "antd";
import $ from 'jquery';
import moment from "moment";
import marked from "marked";
import React, { Component } from 'react';
import Loading from './loading.js'
const { Panel } = Collapse;

class Notice extends Component{
	state = {
	}
	getNoticeList = () => {
		let url = global.constants.server + 'api/notice/list/';
		this.teamListRequest = $.get({
			url: url,
			success: function (result) {
                console.log('get notice list')
                console.log(result)
				this.setState({list : result});
			}.bind(this)
		})
	}
	componentWillMount(){
		this.getNoticeList();
    }
    
	render(){
		if (this.state.list == null){
			return (
				<Loading/>
			)
        }
        
        const style_con={
            padding: '0',
            width: '100%',
            'textAlign': 'left'
        };

		let teamList = <List
        itemLayout="horizontal"
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"None"}
            />
          )
        }}
        split={false}
        dataSource={this.state.list}
        renderItem={(item) => (
          <List.Item>
            <Collapse style={style_con} defaultActiveKey={["1"]}>
              <Panel
                header={item.title}
                key="1"
                extra={`发布时间：${moment(item.time).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: marked(item.content) }}
                />
              </Panel>
            </Collapse>
          </List.Item>
        )}
      />
		return (
			<div  id = "root">
				{teamList}
			</div>
		)
	}
}
export default Notice;