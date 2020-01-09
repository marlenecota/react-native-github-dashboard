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
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
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

class Issue extends Component {
  render() {
    return (
      <View style={styles.issue}>
        <Text style={styles.issueTitle}>{this.props.item.title}</Text>
        <View style={styles.milestone}>
          <Text style={styles.milestoneText}>{this.props.item.milestone}</Text>
        </View>
        {this.props.item.labels.map(label => {
          return (
            <View key={label.name} style={{backgroundColor: '#' + label.color, ...styles.label}}>
              <Text style={styles.labelText}>{label.name}</Text>
            </View>
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
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => {this.setState({collapsed: !this.state.collapsed})}}>
          <Text style={styles.assignee}>{this.props.assignee} ({this.props.list.length})</Text>
        </TouchableWithoutFeedback>
        {(!this.state.collapsed) &&
          <View>
            {this.props.list.map(item => (
              <Issue key={item.id} item={item} />
            ))}
          </View>
        }
      </View>
    );
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
    if (issue.milestone) {
      milestone = issue.milestone.title;
    }
    return {
      id: issue.id,
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
    };
  }

  processIssues(listOfIssues) {
    this.issuesByAssignee = listOfIssues.reduce((accumulator, current) => {
      let issue = this.processIssue(current);
      if (accumulator[issue.assignee] === undefined) {
        accumulator[issue.assignee] = [];
      }
      accumulator[issue.assignee].push(issue);
      return accumulator;
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
        console.log('Error getting page');
        break;
      }
      if (pageData === undefined || pageData.length === 0) {
        console.log('End of pages');
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
        {Object.keys(this.state.issuesByAssignee).map(assignee => (
          <IssueList
            key={assignee}
            assignee={assignee}
            list={this.state.issuesByAssignee[assignee]}
          />
        ))}
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
  milestone: {
    backgroundColor: '#888',
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: 4,
  },
  milestoneText: {
    backgroundColor: Colors.black,
    color: Colors.white,
  }
});

export default App;
