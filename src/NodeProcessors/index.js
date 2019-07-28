import { mediaProcessor } from './MediaQuery';

/**
 * Supports following node processors
 * @type {Array}
 */

const nodeProcessors = [ ];

function registerNodeProcessor(keyName, processFunction) {
  nodeProcessors.push([
    keyName,
    processFunction
  ]);
}

// register default processors
registerNodeProcessor('@media', mediaProcessor);

export {
  nodeProcessors,
  registerNodeProcessor
};
