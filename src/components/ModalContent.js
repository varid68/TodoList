import React from 'react';
import { Modal, View, Text, PanResponder, Animated, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Body, Right, Icon, H3, Content } from 'native-base';
import PropTypes from 'prop-types';

export default class ModalContent extends React.Component {
  static propTypes = {
    modalContentVisible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
    };
  }

  componentWillMount() {
    this.state.pan.setOffset({ y: 270 });
    this.animatedValueY = 0;
    this.state.pan.y.addListener((value) => {
      this.animatedValueY = value.value;
    });


    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanresponderGrant: () => {
        this.state.pan.setValue({ y: 0 });
      },
      onPanResponderMove: Animated.event([
        null, { dy: this.state.pan.y },
      ]),
      onPanResponderRelease: () => {
        this.state.pan.setOffset({ y: this.animatedValueY });
        this.state.pan.setValue({ y: 0 });
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.modalContentVisible !== this.props.modalContentVisible) {
      this.state.pan.setOffset({ y: 270, stateTranslateY: 270 });
    }
  }


  componentWillUnmount() {
    this.state.pan.y.removeAllListeners();
  }


  getStyle() {
    return [styles.modalcontainer, {
      transform: [
        { translateY: this.state.pan.y },
      ],
    }];
  }


  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.props.modalContentVisible}
        onRequestClose={() => this.props.closeModal(false)}>

        <Animated.View style={this.getStyle()} {...this.panResponder.panHandlers}>
          <Header
            style={styles.header}
            androidStatusBarColor="#B93221">
            <Body>
              <Text style={styles.headerText}>Tentang Aplikasi</Text>
            </Body>
            <Right>
              <TouchableOpacity
                onPress={() => this.props.closeModal(false)}
                style={styles.closeModalContainer}>
                <Icon
                  name="close"
                  style={{ color: '#fff' }} />
              </TouchableOpacity>
            </Right>
          </Header>

          <Content>
            <View style={styles.versionContainer}>
              <Image
                source={require('../images/icon.png')}
                style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.versionTitle}>SimpleNote</Text>
                <Text>versi 1.0.0</Text>
                <Text>dibuat oleh varid68@gmail.com</Text>
              </View>
            </View>

            <View style={styles.padder}>
              <H3 style={styles.teal}>Simple Note Github</H3>
              <Text>
                source code dari aplikasi ini
                ada di github saya. jika berkenan silahkan clone dan jangan
                lupa <Icon name="md-star" style={{ fontSize: 12 }} /> nya.
              </Text>
              <Text style={[styles.teal, styles.underline]}>
                https://github.com/varid68/react-native-simple-note.
              </Text>
            </View>

            <View style={styles.padder}>
              <H3 style={styles.teal}>Bantuan</H3>
              <Text>
                Aplikasi Simple Note adalah aplikasi catatan sederhana.
              </Text>
              <Text />
              <Text>
                setiap catatan terdiri dari 3 item utama yaitu:
                {'\n'} 1. judul catatan
                {'\n'} 2. prioritas catatan (high, medium, low)
                {'\n'} 3. isi catatan
              </Text>
              <Text />
              <Text>
                prioritas catatan adalah penting / tidaknya sebuah catatan dengan catatan lain-nya
                yang mana terbagi 3 high(penting), medium(biasa), low(kurang penting) dan dapat diubah sesuai keinginan anda. {'\n'}{'\n'}
                fitur lain : tambahkan catatan favorit, sortir catatan
              </Text>
              <Text>{'\n'}</Text>
              <Text>
                Ini adalah Aplikasi kedua yang saya buat menggunakan React-native
                tanpa state-management dengan tujuan sebagai hasil evaluasi belajar
                saya dan bukan ditujukan untuk di komersilkan.
              </Text>
              <Text>{'\n'}</Text>

              <Text style={styles.inspired}>UI inspired By Gmail and ColorNote.</Text>
            </View>
          </Content>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  teal: {
    color: '#B93221',
  },
  padder: {
    padding: 10,
  },

  modalcontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  closeModalContainer: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#DB4437',
  },
  headerText: {
    color: '#fff',
    fontSize: 19,
  },

  versionContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  versionTitle: {
    color: '#000',
    paddingBottom: 5,
    fontSize: 18,
  },

  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#009688',
  },

  inspired: {
    color: 'red',
    textAlign: 'center',
  },
});
