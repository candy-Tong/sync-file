// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function getAbsolutePath(p) {
  return path.resolve(__dirname, p);
}

module.exports = function handler() {
  return [
    {
      source: getAbsolutePath('./files/test-file'),
      // destDir 可省略，默认为 sync-file 运行目录
    },
    {
      source: getAbsolutePath('./files/test-file-in-config'),
      destDir: './config',
    },
  ];
};
