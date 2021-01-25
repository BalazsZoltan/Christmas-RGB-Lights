class Filter {
  constructor(object){
    this.object = object ;
  }
  execute(handler) {
    let switcher = {
      'string' : 'byKey',
      'array' : 'byKeys',
      'regexp': 'byRegExp',
      'function': 'byCallback'
    };
    if(handler && handler.constructor) {
      return this[switcher[handler.constructor.name.toLowerCase()]](handler);
    } else {
      return this.object;
    }
  }
 /**
  * @param {array} keys
  */
  byKeys( keys = []) {
    return keys.reduce((a, b) => {a[b]=this.object[b] ;return a},{});
 }

 /**
  * @param {string} key
  */
  byKey(key){
    return this.byKeys([key]);
 }
 /**
  * @param {RegExp} regxp
  */
  byRegExp(regxp){
    return this.byKeys(Object.keys(this.object).filter(k=>regxp.test(k) ))
  }
  /**
   * @param {function} callback
   */
  byCallback(callback){
    return this.byKeys(Object.keys(this.object).filter(k=>callback(k,this.object[k]) ))
  }
}

module.exports = Filter;
