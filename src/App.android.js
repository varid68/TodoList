import { Navigation } from 'react-native-navigation';
import { registerScreens } from './Screen';

registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'screen.Home',
  },
});
