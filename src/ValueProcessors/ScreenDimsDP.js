import { Dimensions } from 'react-native';

const getScreenWidthDP = () => {
  return Dimensions.get('window').width;
};
const getScreenHeightDP = () => {
  return Dimensions.get('window').height;
};

export {
  getScreenWidthDP,
  getScreenHeightDP
};
