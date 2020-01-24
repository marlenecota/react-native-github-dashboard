/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

class Milestone extends Component {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onPress(this.props.milestone);
        }}>
        <Text>{this.props.milestone.title}</Text>
      </TouchableWithoutFeedback>
    )
  }
}

class MilestoneList extends Component {
  render() {
    let milestones = Object.values(this.props.milestonesById).sort((a,b) => (b.count - a.count));
    return (
      <View style={styles.milestoneList}>
        {milestones.map(milestone => (
        <Milestone
          key={milestone.id}
          milestone={milestone}
          onPress={(milestone) => {
            this.props.addToFilter(milestone)
          }}/>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  milestoneList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export { Milestone, MilestoneList };
