/* eslint class-methods-use-this: 0, eqeqeq: 0 */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, AsyncStorage, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');
const boxWidth = (width / 3) - 14;

export default class FavoritList extends React.Component {
  static propTypes = {
    toViewNote: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      favoriteList: null,
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('savednote').then((items) => {
      const parse = JSON.parse(items);
      if (parse !== null) {
        const result = parse.filter(el => el.isSelected == true);
        const checking = result.length == 0 ? null : result;
        this.setState({ favoriteList: checking });
      } else {
        this.setState({ favoriteList: null });
      }
    });
  }

  getColor(priority) {
    let bgColor = '';
    switch (priority) {
      case 'high': bgColor = '#D50000';
        break;

      case 'medium': bgColor = '#FFD500';
        break;

      default: bgColor = '#4CAF50';
        break;
    }
    return [styles.boxPriority, { backgroundColor: bgColor }];
  }

  renderListItem = (index, item) => (
    <TouchableOpacity
      style={styles.containerListItem}
      onPress={() => this.props.toViewNote(item)}>
      <View style={this.getColor(item.priority)} />
      <View style={styles.boxText}>
        <Text style={{ color: '#BBBBBB' }}>{item.note}</Text>
      </View>
    </TouchableOpacity>
  )

  render() {
    const { favoriteList } = this.state;

    return (
      <View>
        {favoriteList === null
          ? <View style={styles.containerEmptyText}>
            <Text style={{ color: '#BBBBBB' }}>Anda Belum Menambahkan Item Favorit</Text>
          </View> // eslint-disable-line
          : <FlatList
            data={favoriteList}
            renderItem={
              ({ index, item }) => this.renderListItem(index, item)
            }
            keyExtractor={item => item.createdAt}
            numColumns={3}
            extraData={this.state} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerEmptyText: {
    height: height - 90,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerListItem: {
    height: boxWidth,
    width: boxWidth,
    marginRight: 10,
    marginTop: 10,
  },

  boxPriority: {
    width: boxWidth,
    height: 5,
  },

  boxText: {
    width: boxWidth,
    height: boxWidth - 5,
    backgroundColor: '#000000',
  },
});
