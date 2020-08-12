# react-native-github-dashboard

A React Native application for querying GitHub issues:
- Combine issues from multiple repos
- Pulls down all github paginated data
- Cache query results
- Organized view
  - grouped by Assignee
  - grouped by Milestone
- Filter content
  - by Label
  - by Milestone
- Act on content: Issues when clicked will launch the GitHub webpage for that issue.

![Screenshot of application](images/Screenshot.png)

# How to run

### Windows
```
yarn windows
```

### Web
```
yarn web-server
```
Then connect your web browser for `localhost:8080`