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
      <View style={{backgroundColor: '#' + this.props.color, ...styles.label}}>
        <Text style={{color: this.getContrastYIQ(this.props.color), ...styles.labelText}}>{this.props.name}</Text>
      </View>
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
        {this.props.item.labels.map(label => {
          return (
            <Label key={label.name} name={label.name} color={label.color}/>
          );
        })}
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
      if (groupedByMilestone[issue.milestone] === undefined) {
        groupedByMilestone[issue.milestone] = {
          milestone: issue.milestone,
          dueDate: issue.dueDate,
          data: [],
        };
      }
      groupedByMilestone[issue.milestone].data.push(issue);
      return groupedByMilestone;
    }, {});

    let sections = Object.keys(sectionsMap).map(section => sectionsMap[section]);
    let sortedSections = sections.sort((a,b) => {
      let dateCompare = a.dueDate - b.dueDate;
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return a.milestone.localeCompare(b.milestone);
    });
    
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => {this.setState({collapsed: !this.state.collapsed})}}>
          <Text style={styles.assignee}>{this.props.assignee} ({this.props.list.length})</Text>
        </TouchableWithoutFeedback>
        {!this.state.collapsed && 
        <SectionList
          sections={sortedSections}
          renderSectionHeader={({section}) => <Text style={styles.milestoneSectionHeader}>{section.milestone}</Text>}
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

class GitHubQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issuesByAssignee: {},
    };
  }

  processIssue(issue) {
    let issueAssignee = issue.assignee;
    let assignee = 'unassigned';
    if (issueAssignee) {
      assignee = issueAssignee.login;
    }
    let milestone = 'unscheduled';
    let dueDate = new Date(8640000000000000);
    if (issue.milestone) {
      milestone = issue.milestone.title;
      dueDate = new Date(issue.milestone.due_on);
    }
    return {
      id: issue.id,
      url: issue.url,
      title: issue.title,
      assignee: assignee,
      url: issue.html_url,
      labels: issue.labels.map(value => {
        return {
          name: value.name,
          color: value.color,
        };
      }),
      milestone: milestone,
      dueDate: dueDate,
    };
  }

  processIssues(listOfIssues) {
    this.issuesByAssignee = listOfIssues.reduce((issuesByAssignee, current) => {
      let issue = this.processIssue(current);
      if (issuesByAssignee[issue.assignee] === undefined) {
        issuesByAssignee[issue.assignee] = [];
      }
      issuesByAssignee[issue.assignee].push(issue);
      return issuesByAssignee;
    }, this.issuesByAssignee);
  }

  async queryIssues(pageNumber) {
    return new Promise((resolve, reject) => {
      let uri = `https://api.github.com/repos/microsoft/react-native-windows/issues?state=open&sort=updated&direction=desc&page=${pageNumber}`;
      console.log(`Querying for ${pageNumber}: ${uri}`);
      
      // Use offline data versus online data while this is under active development
      // TODO: Enable a switch, or a cache so this happens naturally
      let useOfflineData = true;
      if (useOfflineData) {
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
    this.issuesByAssignee = {};
    let pageNumber = 1;

    this.setState({
      issuesByAssignee: [],
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
      this.processIssues(pageData);
      pageNumber = pageNumber + 1;

      // TODO: Get expected number of pages so we can calcualte percentage
      this.setState({
        issuesByAssignee: this.issuesByAssignee,
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
        <AssigneeList issuesByAssignee={this.state.issuesByAssignee}/>
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
  label: {
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: 4,
  },
  labelText: {

  },
});

export default App;
