import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

const Milestone = (props) => {
  return (
    <TouchableWithoutFeedback
      accessibilityRole="button"
      onPress={() => {
        props.onPress(props.milestone);
      }}>
      <Text>{props.milestone.title}</Text>
    </TouchableWithoutFeedback>
  )
}

const MilestoneList = (props) => {
  let milestones = Object.values(props.milestonesById).sort((a,b) => (a.dueDate - b.dueDate));
  return (
    <View style={styles.milestoneList}>
      {milestones.map(milestone => (
      <Milestone
        key={milestone.id}
        milestone={milestone}
        onPress={(milestone) => {
          props.addToFilter(milestone)
        }}/>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  milestoneList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export { Milestone, MilestoneList };
