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

class GitHubQuery extends Component {
  processIssue(issue) {
    let issueAssignee = issue.assignee;
    let assignee = 'unassigned';
    if (issueAssignee) {
      assignee = issueAssignee.login;
    }
    return {
      title: issue.title,
      assignee: assignee,
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
    console.log(`Querying for ${pageNumber}`);
    let request = new XMLHttpRequest();
    request.onload = () => {
      this.processIssues(JSON.parse(request.responseText));
    };
    request.onerror = () => {
      console.log('Error!');
    };
    request.open(
      'get',
      `https://api.github.com/repos/microsoft/react-native-windows/issues?state=open&sort=updated&direction=desc&page=${pageNumber}`,
      true,
    );
    request.setRequestHeader('User-Agent', 'whatever');
    request.send();
  }

  async queryAllIssues() {
    this.issuesByAssignee = {};
    await this.queryIssues(1);
    await this.queryIssues(2);
    await this.queryIssues(3);
  }

  async componentDidMount() {
    this.queryAllIssues();
  }

  render() {
    return (
      <View>
        <Text>Hello!</Text>
      </View>
    );
  }
}

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <GitHubQuery/>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
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
});

export default App;
