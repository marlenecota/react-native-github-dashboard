import React, {Component} from 'react';

import { IssueList } from './Issue'
import { LabelFilterList } from './Label'
import { MilestoneList } from './Milestone'
import { CollapsableHeader } from './Collapsable'

const AssigneeList = (props) => {
  let assignees = Object.keys(props.issuesByAssignee).sort((a,b) => {
    let issuesA = props.issuesByAssignee[a];
    let issuesB = props.issuesByAssignee[b];
    return issuesB.length - issuesA.length;
  });
  return assignees.map(assignee => (
    <IssueList
      key={assignee}
      assignee={assignee}
      list={props.issuesByAssignee[assignee]}
    />
  ));
}

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requiredMilestone: 0,
      requiredLabels: [],
      forbiddenLabels: [],
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
      let requiredLabelsMatched = issue.labels.reduce((requiredLabelsMatched, current) => {
        if (this.state.requiredLabels.includes(current.id)) {
          requiredLabelsMatched++;
        }
        return requiredLabelsMatched;
      }, 0);

      let forbiddenLabelsMatched = issue.labels.reduce((forbiddenLabelsMatched, current) => {
        if (this.state.forbiddenLabels.includes(current.id)) {
          forbiddenLabelsMatched++;
        }
        return forbiddenLabelsMatched;
      }, 0);

      let milestonesMatched = this.state.requiredMilestone == issue.milestone.id;

      if ((forbiddenLabelsMatched == 0) && 
         (!haveRequiredLabels || requiredLabelsMatched) &&
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

    const toggleFromList = (list, item) => {
      let index = list.indexOf(item);
      let newList;
      if (index >= 0) {
        newList = [...list];
        newList.splice(index, 1);
      } else {
        newList = [item, ...list];
      }
      return newList;
    }

    const addToLabelFilter = (label) => {
      console.log(`Require '${label.name}'`);
      this.setState({
        requiredLabels: toggleFromList(this.state.requiredLabels, label.id),
      });
    }
    const filterOutLabel = (label) => {
      console.log(`Forbid '${label.name}'`);
      this.setState({
        forbiddenLabels: toggleFromList(this.state.forbiddenLabels, label.id),
      });
    }
    const resetLabelFilters = () => {
      console.log(`Reset all filters`);
      this.setState({
        requiredLabels: [],
        forbiddenLabels: [],
      });
    }

    return (
      <>
        <CollapsableHeader header="Milestones">
          <MilestoneList
            milestonesById={milestonesById}
            addToFilter={(milestone) => {
              this.setState({
                requiredMilestone: milestone.id,
              });
          }}/>
        </CollapsableHeader>
        <CollapsableHeader header="Labels">
          <LabelFilterList
            labelsById={labelsById}
            requiredLabels={this.state.requiredLabels}
            forbiddenLabels={this.state.forbiddenLabels}
            addToFilter={addToLabelFilter}
            filterOut={filterOutLabel}
            resetFilters={resetLabelFilters}
          />
        </CollapsableHeader>
        <CollapsableHeader header="Issues">
          <AssigneeList
            issuesByAssignee={issuesByAssignee}
            requiredLabels={this.state.requiredLabels}/>
        </CollapsableHeader>
      </>
    );
  }
}

export { Page };
