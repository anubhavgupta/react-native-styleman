import { nodeProcessors } from './NodeProcessors';
import { valueProcessors } from './ValueProcessors';

function processStyles(stylesObj, cacheId){
    const updatedStylesObj = {
        ...stylesObj
    };
    for(let i=0; i < nodeProcessors.length; i++) {
        const [key, processor] = nodeProcessors[i];
        if(updatedStylesObj[key]){
            processor(cacheId, updatedStylesObj, key, updatedStylesObj[key]);
            delete updatedStylesObj[key];
        }
    }
    return updatedStylesObj;
}

function provideValueProcessors(themeFn) {
    return themeFn(valueProcessors);
}

export {
    processStyles,
    provideValueProcessors
}