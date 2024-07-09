/* eslint-disable quote-props, dot-notation */
/* global FS */
Object.assign(FS, {
  'init'                : FS.init,
  'mkdir'               : FS.mkdir,
  'mount'               : FS.mount,
  'chdir'               : FS.chdir,
  'writeFile'           : FS.writeFile,
  'readFile'            : FS.readFile,
  'createLazyFile'      : FS.createLazyFile,
  'setIgnorePermissions': function (val) {
    FS.ignorePermissions = val
  },
})
