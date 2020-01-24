/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
  Switch,
  TextInput,
} from 'react-native';

class RepoUrl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.url,
    };
  }
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={{height: 32, flexGrow: 1}}
          value={this.state.value}
          onChangeText={value => this.setState({value: value})}
          onSubmitEditing={event => this.props.onUrlChanged(event.nativeEvent.text)}/>
        <Switch
          value={this.props.useCache}
          onValueChange={value => this.props.onUseCacheChanged(value)}/>
      </View>
    )
  }
}

export { RepoUrl };
