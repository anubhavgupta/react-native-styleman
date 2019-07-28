import { getMRem } from './Mrem';
import { getVRem } from './VRem';
import { getRem } from './Rem';
import { getRound } from './Round';
import { getScreenHeightDP, getScreenWidthDP } from './ScreenDimsDP';
import { getScreenHeightPX, getScreenWidthPX } from './ScreenDimsPX';

const valueProcessors = { };

function registerValueProcessor(processFunctionName, processFunction) {
  if (!valueProcessors[processFunctionName]) {
    valueProcessors[processFunctionName] = processFunction;
  } else {
    throw new Error(`${processFunctionName} is already registered`);
  }
}

registerValueProcessor('getScreenWidthDP', getScreenWidthDP);
registerValueProcessor('getScreenHeightDP', getScreenHeightDP);
registerValueProcessor('getScreenWidthPX', getScreenWidthPX);
registerValueProcessor('getScreenHeightPX', getScreenHeightPX);
registerValueProcessor('getRem', getRem);
registerValueProcessor('getMRem', getMRem);
registerValueProcessor('getVRem', getVRem);
registerValueProcessor('getRound', getRound);

export {
  valueProcessors,
  registerValueProcessor
};
