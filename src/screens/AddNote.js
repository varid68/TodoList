/* eslint no-plusplus: 0 */
import React from 'react';
import { Container, Header, Body, Icon, Right, Content, Form, Item, Label, Input, Radio } from 'native-base';
import { Text, View, TouchableOpacity, StatusBar, ToastAndroid, Alert, AsyncStorage, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/id';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class AddNote extends React.Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: '#B93221',
  }

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    onTest: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      height: 60,
      createdAt: '',
      createdAtHuman: '',
      updatedAtHuman: '',
      updatedAt: '',
      title: '',
      priority: '',
      high: false,
      medium: false,
      low: false,
      note: '',
      color: '#ee766b',
    };
    this.save = this.save.bind(this);
  }

  componentWillMount() {
    const createdAt = moment().unix();
    const createdAtHuman = moment.unix(createdAt).format('dddd, DD MMMM YYYY');

    const updatedAt = moment().unix();
    const updatedAtHuman = moment.unix(updatedAt).format('DD/MM/YY HH:mm');
    this.setState({
      createdAt,
      createdAtHuman,
      updatedAt,
      updatedAtHuman,
    });
  }

  noteValidation() {
    const { title, priority, note } = this.state;
    if (title === '' || priority === '' || note === '') {
      this.setState({ color: '#ee766b' });
    } else {
      this.setState({ color: '#fff' });
    }
  }

  pop = () => {
    this.props.navigator.pop({
      animated: true,
      animationType: 'fade',
    });
    this.props.onTest();
  }

  async save() {
    const { createdAt, updatedAt, title, priority, note } = this.state; // eslint-disable-line
    if (title === '' || priority === '' || note === '') throw new Error('Kosong');

    const storeItem = {
      createdAt,
      updatedAt,
      title,
      priority,
      note,
      isSelected: false,
    };
    const isOnlyOne = await AsyncStorage.getItem('savednote');
    if (isOnlyOne == null) {
      AsyncStorage.setItem('savednote', JSON.stringify([storeItem])).then(() => {
        ToastAndroid.showWithGravityAndOffset('Berhasil Menyimpan Catatan', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 100);
        setTimeout(() => {
          this.pop();
        }, 1000);
      });
    } else {
      const results = JSON.parse(isOnlyOne);
      let counter = 0;
      results.forEach((item) => {
        if (item.title === title && item.createdAt === createdAt) {
          ToastAndroid.showWithGravityAndOffset('telah tersimpan sebelumnya', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 100);
          counter++;
        }
      });

      if (counter === 0) {
        results.push(storeItem);
        AsyncStorage.setItem('savednote', JSON.stringify(results)).then(() => {
          ToastAndroid.showWithGravityAndOffset('Berhasil Menyimpan Waktu', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 100);
          setTimeout(() => {
            this.pop();
          }, 1000);
        });
      }
    }
  }

  updateSize = (height) => {
    this.setState({ height });
  }

  toggleRadio1 = () => {
    this.setState({
      priority: 'high',
      high: true,
      medium: false,
      low: false,
    }, this.noteValidation());
  }

  toggleRadio2 = () => {
    this.setState({
      priority: 'medium',
      high: false,
      medium: true,
      low: false,
    }, this.noteValidation());
  }

  toggleRadio3 = () => {
    this.setState({
      priority: 'low',
      high: false,
      medium: false,
      low: true,
    }, this.noteValidation());
  }

  discard = () => {
    Alert.alert(
      'Hapus',
      'Ingin menghapus catatan ini ?',
      [
        {
          text: 'Ok',
          onPress: () => {
            ToastAndroid.showWithGravityAndOffset('Catatan terhapus', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 100);
            setTimeout(() => {
              this.pop();
            }, 1000);
          },
        },
        { text: 'cancel' },
      ],
      { cancelable: false },
    );
  }

  renderHeader = () => (
    <Header style={styles.headerColor}>
      <StatusBar backgroundColor="#B93221" />

      <TouchableOpacity
        style={styles.backIconParent}
        onPress={this.pop}>
        <Icon
          name="arrow-dropleft"
          style={[styles.backIcon, styles.white]} />
      </TouchableOpacity>

      <Body>
        <Text style={[styles.white, styles.title]}>Simple Notes</Text>
        <Text style={[styles.white, { fontSize: 13 }]}>Tambah Catatan Baru</Text>
      </Body>

      <Right>
        <TouchableOpacity
          onPress={this.save}
          style={styles.containerIcon}>
          <FontAwesome
            name="save"
            style={{ color: this.state.color, fontSize: 25 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.containerIcon}
          onPress={this.discard}>
          <Icon
            name="ios-trash-outline"
            style={{ color: '#fff' }} />
        </TouchableOpacity>
      </Right>
    </Header>
  )

  render() {
    const { height, createdAtHuman, high, medium, low, updatedAtHuman } = this.state; // eslint-disable-line
    const newStyle = { height };

    return (
      <Container>
        {this.renderHeader()}

        <Content
          keyboardShouldPersistTaps="always" >
          <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
            <Text style={{ flex: 1 }}>{createdAtHuman}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>
              <Icon
                name="md-time"
                style={{ fontSize: 16, color: '#555' }} /> {updatedAtHuman}
            </Text>
          </View>
          <Form>
            <Item floatingLabel>
              <Label>Note Title</Label>
              <Input
                onChangeText={title => this.setState({ title }, () => this.noteValidation())} />
            </Item>
            <Text style={styles.priority}>Silahkan Pilih Prioritas Catatan</Text>
            <View style={styles.radioParent}>
              <TouchableOpacity
                style={styles.radio}
                onPress={this.toggleRadio1}>
                <Radio
                  style={{ flex: 0.25 }}
                  selected={high}
                  onPress={this.toggleRadio1} />
                <Text>High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radio}
                onPress={this.toggleRadio2}>
                <Radio
                  style={{ flex: 0.3 }}
                  selected={medium}
                  onPress={this.toggleRadio2} />
                <Text>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radio}
                onPress={this.toggleRadio3}>
                <Radio
                  style={{ flex: 0.25 }}
                  selected={low}
                  onPress={this.toggleRadio3} />
                <Text>Low</Text>
              </TouchableOpacity>
            </View>
            <Item floatingLabel>
              <Label>Type Your Note Here</Label>
              <Input
                onChangeText={note => this.setState({ note }, () => this.noteValidation())}
                style={newStyle}
                editable
                multiline
                onContentSizeChange={e => this.updateSize(e.nativeEvent.contentSize.height)} />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerColor: {
    backgroundColor: '#DB4437',
  },
  white: {
    color: '#fff',
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

  content: {
    padding: 10,
    backgroundColor: '#fff',
  },
  inputTitle: {
    backgroundColor: 'rgba(96,125,139,.1)',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },

  priority: {
    color: '#000',
    marginBottom: 5,
    fontSize: 16,
    paddingTop: 20,
    paddingLeft: 15,
  },
  radioParent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  radio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputNote: {
    backgroundColor: 'rgba(96,125,139,.1)',
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 2,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 14,
  },

  footerText: {
    paddingTop: 13,
    fontSize: 18,
  },
  containerIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
