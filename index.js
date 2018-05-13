import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var NebPay = require("nebpay");
var Nebulas = require('nebulas')

function App() {
  return (
    <div style={{ margin: 100 }}>
      <h1>打卡计划</h1>
      <ContentList/>
    </div>
  );
}

import { List, Avatar } from 'antd';

var listData = [];

//交易地址：d7b4cb6caf163415f976f22a4778de20242129992659c4dfe36a489a4fd58dec
//合约地址：n21FHWi9CCiQMm6dYsHgvAw4GigSuQswUYM
//自己钱包：n1Xw19Rfx3RxUnTTHtuYkwGrF42HwdXiZMB
var nebPay = new NebPay();
var neb = new Nebulas.Neb(new Nebulas.HttpRequest("https://testnet.nebulas.io"));

var Account = Nebulas.Account;
const dappAddress = "n21FHWi9CCiQMm6dYsHgvAw4GigSuQswUYM"

function getPlanList(){
  var from = "n1Xw19Rfx3RxUnTTHtuYkwGrF42HwdXiZMB"
  var value = "0";
  var nonce = "0"
  var gas_price = "1000000"
  var gas_limit = "2000000"
  var callFunction = "getPlans";
  var contract = {
      "function": callFunction,
      "args": "\[\]"
  }
  neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then( (resp) => {
      var result = JSON.parse(resp['result']);
      listData=result['plans'];
      ReactDOM.render(<App />, document.getElementById('root'));
  });
}

function ContentList(){
  return(
    <List
      itemLayout="horizontal"
      dataSource={listData}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://tva1.sinaimg.cn/crop.0.0.180.180.180/8c7a19d3jw1e9jr4fhudpj205005074i.jpg" />}
            title={item.sender}
            description={item.content}
          />
        </List.Item>
      )}
    />);
}

getPlanList()
ReactDOM.render(<App />, document.getElementById('root'));