/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
const { width, height } = Dimensions.get('window');

export default class App extends Component<Props> {
  constructor() {
    super();

    this.state = {
      showZip: false,
      zipcode: '',
      address: '',
    };
  }



  /* 결제 후 웹뷰로 부터 메시지 수신 */
  onPayBridgeMessage(webViewData) {
    let jsonData = JSON.parse(webViewData);
    console.log('data received', webViewData, jsonData);

    if(jsonData.success) {
      // 통신성공
      setTimeout(() => {
        this.setState({
          zipcode: jsonData.message.zipcode,
          address: jsonData.message.address,
          showZip: false,
        })
      }, 500);
    }
  }


  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress={()=>this.setState({ showZip: true})}>
          <View style={{
            width: 200, height: 50,
            backgroundColor: '#33ee33',
            borderRadios: 5, justifyContent: 'center', alignItems: 'center',
          }}>
            <Text style={{ fontSize: 20, color: 'black' }}>우편번호</Text>
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 50, }}>
          <Text style={{ fontSize: 20 }}>우편번호 : {this.state.zipcode}</Text>
          <Text style={{ fontSize: 20 }}>주   소 : {this.state.address}</Text>
        </View>
        <Modal
          ref="modalPay"
          animationType={"slide"}
          transparent={false}
          visible={this.state.showZip}
          onRequestClose={()=>this.setState({showZip: false,})}
        >
          <WebViewBridge
            style={{ width : width }}
            ref="webviewbridge"
            onBridgeMessage={this.onPayBridgeMessage.bind(this)}
            thirdPartyCookiesEnabled = {true}
            source={ {
              uri: 'http://server_uri/kakaoZip.html'
            } } />
          <Text onPress={()=>this.setState({showZip: false,})} style={{textAlign:'center'}}>닫기</Text>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
