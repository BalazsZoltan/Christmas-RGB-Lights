const XObject = require('./safe');
Object.keys(XObject).forEach((k) => Object[k] = XObject[k]);
module.exports = (() => {
 Object.keys(XObject).forEach(method => delete Object[method]);
})
