
/**
 * Cache size 1.
 * @param fn
 * @returns {Function}
 */
function memo(fn) {
    let result;
    let cacheInput;
    return function(input) {
        if(cacheInput === input){
            return result;
        } else {
            cacheInput = input;
            result = fn(input);
            return result;
        }
    }
}

export {
    memo
};
