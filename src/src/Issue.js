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
  Label,
} from './Label'

const Issue = (props) => {
  return (
    <View style={styles.issue}>
      <TouchableWithoutFeedback
        accessibilityRole='link'
        href={props.item.url}
        onPress={() => {Linking.openURL(props.item.url)}}>
        <View style={styles.issueNumberContainer}>
          <Text style={styles.issueNumber}>{props.item.number}</Text>
        </View>
      </TouchableWithoutFeedback>
      <Text style={styles.issueTitle}>{props.item.title}</Text>
      {props.item.labels.map(label => (
        <View style={styles.labelListItem}>
          <Label key={label.id} label={label}/>
        </View>
      ))}
    </View>
  );
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
        <TouchableWithoutFeedback 
          accessibilityRole='header'
          aria-level="2" 
          onPress={() => {this.setState({collapsed: !this.state.collapsed})}}>
          <View style={styles.assignee}>
            <Text style={styles.assigneeIcon}>&#xE77B;</Text>
            <Text
              style={styles.assigneeName}>
              {this.props.assignee}
            </Text>
            <Text
              style={styles.assigneeCount}>
              ({this.props.list.length})
            </Text>
            {this.state.collapsed
            ? <Text style={styles.expandCollapseIcon}>&#xE70E;</Text>
            : <Text style={styles.expandCollapseIcon}>&#xE70D;</Text>
            }
          </View>
        </TouchableWithoutFeedback>
        {!this.state.collapsed && 
        <SectionList
          sections={sortedSections}
          renderSectionHeader={({section}) =>
            <Text
              accessibilityRole='header'
              aria-level="3" 
              style={styles.milestoneSectionHeader}>{section.milestone.title}
            </Text>}
          renderItem={({item}) =>
            <Issue
              key={item.id}
              item={item}>
            </Issue>}/>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  issueTitle: {
    backgroundColor: 'white',
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
  },
  issueNumberContainer: {
    backgroundColor: 'grey',
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
  },
  issueNumber: {
    color: 'white',
    fontSize: 11,
  },
  assignee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeName: {
    fontSize: 24,
    fontWeight: '600',
  },
  assigneeCount: {
    fontSize: 14,
    marginLeft: 8,
  },
  milestoneSectionHeader: {
    fontWeight: '600',
    color: 'black',
  },
  issue: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
    alignItems: 'center',
  },
  labelListItem: {
    marginRight: 4,
  },
  assigneeIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    fontSize: 24,
    marginRight: 4,
  },
  expandCollapseIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    fontSize: 10,
    marginLeft: 4,
  }
});

export { Issue, IssueList };
