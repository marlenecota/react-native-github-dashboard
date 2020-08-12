import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

const CollapsableHeader = (props) => {
  let [expanded, setExpanded] = useState(props.expanded ?? true);

  let level = props.level ? parseInt(props.level) : 1;
  if (isNaN(level)) {
      level = 1;
      console.warn(`Invalid level set for '${props.header}': ${props.level}`);
  }
  let headerStyle;
  switch (parseInt(props.level)) {
    case 2: headerStyle = styles.h2; break;
    case 3: headerStyle = styles.h3; break;
    case 4: headerStyle = styles.h4; break;
    default: headerStyle = styles.h1; break;
  }

  if (props.horizontal) {
    let expandIcon = expanded
    ? <Text style={[headerStyle, styles.expandCollapseIcon]}>&#xE76B;</Text>
    : <Text style={[headerStyle, styles.expandCollapseIcon]}>&#xE76C;</Text>;

    return (
      <View style={styles.horizontalCollapsable}>
        <TouchableWithoutFeedback
          onPress={() => setExpanded(!expanded)}>
          <View style={styles.collapsable}>
            <Text
                accessibilityRole="header"
                aria-level={level}
                style={headerStyle}>
                {props.header}
            </Text>
            {expandIcon}
          </View>
        </TouchableWithoutFeedback>
        {expanded ? props.children : null}
      </View>
    );
  } else {
    let expandIcon = expanded
    ? <Text style={[headerStyle, styles.expandCollapseIcon]}>&#xE70E;</Text>
    : <Text style={[headerStyle, styles.expandCollapseIcon]}>&#xE70D;</Text>;

    return (
      <View style={props.style}>
        <TouchableWithoutFeedback 
          onPress={() => setExpanded(!expanded)}>
          <View style={styles.collapsable}>
            <Text
                accessibilityRole="header"
                aria-level={level}
                style={headerStyle}>
                {props.header}
            </Text>
            {expandIcon}
          </View>
        </TouchableWithoutFeedback>
        {expanded ? props.children : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  collapsable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalCollapsable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  expandCollapseIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    marginLeft: 4,
    marginRight: 4,
  },
  h1: {
    fontSize: 24,
  },
  h2: {
    fontSize: 22,
  },
  h3: {
    fontSize: 18,
  },
  h4: {
    fontSize: 14,
  }
});

export { CollapsableHeader };
