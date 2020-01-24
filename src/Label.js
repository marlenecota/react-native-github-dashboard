import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

class Label extends Component {
  getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    let r = parseInt(hexcolor.substr(0,2),16);
    let g = parseInt(hexcolor.substr(2,2),16);
    let b = parseInt(hexcolor.substr(4,2),16);
    let yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress(this.props.label);
          }
        }}>
        <View style={{backgroundColor: '#' + this.props.label.color, ...styles.label}}>
          <Text style={{color: this.getContrastYIQ(this.props.label.color), ...styles.labelText}}>{this.props.label.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const LabelList = (props) => {
  let labels = Object.values(props.labelsById).sort((a,b) => (b.count - a.count));
  return (
    <View style={styles.labelList}>
      {labels.map(label => (
        <Label key={label.id} label={label} onPress={(label) => {
          props.addToFilter(label);
        }}/>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  labelList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: 4,
  },
  labelText: {

  },
});

export { Label, LabelList };
