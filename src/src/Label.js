import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';

const unpackHexColor = (hexcolor) => {
  hexcolor = hexcolor.replace('#', '');
  let r = parseInt(hexcolor.substr(0,2),16);
  let g = parseInt(hexcolor.substr(2,2),16);
  let b = parseInt(hexcolor.substr(4,2),16);
  return {r, g, b};
}

const packHexColor = (r, g, b) => {
  const componentToHex= (c) => {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const getContrastYIQ = (hexcolor) => {
  let {r, g, b} = unpackHexColor(hexcolor);
  let yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'black' : 'white';
}

const desaturateColor = (hexcolor, saturation) => {
  let {r, g, b} = unpackHexColor(hexcolor);
  var gray = r * 0.3086 + g * 0.6094 + b * 0.0820;

  const desaturateComponent = (c) => {
    return Math.round(c * saturation + gray * (1-saturation))
  }

  return packHexColor(
    desaturateComponent(r),
    desaturateComponent(g),
    desaturateComponent(b));
}

class Label extends Component {
  render() {
    let backgroundColor = this.props.backgroundColor ?? '#' + this.props.label.color;
    let foregroundColor = this.props.foregroundColor ?? getContrastYIQ(backgroundColor);

    return (
      <TouchableWithoutFeedback
        accessibilityRole={this.props.onPress ? 'button' : 'link'}
        href={this.props.label.url}
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress(this.props.label);
          } else {
            Linking.openURL(this.props.label.url)
          }
        }}>
        <View style={[styles.labelContainer, {backgroundColor: backgroundColor}]}>
          <Text style={[styles.labelText, {color: foregroundColor}]}>{this.props.label.name}</Text>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const LabelFilterList = (props) => {
  let labels = Object.values(props.labelsById).sort((a,b) => (b.count - a.count));
  return (
    <View style={styles.labelList}>
      {labels.map(label => {
        let isRequired = props.requiredLabels.includes(label.id);
        let isForbidden = props.forbiddenLabels.includes(label.id);
        let areAnyRequired = props.requiredLabels.length > 0;

        let backgroundColor = areAnyRequired && !isRequired
          ? desaturateColor(label.color, 0.1)
          : '#' + label.color;
        let foregroundColor = getContrastYIQ(backgroundColor);
        return (
          <View
            key={label.id}
            style={styles.labelListItem}>
            <Label
              accessibilityRole='button'
              label={label}
              backgroundColor={backgroundColor}
              foregroundColor={foregroundColor}
              onPress={(label) => {
                props.addToFilter(label);
            }}>
              {(isRequired ?
                <Text style={[styles.filterIcon, {color: foregroundColor}]}>&#xE71C;</Text> :
                null)
              }
              <TouchableWithoutFeedback
                onPress={() => {
                  props.filterOut(label);
                }}>
                {isForbidden
                ? <Text style={[styles.closeIcon, {color: foregroundColor}]}>&#xE710;</Text>
                : <Text style={[styles.closeIcon, {color: foregroundColor}]}>&#xE711;</Text>
                }
              </TouchableWithoutFeedback>
            </Label>
            
          </View>
      )})}
      <TouchableWithoutFeedback
        onPress={() => {
          props.resetFilters();
        }}>
          <View
            accessibilityRole='button'
            style={[styles.labelListItem, styles.resetButton]}>
            <Text style={styles.resetButtonText}>&#xE7A7;</Text>
          </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  labelList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labelListItem: {
    marginRight: 4,
    marginBottom: 4,
    flexDirection: 'row',
  },
  labelContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
  },
  filterIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    fontSize: 10,
  },
  closeIcon: {
    fontFamily: 'Segoe MDL2 Assets',
    fontSize: 10,
    marginLeft: 4,
  },
  resetButton: {
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
  },
  resetButtonText: {
    fontFamily: 'Segoe MDL2 Assets',
    fontSize: 10,
    alignSelf: 'center',
  }
});

export { Label, LabelFilterList };
