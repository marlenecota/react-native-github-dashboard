import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

const CollapsableHeader = (props) => {
  let [expanded, setExpanded] = useState(props.expanded ?? true);

  return (
    <>
      <TouchableWithoutFeedback 
        accessibilityRole='header'
        aria-level="1"
        onPress={() => setExpanded(!expanded)}>
        <View style={styles.collapsable}>
          <Text accessibilityRole="header" style={styles.header}>{props.header}</Text>
          {expanded
            ? <Text style={styles.expandCollapseIcon}>&#xE70D;</Text>
            : <Text style={styles.expandCollapseIcon}>&#xE70E;</Text>
          }
        </View>
      </TouchableWithoutFeedback>
      {expanded ? props.children : null}
    </>
  );
}

const styles = StyleSheet.create({
  collapsable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandCollapseIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    fontSize: 10,
    marginLeft: 4,
  },
  header: {
    fontSize: 24,
  }
});

export { CollapsableHeader };
