module.exports = function (...args) {
  return import('./gs.js')
    .then(m => m.default.call(this, ...args))
}
