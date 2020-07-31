import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

const CollapsableHeader = (props) => {
  let [expanded, setExpanded] = useState(props.expanded ?? true);

  let level = parseInt(props.level) ?? 1;
  let headerStyle;
  switch (parseInt(props.level)) {
    case 2: headerStyle = styles.h2; break;
    case 3: headerStyle = styles.h3; break;
    case 4: headerStyle = styles.h4; break;
    default: headerStyle = styles.h1; break;
  }

  return (
    <>
      <TouchableWithoutFeedback 
        accessibilityRole='header'
        aria-level={level}
        onPress={() => setExpanded(!expanded)}>
        <View style={styles.collapsable}>
          <Text accessibilityRole="header" style={headerStyle}>{props.header}</Text>
          {expanded
            ? <Text style={[headerStyle, styles.expandCollapseIcon]}>&#xE70D;</Text>
            : <Text style={[headerStyle, styles.expandCollapseIcon]}>&#xE70E;</Text>
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
    marginLeft: 4,
  },
  h1: {
    fontSize: 24,
  },
  h2: {
    fontSize: 20,
  },
  h3: {
    fontSize: 14,
  },
  h4: {
    fontSize: 10,
  }
});

export { CollapsableHeader };
