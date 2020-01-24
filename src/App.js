/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Linking,
  SectionList,
  Switch,
  TextInput,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const offlineData = [
  require('./offline/page1.json'),
  require('./offline/page2.json'),
  require('./offline/page3.json'),
  require('./offline/page4.json'),
  require('./offline/page5.json'),
  require('./offline/page6.json'),
  require('./offline/page7.json'),
  require('./offline/page8.json'),
  require('./offline/page9.json'),
  require('./offline/page10.json'),
  require('./offline/page11.json'),
  require('./offline/page12.json'),
  require('./offline/page13.json'),
];

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

class Label extends Component {
  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    let r = parseInt(hexcolor.substr(0,2),16);
    let g = parseInt(hexcolor.substr(2,2),16);
    let b = parseInt(hexcolor.substr(4,2),16);
    let yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress(this.props.label);
          }
        }}>
        <View style={{backgroundColor: '#' + this.props.label.color, ...styles.label}}>
          <Text style={{color: this.getContrastYIQ(this.props.label.color), ...styles.labelText}}>{this.props.label.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

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

class LabelList extends Component {
  render() {
    let labels = Object.values(this.props.labelsById).sort((a,b) => (b.count - a.count));
    return (
      <View style={styles.labelList}>
        {labels.map(label => (
          <Label key={label.id} label={label} onPress={(label) => {
            this.props.addToFilter(label);
          }}/>
        ))}
      </View>
    )
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

class GitHubQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useOfflineData: true,
      repoUrl: 'https://api.github.com/repos/microsoft/react-native-windows',
      issues: [],
    };
  }

  processIssue(issue) {
    let issueAssignee = issue.assignee;
    let assignee = 'unassigned';
    if (issueAssignee) {
      assignee = issueAssignee.login;
    }
    let milestone = {};
    if (issue.milestone) {
      milestone.id = issue.milestone.id;
      milestone.title = issue.milestone.title;
      milestone.dueDate = new Date(issue.milestone.due_on);
    } else {
      milestone.id = 0;
      milestone.title = 'unscheduled';
      milestone.dueDate = new Date(8640000000000000);
    }
    let labels = issue.labels.map(value => {
      return {
        id: value.id,
        name: value.name,
        color: value.color,
      };
    });
    return {
      id: issue.id,
      url: issue.url,
      title: issue.title,
      assignee: assignee,
      url: issue.html_url,
      labels: labels,
      milestone: milestone
    };
  }

  async queryIssues(pageNumber) {
    return new Promise((resolve, reject) => {
      let uri = `${this.state.repoUrl}/issues?state=open&sort=updated&direction=desc&page=${pageNumber}`;
      console.log(`Querying for ${pageNumber}: ${uri} (useOfflineData=${this.state.useOfflineData})`);
      
      // Use offline data versus online data while this is under active development
      // TODO: Enable a switch, or a cache so this happens naturally
      if (this.state.useOfflineData) {
        let pageData = offlineData[pageNumber - 1];
        resolve(pageData);
      } else {
        let request = new XMLHttpRequest();
        request.onload = () => {
          let pageData = JSON.parse(request.responseText);
          resolve(pageData);
        };
        request.onerror = () => {
          console.log('Error!');
          reject();
        };
        request.open(
          'get',
          uri,
          true,
        );
        request.setRequestHeader('User-Agent', 'whatever');
        request.send();
      }
    });
  }

  async queryAllIssues() {
    let pageNumber = 1;
    let issues = [];

    this.setState({
      issues: issues,
      progress: 0.0,
    });

    while (pageNumber > 0) {
      console.log(`Try page ${pageNumber}`);
      let pageData = undefined;
      try {
        pageData = await this.queryIssues(pageNumber);
      } catch {
        console.log(`Error getting ${pageNumber}`);
        break;
      }
      if (pageData === undefined || pageData.length === 0) {
        console.log(`End of pages (no ${pageNumber})`);
        break;
      }
      issues = issues.concat(pageData.map(current => this.processIssue(current)));
      this.setState({
        issues: issues,
      });
      pageNumber = pageNumber + 1;

      // TODO: Get expected number of pages so we can calculate percentage
      this.setState({
        progress: 0.5,
      });
    }

    this.setState({
      progress: 1.0,
    });
  }

  async componentDidMount() {
    this.queryAllIssues();
  }

  render() {
    return (
      <>
        {(this.state.progress < 1.0) &&
          <Text>Loading {this.state.progress}</Text>
        }
        <RepoUrl
          url={this.state.repoUrl}
          useCache={this.state.useOfflineData}
          onUrlChanged={url => {
              this.setState({
              repoUrl: url,
            });
            this.queryAllIssues();}}
          onUseCacheChanged={useCache => {
            this.setState({
              useOfflineData: useCache,
            });
            this.queryAllIssues();
          }}/>
        <Page issues={this.state.issues}/>
      </>
    );
  }
}

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <GitHubQuery/>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
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
  labelList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  milestoneList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: 4,
  },
  labelText: {

  },
});

export default App;
