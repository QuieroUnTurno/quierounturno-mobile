import React from 'react';
import { WebView } from 'react-native-webview';
import { Linking, Alert, Share } from 'react-native';

const onShare = async (message: any) => {
  try {
    const result = await Share.share({ message: message });
  } catch (error) {
    alert(error.message);
  }
};

export default class App extends React.Component {
  webview: any;

  render() {
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri: 'https://www.quierounturno.com/companies/sign_in' }}
        onMessage={(event) => { onShare(event.nativeEvent.data) } }
        onNavigationStateChange={(event) => {
          var splitUrl = event.url.split(".");
          var isPDF = splitUrl.slice(-1)[0]
          if (isPDF === "pdf") {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    )
  }
}