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
      <View style={styles.milestone}>
        <Text style={styles.milestoneText}>{props.milestone.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const MilestoneList = (props) => {
  let milestones = Object.values(props.milestonesById).sort((a,b) => (a.dueDate - b.dueDate));
  return (
    <View style={styles.milestoneList}>
      {milestones.map(milestone => (
      <View
        key={milestone.title}
        style={styles.milestoneListItem}>
        <Milestone
          milestone={milestone}
          onPress={(milestone) => {
            props.addToFilter(milestone)
          }}/>
        </View>
      ))}
    </View>
    )
}

const styles = StyleSheet.create({
  milestoneList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  milestoneListItem: {
    marginRight: 4,
    marginBottom: 4,
  },
  milestone: {
    backgroundColor: 'black',
    paddingLeft: 4,
    paddingRight: 4,
  },
  milestoneText: {
    color: 'white',
  }
});

export { Milestone, MilestoneList };
