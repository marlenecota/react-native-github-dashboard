/**
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  View,
} from 'react-native';

import { IssueList } from './Issue'
import { LabelList } from './Label'
import { MilestoneList } from './Milestone'

class AssigneeList extends Component {
  render() {
    let assignees = Object.keys(this.props.issuesByAssignee).sort((a,b) => {
      let issuesA = this.props.issuesByAssignee[a];
      let issuesB = this.props.issuesByAssignee[b];
      return issuesB.length - issuesA.length;
    });
    return assignees.map(assignee => (
      <IssueList
        key={assignee}
        assignee={assignee}
        list={this.props.issuesByAssignee[assignee]}
      />
    ));
  }
}

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requiredMilestone: 0,
      requiredLabels: [],
    };
  }

  countById(collection, item) {
    let id = item.id;
    let existing = collection[id];
    if (!existing) {
      existing = collection[id] = item;
      existing.count = 1;
    } else {
      existing.count += 1;
    }
  }

  addById(collection, id, item) {
    let existing = collection[id];
    if (!existing) {
      collection[id] = [item];
    } else {
      existing.push(item);
    }
  }

  render() {
    let issuesByAssignee = {};
    let milestonesById = {};
    let labelsById = {};

    this.props.issues.forEach(issue => {

      let haveRequiredLabels = this.state.requiredLabels.length > 0;
      let labelsMatched = issue.labels.reduce((labelsMatched, current) => {
        // TODO: Check whole list
        if (haveRequiredLabels > 0 && this.state.requiredLabels[0] == current.id) {
          labelsMatched++;
        }
        return labelsMatched;
      }, 0);

      let milestonesMatched = this.state.requiredMilestone == issue.milestone.id;

      if ((!haveRequiredLabels || labelsMatched) &&
         (!this.state.requiredMilestone || milestonesMatched)) {
        this.addById(issuesByAssignee, issue.assignee, issue);
      }

      issue.labels.forEach(label => {
        this.countById(labelsById, label);
      });

      if (issue.milestone.id) {
        this.countById(milestonesById, issue.milestone);
      }
    });

    return (
      <>
        <MilestoneList
          milestonesById={milestonesById}
          addToFilter={(milestone) => {
            this.setState({
              requiredMilestone: milestone.id,
            });
        }}/>
        <LabelList
          labelsById={labelsById}
          addToFilter={(label) => {
            // TODO: Append to list
            this.setState({
              requiredLabels: [label.id],
            });
        }}/>
        <AssigneeList issuesByAssignee={issuesByAssignee} requiredLabels={this.state.requiredLabels}/>
      </>
    );
  }
}

export { Page };
