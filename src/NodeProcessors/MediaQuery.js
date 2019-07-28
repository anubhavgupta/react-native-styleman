import { Dimensions, I18nManager, Platform } from 'react-native';
import { processStyles } from '../Utils';
import { memo } from '../Memo';

const getCalcDims = () => {
  // CSS pixel equivalent resolution or DP resolution.
  const dims = Dimensions.get('window');

  return {
    width: dims.width,
    height: dims.height,
    screenWidth: dims.width * dims.scale,
    screenHeight: dims.height * dims.scale
  };
};

const getMediaQueryData = memo(function () {
  const calcDims = getCalcDims();

  return {
    width: calcDims.width,
    height: calcDims.height,
    version: parseFloat(Platform.Version),
    orientation: (calcDims.width > calcDims.height) ? 'landscape' : 'portrait',
    platform: Platform.OS,
    direction: I18nManager.isRTL ? 'rtl' : 'ltr'
  };
});

// validators
const mediaValidators = {
  platform: (mediaQueryData, checkDevice)=> mediaQueryData.device === checkDevice,
  minVersion: (mediaQueryData, minVersion)=> mediaQueryData.version >= minVersion,
  maxVersion: (mediaQueryData, maxVersion)=> mediaQueryData.version <= maxVersion,
  minWidth: (mediaQueryData, minWidth)=> mediaQueryData.width >= minWidth,
  maxWidth: (mediaQueryData, maxWidth)=> mediaQueryData.width <= maxWidth,
  minHeight: (mediaQueryData, minHeight)=> mediaQueryData.height >= minHeight,
  maxHeight: (mediaQueryData, maxHeight)=> mediaQueryData.height <= maxHeight,
  orientation: (mediaQueryData, checkOrientation)=> checkOrientation === mediaQueryData.orientation,
  direction: (mediaQueryData, layoutDirection)=> layoutDirection === mediaQueryData.direction,
  styles: () => true
};

/**
 * Supported queries:
 * - platform: ios | android
 * - platformVersion: minVersion, maxVersion,
 * - height: minHeight, maxHeight (Normalized, dpi based measure)
 * - width: minWidth, maxWidth (Normalized, dpi based measure)
 * - orientation: landscape, portrait
 * - direction: rtl, ltr
 */
function mediaProcessor(cacheId, styles, key, value) {
  if (!Array.isArray(value)) {
    value = [value];
  }
  const mediaQueryData = getMediaQueryData(cacheId);

  for (let i = 0; i < value.length; i++) {
    let valid = true;

    for (let rule in value[i]) {
      if (value[i].hasOwnProperty(rule)) {
        const validator = mediaValidators[rule];

        if (!validator) {
          throw new Error('React Native Styleman: Unkown Media rule defined.');
        }
        if (!validator(mediaQueryData, value[i][rule])) {
          valid = false;
          break;
        }
      }
    }
    if (valid) {
      // rule matched apply styles and quit.
      const processedStyles = processStyles(value[i].styles, cacheId);

      Object.assign(styles, processedStyles);
      break;
    }
  }
  return styles;
}

export {
  mediaProcessor
};
