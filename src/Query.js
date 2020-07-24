import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { RepoUrl } from './RepoUrl'
import { Page } from './Page'

import AsyncStorage from '@react-native-community/async-storage';

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

  parseLinkHeader(request) {
    let header = request.getResponseHeader("link");

    let matches = [...header.matchAll(/<(.+?)page=(\d+)>;\s*rel="(\w+)",*/g)];

    return matches.reduce((linkHeaders, match) => {
      linkHeaders[match[3]] = {
        linkType: match[3],
        baseUri: match[1],
        pageNumber: match[2]
      };
      return linkHeaders;
    }, {});
  }

  async queryIssues(pageNumber) {
    let uri = `${this.state.repoUrl}/issues?state=open&sort=updated&direction=desc&page=${pageNumber}`;

    let storedValue = undefined;
    if (this.state.useOfflineData) {
      try {
        storedValue = await AsyncStorage.getItem(uri);
      } catch(e) {
      }
    }

    return new Promise((resolve, reject) => {
      try {
        if (storedValue !== null) {
          let storedJSONValue = JSON.parse(storedValue)
          console.log(`Using cached value for ${pageNumber}: ${uri}`);
          resolve(storedJSONValue);
          return;
        }
      } catch(e) {
        console.log(`Error parsing cached value for ${pageNumber}`);
        console.log(e);
        console.log(storedValue);
      }

      // TODO: This should be come effectively placeholder data for if you've never been online (no cache)
      /*if (this.state.useOfflineData) {
        let pageData = offlineData[pageNumber - 1];
        resolve(pageData);
      } else*/
      {
        let request = new XMLHttpRequest();
        request.onload = () => {
          console.log(`Querying for ${pageNumber}: ${uri} (useOfflineData=${this.state.useOfflineData})`);

          let pageData = {
            data: JSON.parse(request.responseText),
            linkHeaders: this.parseLinkHeader(request)
          }

          resolve(pageData);

          try {
            AsyncStorage.setItem(uri, JSON.stringify(pageData));
          } catch (e) {
            console.log(`Error caching value for ${pageNumber}`);
            console.log(e);
          }
        };
        request.onerror = () => {
          console.log(`Error fetching ${pageNumber}`);
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
    let firstPageNumber = 1;
    let issues = [];

    this.setState({
      issues: issues,
      progress: 0.0,
    });

    console.log(`Trying first page #${firstPageNumber}`);
    let firstPageData = undefined;
    try {
      firstPageData = await this.queryIssues(firstPageNumber);
    } catch {
      console.log(`Error getting first page`);
      return;
    }

    const isPageDataValid = (pageData) => {
      if (pageData === undefined) {
        console.log(`No page data`);
        return false;
      } 
      if (pageData.data === undefined || pageData.data.length === 0) {
        console.log(`Malformed page data`);
        console.log(pageData);
        return false;
      }
      return true;
    }
    if (!isPageDataValid(firstPageData)) {
      return;
    } 

    let lastPageNumber = firstPageData.linkHeaders.last.pageNumber;
    console.log(`Last page # is ${lastPageNumber}`);

    let pagesCompleted = 0;

    const processPage = (pageData) => {
      if (isPageDataValid(pageData)) {
        let pageNumber;
        if (pageData.linkHeaders.next) {
          pageNumber = parseInt(pageData.linkHeaders.next.pageNumber) - 1;
        } else {
          pageNumber = parseInt(pageData.linkHeaders.prev.pageNumber) + 1;
        }
        console.log(`Processing page #${pageNumber}`);
        issues = issues.concat(pageData.data.map(current => this.processIssue(current)));
      }
      pagesCompleted++;
      let progress = pagesCompleted / lastPageNumber;
      this.setState({
        progress: progress,
        issues: issues,
      });
    }

    processPage(firstPageData);

    // Go fetch all the remaining pages in parallel
    for (let parallelPageNumber = firstPageNumber + 1; parallelPageNumber <= lastPageNumber; parallelPageNumber++) {
      console.log(`Querying page #${parallelPageNumber}`);
      this.queryIssues(parallelPageNumber).then(processPage);
    }
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
