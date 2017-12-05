import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StatusBar, ToastAndroid, StyleSheet, AsyncStorage } from 'react-native';
import { Container, Content, Header, Body, Right, Icon, Form, Item, Picker } from 'native-base';

import PropTypes from 'prop-types';
import moment from 'moment';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PopupMenu from '../components/PopupMenu';
import ModalContent from '../components/ModalContent';

export default class ViewNote extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    screen: PropTypes.string,
    item: PropTypes.shape({
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
    }),
    onTest: PropTypes.func,
  }

  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: '#B93221',
  }

  constructor(props) {
    super(props);
    this.state = {
      modalContentVisible: false,
      height: 60,
      title: '',
      priority: '',
      note: '',
      createdAt: '',
      updatedAt: '',
      isSelected: '',
      list: '',
    };
  }

  componentWillMount() {
    const { createdAt, updatedAt, title, priority, note, isSelected } = this.props.item; // eslint-disable-line
    this.setState({
      createdAt,
      updatedAt,
      title,
      priority,
      note,
      isSelected,
    });

    AsyncStorage.getItem('savednote').then((items) => {
      this.setState({ list: JSON.parse(items) });
    });
  }

  updateNote = () => {
    const { createdAt, title, priority, note, isSelected } = this.state; // eslint-disable-line
    let counter = 0;

    if (title.trim() !== this.props.item.title) counter += 1;
    if (priority !== this.props.item.priority) counter += 1;
    if (note.trim() !== this.props.item.note) counter += 1;

    if (counter === 0) ToastAndroid.showWithGravityAndOffset('Tidak Ada Perubahan', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 100);
    else {
      const result = this.state.list.filter(items => items.createdAt !== this.state.createdAt);
      const updatedAt = moment().unix();

      const storeItem = { createdAt, updatedAt, title, priority, note, isSelected }; // eslint-disable-line
      const finalResult = result.concat([storeItem]);
      AsyncStorage.setItem('savednote', JSON.stringify(finalResult)).then(() => {
        ToastAndroid.showWithGravityAndOffset('Berhasil Merubah Catatan', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 100);
        setTimeout(() => {
          this.pop();
        }, 1000);
      });
    }
  }

  showPopup = (eventName, index) => {
    if (eventName !== 'itemSelected') return;
    if (index === 0) this.toggleModal(true);
    else this.beriBintang();
  }

  beriBintang = () => {
    Alert.alert(
      'Give a Star',
      'If you have any trouble while using this application, feel free to get in touch with me on email',
      [
        { text: 'OK' },
      ],
      { cancelable: false },
    );
  }

  toggleModal = (visibility) => {
    this.setState({
      modalContentVisible: visibility,
    });
  }

  updateSize = (height) => {
    this.setState({
      height,
    });
  }

  pop = () => {
    this.props.navigator.pop({
      animated: true,
      animationType: 'fade',
    });
    if (this.props.screen !== 'favorit') this.props.onTest();
  }

  createdAtHuman = (createdAt) => {
    const createdAtHuman = moment.unix(createdAt).format('dddd, DD MMMM YYYY');
    return createdAtHuman;
  }

  updatedAtHuman = (updatedAt) => {
    const updatedAtHuman = moment.unix(updatedAt).format('DD/MM/YY HH:mm');
    return updatedAtHuman;
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
        <Text style={styles.white}>Edit Catatan</Text>
      </Body>

      <Right>
        <TouchableOpacity
          style={styles.iconContainer}>
          <FontAwesome
            name="save"
            style={{ color: '#fff', fontSize: 25 }}
            onPress={this.updateNote} />
        </TouchableOpacity>
        <PopupMenu
          actions={['Tentang aplikasi', 'Beri bintang 5']}
          onPress={this.showPopup} />
      </Right>

      <ModalContent
        modalContentVisible={this.state.modalContentVisible}
        closeModal={this.toggleModal} />
    </Header>
  );

  render() {
    const { height, createdAt, updatedAt, title, priority, note, isSelected } = this.state; // eslint-disable-line
    const newStyle = { height };

    return (
      <Container>
        {this.renderHeader()}

        <Content
          keyboardShouldPersistTaps="always">
          <View style={styles.dateContainer}>
            <Text style={{ flex: 1 }}>{this.createdAtHuman(createdAt)}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>
              <Icon
                name="md-time"
                style={{ fontSize: 16, color: '#555' }} /> {this.updatedAtHuman(this.state.updatedAt)}
            </Text>
          </View>

          <Form>
            <TextInput
              underlineColorAndroid="transparent"
              value={title}
              onChangeText={value => this.setState({ title: value })}
              style={styles.textInput} />
            <Text style={{ alignSelf: 'flex-end', fontSize: 12, marginRight: 15 }}>- Note Title -</Text>

            <View style={styles.pickerContainer}>
              <Text style={{ flex: 1 }}>Note Priority</Text>
              <Picker
                mode="dropdown"
                selectedValue={priority}
                style={{ flex: 1 }}
                onValueChange={val => this.setState({ priority: val })} >

                <Item label="High" value="high" />
                <Item label="Medium" value="medium" />
                <Item label="Low" value="low" />
              </Picker>
            </View>

            <TextInput
              underlineColorAndroid="transparent"
              editable
              multiline
              value={note}
              style={[newStyle, styles.textInput2]}
              onChangeText={value => this.setState({ note: value })}
              onContentSizeChange={e => this.updateSize(e.nativeEvent.contentSize.height)} />
            <Text style={{ alignSelf: 'flex-end', fontSize: 12, marginRight: 15 }}>- Note Content -</Text>

          </Form>
        </Content>
      </Container >
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

  dateContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15,
  },

  textInput: {
    backgroundColor: '#eee',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    fontSize: 17,
  },
  textInput2: {
    backgroundColor: '#eee',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
  },

  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
