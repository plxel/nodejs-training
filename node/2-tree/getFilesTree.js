const { readdir } = require('fs').promises;
const { join } = require('path');

async function getFilesTree(dir, maxDepth = Infinity, curDepth = 1) {
  const dirents = await readdir(dir, { withFileTypes: true });
  return Promise.all(
    dirents.map(async dirent => {
      const { name } = dirent;
      return dirent.isDirectory() && curDepth <= maxDepth
        ? {
            name,
            items: await getFilesTree(join(dir, name), maxDepth, curDepth + 1),
          }
        : { name };
    })
  );
}

module.exports = getFilesTree;
