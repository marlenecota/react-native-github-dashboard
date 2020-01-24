import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { RepoUrl } from './RepoUrl'
import { Page } from './Page'

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

class GitHubQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useOfflineData: false,
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
        {(this.state.progress < 1.0) &&
          <View style={styles.loading}>
            <ActivityIndicator size='large'/>
          </View>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export { GitHubQuery };
