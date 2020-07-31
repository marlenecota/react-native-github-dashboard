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
    <View>
      <View style={{flexGrow: 1, marginRight: 12}}>
        <Text>Repo url</Text>
        <TextInput
          style={{height: 32}}
          value={url}
          onChangeText={value => setUrl(value)}
          onSubmitEditing={event => props.onUrlChanged(event.nativeEvent.text)}/>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Switch
          value={props.useCache} text='hello'
          onValueChange={value => props.onUseCacheChanged(value)}/>
        <Text>Use offline cache</Text>
      </View>
      <Button title='reset' onPress={() => props.clearCache()}/>
    </View>
  );
}

export { RepoUrl };
