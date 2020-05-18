import React from 'react';
import { WebView } from 'react-native-webview';
import { Linking, Alert, Share } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as IntentLauncher from 'expo-intent-launcher';

const downloadFile = (url: string) =>{
  const uri = url
  const name = url.split('/').slice(-1)[0] 
  let fileUri = FileSystem.documentDirectory + name;
  FileSystem.downloadAsync(uri, fileUri)
  .then(({ uri }) => {
      saveFile(uri);
      FileSystem.getContentUriAsync(uri).then(cUri => {
        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri,
            flags: 1,
            type: 'application/pdf'
         });
      });
    })
    .catch(error => {
      console.error(error);
    })
}

const saveFile = async (fileUri: string) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      await MediaLibrary.createAlbumAsync("Download", asset, false)
  }
}

const handleOnMessage = async (message: string) => {
  var splitmMessage = message.split("***");
  var msgType = splitmMessage[0];
  var msgData = splitmMessage[1];

  switch(msgType) {
    case 'share':
      try {
        const result = await Share.share({ message: msgData });
      } catch (error) {
        alert(error.message);
      }
      break;
    case 'download':
      console.log(msgData);
      downloadFile(msgData);
      break;
    default:
      return false
  }
};

export default class App extends React.Component {
  webview: any;

  render() {
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri: 'https://www.quierounturno.com/companies/sign_in' }}
        onMessage={(event) => { handleOnMessage(event.nativeEvent.data) } }
      />
    )
  }
}
