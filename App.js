/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Button,ProgressBarAndroid} from 'react-native';
var RNFetchBlob = require('react-native-fetch-blob').default;
var RNFS = require('react-native-fs');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props)
  {
    super(props);
    this.state={progress:0,jobId:-1};
    this.Download=this.Download.bind(this);
    this.checkingForFiles=this.checkingForFiles.bind(this);
 this.checkWhetherFolderExists=this.checkWhetherFolderExists.bind(this);
 this.onProgress=this.onProgress.bind(this);
 this.onCancel=this.onCancel.bind(this);

  }

  onCancel()
  {
    if(this.state.jobId!=-1)
    {
      alert(this.state.jobId);
      RNFS.stopDownload(this.state.jobId);
    }
  }
  

  checkingForFiles()
  {
      RNFS.readDir(RNFS.DocumentDirectoryPath+'/UserDownloads/')
        .then((result) => {
          result.forEach((item)=>{
          alert(item.name)
          })

      })

  }



  onProgress(data)
  {
    this.setState({progress:data.bytesWritten/data.contentLength});

  }
 


  Download()
  {
    let temp=this;
      RNFS.downloadFile({begin:(res)=>{temp.setState({jobId:res.jobId})},progress:(data)=>this.onProgress(data),background:true,fromUrl:'http://russprince.com/hobbies/files/13%20Beethoven%20-%20Fur%20Elise.mp3',toFile: RNFS.DocumentDirectoryPath+'/UserDownloads/temp.mp3'}).promise.then(()=>{alert("File Successfully downloaded")},()=>{RNFS.unlink(RNFS.DocumentDirectoryPath+'/UserDownloads/temp.mp3');
      this.setState({progress:0,jobId:-1});});
  }




  checkWhetherFolderExists()
  {
      let temp=this;
      RNFS.exists(RNFS.DocumentDirectoryPath+'/UserDownloads').then((result)=>{
        if(result===false)
        {
           RNFS.mkdir(RNFS.DocumentDirectoryPath+'/UserDownloads').then(()=>temp.Download());
          return;
        }
        this.Download();
      
      });
  }
    

    


render() {
    return (
      <View style={styles.container}>
    
        <Button onPress={this.checkWhetherFolderExists} style={styles.instructions} title="Download"/>
              
              <Button onPress={this.checkingForFiles} style={styles.instructions} title="check"/>
              
                <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={this.state.progress}/>

           <Button onPress={this.onCancel} style={styles.instructions} title="cancel"/>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
