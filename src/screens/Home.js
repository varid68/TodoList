/* eslint eqeqeq: 0, no-plusplus: 0 */
import React from 'react';
import { Text, View, Alert, StatusBar, TouchableOpacity, AsyncStorage, StyleSheet, Dimensions } from 'react-native';
import { Container, Header, Body, Right, Content, Icon } from 'native-base';

import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ModalContent from '../components/ModalContent';
import PopupMenu from '../components/PopupMenu';
import FlatList from '../components/FlatListComponent';

const { height, width } = Dimensions.get('window');

export default class Home extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: '#B93221',
  }

  constructor(props) {
    super(props);
    this.state = {
      list: null,
      modalContentVisible: false,
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    AsyncStorage.getItem('savednote').then((val) => {
      const parse = JSON.parse(val);
      let checkNull = parse != null ? parse : null;
      if (checkNull != null) checkNull = parse.sort((n1, n2) => n2.createdAt - n1.createdAt);

      this.setState({ list: checkNull });
    });
  }

  callbackFunc = () => {
    this.getList();
  }

  toFavoritScreen = () => {
    this.props.navigator.push({
      screen: 'screen.FavoritScreen',
      animated: true,
      animationType: 'slide-horizontal',
    });
  }

  toAddNote = () => {
    this.props.navigator.push({
      screen: 'screen.AddNote',
      animated: true,
      animationType: 'slide-horizontal',
      passProps: {
        onTest: this.callbackFunc,
      },
    });
  }

  showPopup = (eventName, index) => {
    if (eventName !== 'itemSelected') return;
    if (index === 0) this.toggleModal(true);
    else this.beriBintang();
  }

  toggleModal = (visibility) => {
    this.setState({ modalContentVisible: visibility });
  }

  beriBintang = () => {
    Alert.alert(
      '',
      'If you have any trouble while using this application, feel free to get in touch with me on email',
      [
        { text: 'OK' },
      ],
      { cancelable: false },
    );
  }

  toViewNote = (item) => {
    this.props.navigator.push({
      screen: 'screen.ViewNote',
      animated: true,
      animationType: 'slide-horizontal',
      passProps: {
        onTest: this.callbackFunc,
        item,
      },
    });
  }

  refreshList = (newList) => {
    this.setState({ list: newList });
    AsyncStorage.setItem('savednote', JSON.stringify(newList));
  }

  deleteItem = (createdAt) => {
    if (this.state.list.length === 1) {
      this.setState({ list: null });
      AsyncStorage.removeItem('savednote');
    } else {
      const list = this.state.list.filter(item => item.createdAt !== createdAt);
      this.setState({ list });
      AsyncStorage.setItem('savednote', JSON.stringify(list));
    }
  }

  sort(arg) {
    let sorted;
    const list = this.state.list == null ? [] : this.state.list;
    switch (arg) {
      case 'namaA':
        sorted = list.sort((n1, n2) => {
          if (n1.title > n2.title) return 1;
          if (n1.title < n2.title) return -1;
          return 0;
        });
        break;

      case 'createdAt':
        sorted = list.sort((n1, n2) => n2.createdAt - n1.createdAt);
        break;

      case 'updatedAt':
        sorted = list.sort((n1, n2) => n2.updatedAt - n1.updatedAt);
        break;

      default: {
        const high = list.filter(item => item.priority == 'high');
        const medium = list.filter(item => item.priority == 'medium');
        const low = list.filter(item => item.priority == 'low');
        sorted = high.concat(medium, low);
        break;
      }
    }
    if (sorted != '') this.setState({ list: sorted });
  }

  renderHeader = () => (
    <Header style={{ backgroundColor: '#DB4437' }}>
      <StatusBar backgroundColor="#B93221" />

      <Body>
        <Text style={{ color: '#fff', fontSize: 18 }}>Simple Notes</Text>
      </Body>

      <Right>
        <TouchableOpacity
          style={styles.containerIcon}
          onPress={this.toFavoritScreen}>
          <MaterialIcons
            name="favorite"
            style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.containerIcon}
          onPress={this.toAddNote}>
          <MaterialIcons
            name="library-add"
            style={styles.icon} />
        </TouchableOpacity>
        <PopupMenu
          actions={['Tentang aplikasi', 'Beri bintang 5']}
          onPress={this.showPopup} />
      </Right>

      <ModalContent
        modalContentVisible={this.state.modalContentVisible}
        closeModal={this.toggleModal} />
    </Header>
  )

  render() {
    const { list } = this.state;

    return (
      <Container>
        {this.renderHeader()}

        <Content>
          {list !== null
            ? <FlatList
              refreshList={this.refreshList}
              deleteItem={this.deleteItem}
              list={list}
              toViewNote={this.toViewNote} />
            : <View style={styles.emptyTextContainer}>
              <Text>Anda Belum Memiliki Catatan</Text>
            </View> // eslint-disable-line react/jsx-closing-tag-location
          }
        </Content>

        <Text style={{ fontSize: 11, textAlign: 'center' }}>UI Inspired By Gmail & ColorNote</Text>

        <ActionButton
          spacing={5}
          buttonColor="rgba(231,76,60,1)"
          icon={<Icon name="funnel" size={25} style={styles.white} />}>
          <ActionButton.Item
            buttonColor="#9b59b6"
            style={{ width: 20, height: 20 }}
            title="Title A~Z"
            onPress={() => this.sort('namaA')}>
            <Icon
              name="md-arrow-round-down"
              style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Date created"
            onPress={() => this.sort('createdAt')} >
            <Icon
              name="md-time"
              style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Date modified"
            onPress={() => this.sort('updatedAt')} >
            <Icon
              name="md-brush"
              style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Priority"
            onPress={() => this.sort('priority')} >
            <Icon
              name="md-notifications-off"
              style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

      </Container >
    );
  }
}

const styles = StyleSheet.create({
  white: {
    color: '#fff',
  },
  containerIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
    fontSize: 25,
  },
  emptyTextContainer: {
    height: height - 100,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
