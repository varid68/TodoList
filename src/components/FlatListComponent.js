/* eslint eqeqeq: 0, class-methods-use-this: 0 */
import React from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import { Icon } from 'native-base';

import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/id';

export default class FlatListComponent extends React.Component {
  static propTypes = {
    toViewNote: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    refreshList: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
  }

  getDate(createdAt) {
    const date = moment.unix(createdAt).format('DD MMM');
    return date;
  }

  getInitial(title) {
    const result = title.substring(0, 1).toUpperCase();
    return result;
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
    return [styles.boxColor, { backgroundColor: bgColor }];
  }

  selectFavorite = (index, item) => {
    const tempList = this.props.list;
    tempList[index].isSelected = !tempList[index].isSelected;
    this.props.refreshList(tempList);
  }

  deleteItem = (createdAt) => {
    Alert.alert(
      '',
      'Apakah Anda yakin ingin mengirim catatan ke tong sampah?',
      [
        { text: 'batal' },
        { text: 'oke', onPress: () => this.props.deleteItem(createdAt) },
      ],
      { cancelable: false },
    );
  }

  renderListItem = (index, item) => (
    <View style={styles.containerListItem}>
      <TouchableOpacity
        style={styles.containerInitial}
        onPress={() => this.props.toViewNote(item)}
        onLongPress={() => this.deleteItem(item.createdAt)}>
        <View style={this.getColor(item.priority)}>
          <Text style={styles.dateInBox}>{this.getInitial(item.title)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 4 }}
        onPress={() => this.props.toViewNote(item)}
        onLongPress={() => this.deleteItem(item.createdAt)}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, color: '#000' }}>
          {item.title}
        </Text>
        <Text numberOfLines={2}>{item.note}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 0.7, alignItems: 'center' }}
        onPress={() => this.selectFavorite(index, item)}>
        <Text style={{ fontSize: 11, marginBottom: 10 }}>{this.getDate(item.createdAt)}</Text>
        <Icon
          name={item.isSelected ? 'md-star' : 'md-star-outline'}
          style={{ color: item.isSelected ? '#FEB500' : '#777' }} />
      </TouchableOpacity>
    </View>
  )

  render() {
    return (
      <View style={{ padding: 10 }}>
        <FlatList
          data={this.props.list}
          renderItem={
            ({ index, item }) => this.renderListItem(index, item)
          }
          keyExtractor={item => item.createdAt}
          extraData={this.props} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  list: {
    height: 82,
    backgroundColor: '#fafafa',
    marginLeft: 10,
    marginRight: 10,
  },

  containerListItem: {
    flex: 1,
    flexDirection: 'row',
    height: 65,
    marginBottom: 5,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },

  containerInitial: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconSelected: {
    color: 'red',
  },
  iconNotSelected: {
    color: '#000',
  },

  boxColor: {
    flex: 0,
    flexDirection: 'column',
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  dateInBox: {
    flex: 1,
    fontSize: 22,
    paddingTop: 10,
    alignSelf: 'center',
    color: '#fff',
  },
  monthInBox: {
    flex: 1,
    color: '#fff',
  },

  titleList: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  descTime: {
    flex: 1,
    flexDirection: 'row',
  },
});
