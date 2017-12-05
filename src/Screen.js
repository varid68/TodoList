import { Navigation } from 'react-native-navigation';

import Home from './screens/Home';
import AddNote from './screens/AddNote';
import ViewNote from './screens/ViewNote';
import FavoritScreen from './screens/FavoritScreen';

export const registerScreens = function registerScreens() {
  Navigation.registerComponent('screen.Home', () => Home);
  Navigation.registerComponent('screen.AddNote', () => AddNote);
  Navigation.registerComponent('screen.ViewNote', () => ViewNote);
  Navigation.registerComponent('screen.FavoritScreen', () => FavoritScreen);
};

export default registerScreens;
