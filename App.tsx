import React from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
  return <WebView source={{ uri: 'https://quierounturno-staging.herokuapp.com/companies/sign_in' }} />;
}
