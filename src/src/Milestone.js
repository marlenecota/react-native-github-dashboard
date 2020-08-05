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
      <View style={props.isRequiredMilestone ? styles.requiredMilestone : styles.milestone}>
        <Text style={styles.milestoneText}>{props.milestone.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const MilestoneList = (props) => {
  let milestones = Object.values(props.milestonesById).sort((a,b) => (a.dueDate - b.dueDate));
  return (
    <View style={styles.milestoneList}>
      {milestones.map(milestone => {
        let isRequiredMilestone = props.requiredMilestone === undefined
          ? true
          : props.requiredMilestone == milestone.title;
        return (
          <View
            key={milestone.title}
            style={styles.milestoneListItem}>
            <Milestone
              milestone={milestone}
              isRequiredMilestone={isRequiredMilestone}
              onPress={(milestone) => {
                props.addToFilter(milestone)
              }}/>
            </View>
        )}
      )}
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
  requiredMilestone: {
    backgroundColor: 'black',
    paddingLeft: 4,
    paddingRight: 4,
  },
  milestone: {
    backgroundColor: 'gray',
    paddingLeft: 4,
    paddingRight: 4,
  },
  milestoneText: {
    color: 'white',
  }
});

export { Milestone, MilestoneList };
