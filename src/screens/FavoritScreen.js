import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, StyleSheet } from 'react-native';
import { Container, Header, Content, Body, Right } from 'native-base';

import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import PopupMenu from '../components/PopupMenu';
import ModalContent from '../components/ModalContent';
import FavoriteList from '../components/FavoritList';

export default class FavoritScreen extends React.Component {
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
      modalContentVisible: false,
    };
  }

  pop = () => {
    this.props.navigator.pop({
      animated: true,
      animationType: 'fade',
    });
  }

  showPopup = (eventName, index) => {
    if (eventName !== 'itemSelected') return;
    if (index === 0) this.toggleModal(true);
    else this.beriBintang();
  }

  toggleModal = (visibility) => {
    this.setState({
      modalContentVisible: visibility,
    });
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
        screen: 'favorit',
        item,
      },
    });
  }

  renderHeader = () => (
    <Header style={styles.headerColor}>
      <StatusBar backgroundColor="#B93221" />

      <TouchableOpacity
        style={styles.backIconParent}
        onPress={this.pop}>
        <FontAwesome
          name="caret-left"
          style={[styles.backIcon, styles.white]} />
      </TouchableOpacity>

      <Body>
        <Text style={[styles.white, styles.title]}>Simple Notes</Text>
        <Text style={styles.white}>Catatan Favorit</Text>
      </Body>

      <Right>
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
    return (
      <Container>
        {this.renderHeader()}

        <Content style={{ backgroundColor: '#212021' }}>
          <View style={styles.containerList}>
            <FavoriteList
              toViewNote={this.toViewNote} />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  white: {
    color: '#fff',
  },

  headerColor: {
    backgroundColor: '#DB4437',
  },

  backIconParent: {
    alignSelf: 'center',
    width: 40,
  },
  backIcon: {
    fontSize: 45,
  },
  title: {
    fontSize: 16,
  },

  containerIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
});
