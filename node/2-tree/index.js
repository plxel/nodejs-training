const printTree = require('../utils/printTree');
const getFilesTree = require('./getFilesTree');

if (process.argv.length <= 2) {
  console.log(`Usage: ${__filename} path/to/directory -d DEPTH_NUMBER`);
  process.exit(-1);
}

const dirPath = process.argv[2];
const depth =
  (process.argv[3] === '-d' && parseInt(process.argv[4], 10)) || undefined;

function wrapWithRootDir(root, tree) {
  return { name: root, items: tree };
}

getFilesTree(dirPath, depth)
  .then(tree => printTree(wrapWithRootDir(dirPath, tree)))
  .catch(console.error);
