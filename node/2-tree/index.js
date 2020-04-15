const { readdir } = require('fs').promises;
const { resolve } = require('path');
const printTree = require('../utils/printTree');

if (process.argv.length <= 2) {
  console.log(`Usage: ${__filename} path/to/directory -d DEPTH_NUMBER`);
  process.exit(-1);
}

const dirPath = process.argv[2];
const depth =
  (process.argv[3] === '-d' && parseInt(process.argv[4], 10)) || undefined;

async function getFilesTree(dir, maxDepth = Infinity, curDepth = 1) {
  const dirents = await readdir(dir, { withFileTypes: true });
  return Promise.all(
    dirents.map(async dirent => {
      const { name } = dirent;
      return dirent.isDirectory() && curDepth <= maxDepth
        ? {
            name,
            items: await getFilesTree(
              resolve(dir, name),
              maxDepth,
              curDepth + 1
            ),
          }
        : { name };
    })
  );
}

function wrapWithRootDir(root, tree) {
  return { name: root, items: tree };
}

getFilesTree(dirPath, depth)
  .then(tree => printTree(wrapWithRootDir(dirPath, tree)))
  .catch(console.error);
