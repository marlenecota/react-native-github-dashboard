import React, {useState} from 'react';
import {
  View,
  Switch,
  Text,
  TextInput,
} from 'react-native';

let RepoUrl = (props) => {
  let [url, setUrl] = useState(props.url);
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{flexGrow: 1, marginRight: 12}}>
        <Text>Repo url</Text>
        <TextInput
          style={{height: 32}}
          value={url}
          onChangeText={value => setUrl(value)}
          onSubmitEditing={event => props.onUrlChanged(event.nativeEvent.text)}/>
      </View>
      <View>
        <Text>Use offline cache</Text>
        <Switch
          value={props.useCache}
          onValueChange={value => props.onUseCacheChanged(value)}/>
      </View>
    </View>
  );
}

export { RepoUrl };
