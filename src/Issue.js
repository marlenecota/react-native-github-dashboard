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
  Linking,
  SectionList,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import {
  Label,
} from './Label'

class Issue extends Component {
  render() {
    return (
      <View style={styles.issue}>
        <TouchableWithoutFeedback onPress={() => {Linking.openURL(this.props.item.url)}}>
          <Text style={styles.issueTitle}>{this.props.item.title}</Text>
        </TouchableWithoutFeedback>
        {this.props.item.labels.map(label => (
          <Label key={label.id} label={label}/>
        ))}
      </View>
    );
  }
}

class IssueList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.assignee === 'unassigned',
    }
  }

  render() {
    let sectionsMap = this.props.list.reduce((groupedByMilestone, issue) => {
      let group = groupedByMilestone[issue.milestone.id];
      if (group === undefined) {
        group = groupedByMilestone[issue.milestone.id] = {
          milestone: issue.milestone,
          data: [],
        };
      }
      group.data.push(issue);
      return groupedByMilestone;
    }, {});

    let sections = Object.keys(sectionsMap).map(section => sectionsMap[section]);
    let sortedSections = sections.sort((a,b) => {
      if (a.milestone.id == b.milestone.id) {
        return 0;
      }
      let dateCompare = a.milestone.dueDate - b.milestone.dueDate;
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return a.milestone.title.localeCompare(b.milestone.title);
    });

    return (
      <View>
        <TouchableWithoutFeedback onPress={() => {this.setState({collapsed: !this.state.collapsed})}}>
          <Text style={styles.assignee}>{this.props.assignee} ({this.props.list.length})</Text>
        </TouchableWithoutFeedback>
        {!this.state.collapsed && 
        <SectionList
          sections={sortedSections}
          renderSectionHeader={({section}) => <Text style={styles.milestoneSectionHeader}>{section.milestone.title}</Text>}
          renderItem={({item}) => <Issue key={item.id} item={item}/>}/>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  issueTitle: {
    backgroundColor: Colors.white,
  },
  assignee: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  milestoneSectionHeader: {
    fontWeight: '600',
    color: Colors.black,
  },
  issue: {
    flexDirection: 'row',
  },
});

export { Issue, IssueList };
