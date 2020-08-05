import React, {useState} from 'react';
import {
  View,
  Switch,
  Text,
  TextInput,
  Button,
} from 'react-native';

let RepoUrl = (props) => {
  let [url, setUrl] = useState(props.url);

  return (
    <View style={{flexDirection: 'row'}}>
      <TextInput
        style={{height: 32, flexGrow: 1}}
        value={url}
        onChangeText={value => setUrl(value)}
        onSubmitEditing={event => props.onUrlChanged(event.nativeEvent.text)}/>
      <Button title='x' onPress={props.removeUrl}/>
    </View>
  );
}

let RepoUrls = (props) => {
  let [urls, setUrls] = useState(props.urls);

  const addUrl = () => {
    urls = [...urls, ''];
    setUrls(urls);
    props.onUrlsChanged(urls);
  }

  return (
    <View>
      <View style={{flexGrow: 1, marginRight: 12}}>
        <Text>Repo urls</Text>
        {urls.map((url, index) => {
          const changeUrl = (value) => {
            let newUrls = [...urls];
            newUrls[index] = value;
            props.onUrlsChanged(newUrls);
          }
          const removeUrl = () => {
            urls.splice(index, 1);
            props.onUrlsChanged(urls);
          }
          return (
            <RepoUrl
              key={index}
              url={url}
              onUrlChanged={changeUrl}
              removeUrl={removeUrl}/>
          );
        }
        )}
        <Button title='+' onPress={addUrl}/>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Switch
          value={props.useCache} text='hello'
          onValueChange={value => props.onUseCacheChanged(value)}/>
        <Text>Use offline cache</Text>
      </View>
      <Button title='reset cache' onPress={() => props.clearCache()}/>
    </View>
  );
}

export { RepoUrls };
