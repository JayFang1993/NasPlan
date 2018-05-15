'use strict';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, message, Input, Button, List, Avatar } from 'antd';
const { TextArea } = Input;
import { relative } from 'path';
import { CLIENT_RENEG_LIMIT } from 'tls';
var NebPay = require("nebpay");
var Nebulas = require('nebulas')

var listData = [];
//交易地址：d7b4cb6caf163415f976f22a4778de20242129992659c4dfe36a489a4fd58dec
//合约地址：n21FHWi9CCiQMm6dYsHgvAw4GigSuQswUYM
//自己钱包：n1Xw19Rfx3RxUnTTHtuYkwGrF42HwdXiZMB
var nebPay = new NebPay();
var neb = new Nebulas.Neb(new Nebulas.HttpRequest("https://mainnet.nebulas.io"));
var Account = Nebulas.Account;
const dappAddress = "n1i4PdN3RcRacRDofuhWzRxUo7QmBydX245"

class InsertDialog extends React.Component {
  state = {
    loading: false,
    visible: false,
    planContent: ''
  }

  submitCallback = (resp) => {
    var intervalQuery = setInterval(() => {
      this.setState({ visible: false, loading: false });
      neb.api.getTransactionReceipt({ hash: resp["txhash"] }).then((receipt) => {
        if (receipt["status"] === 2) {
          message.warning('交易中，请稍后...', 2);
        } else if (receipt["status"] === 1) {
          message.success('交易成功!!!');
          clearInterval(intervalQuery)
          ReactDOM.render(<App />, document.getElementById('root'));
        } else {
          message.error('交易失败!!!');
          clearInterval(intervalQuery)
        }
      });
    }, 3000);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  planChange = (e) => {
    this.setState({
      planContent: e.target.value,
    });
  }
  handleOk = () => {
    this.setState({ loading: true });
    addPlan(this.state.planContent, this.submitCallback)
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  render() {
    const { visible, loading } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          立flag
        </Button>
        <Modal
          visible={visible}
          title="提交你的flag"
          placeholder="请输入你要立下flag的内容"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              提交
            </Button>,
          ]}>
          <TextArea onChange={this.planChange} rows={4} />
        </Modal>
      </div>
    );
  }
}

function App() {
  return (
    <div style={{ marginLeft: 250, marginRight: 250, marginTop: 50,position:relative}}>
      <center><h1>flag帝</h1></center>
      <InsertDialog/>
      <ContentList />
    </div>
  );
}

function getPlanList() {
  var from = "n1JeGQzges7KXzeMqP1u26izTqRVuhPsWTc"
  var value = "0";
  var nonce = "0"
  var gas_price = "1000000"
  var gas_limit = "2000000"
  var callFunction = "getPlans";
  var contract = {
    "function": callFunction,
    "args": "\[\]"
  }
  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then((resp) => {
    var result = JSON.parse(resp['result']);
    listData = result['plans'];
    ReactDOM.render(<App />, document.getElementById('root'));
  });
}

function addPlan(content, callback) {
  var value = "0";
  var callFunction = "addPlan"
  var callArgs = "[\"" + content + "\"]"
  nebPay.call(dappAddress, value, callFunction, callArgs, {
    listener: callback
  });
}

function ContentList() {
  return (
    <List
      itemLayout="horizontal"
      dataSource={listData}
      style={{ marginTop: 10 }}
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