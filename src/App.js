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
        <Text style={styles.body}>{this.props.item.title}</Text>
        {this.props.item.labels.map(label => {
          return (
            <View key={label.name} style={{backgroundColor: '#' + label.color}}>
              <Text>{label.name}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

class IssueList extends Component {
  render() {
    return (
      <View>
        <Text style={styles.sectionTitle}>{this.props.assignee}</Text>
        {this.props.list.map(item => (
          <Issue key={item.id} item={item} />
        ))}
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
    };
  }

  processIssues(listOfIssues) {
    for (let i = 0; i < listOfIssues.length; i++) {
      console.log(listOfIssues[i].title);
    }

    this.issuesByAssignee = listOfIssues.reduce((accumulator, current) => {
      let issue = this.processIssue(current);
      if (accumulator[issue.assignee] === undefined) {
        accumulator[issue.assignee] = [];
      }
      accumulator[issue.assignee].push(issue);
      return accumulator;
    }, this.issuesByAssignee);

    console.log(this.issuesByAssignee);
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
    while (true) {
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
    }
    console.log('Set state');
    this.setState({
      issuesByAssignee: this.issuesByAssignee,
    });
  }

  async componentDidMount() {
    this.queryAllIssues();
  }

  render() {
    return (
      <>
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
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  issue: {
    flexDirection: 'row',
  }
});

export default App;
