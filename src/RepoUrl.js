/**
 * @format
 * @flow
 */

import React, {Component, useState} from 'react';
import {
  View,
  Switch,
  TextInput,
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
      <Switch
        value={props.useCache}
        onValueChange={value => props.onUseCacheChanged(value)}/>
    </View>
  );
}

export { RepoUrl };
