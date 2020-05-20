
const fs = jest.genMockFromModule("fs");

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);



function __setMockFiles(newMockFiles) {
  mockFiles = newMockFiles;
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath, options = ({ withFileTypes = true } = {})) {
  return mockFiles[directoryPath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;

const PROMISE_FUNC_NAMES = ["readdir"];

fs.promises = PROMISE_FUNC_NAMES.reduce((promises, funcName) => {
  promises[funcName] = (...args) =>
    new Promise((resolve, reject) => {
      try {
        // $FlowFixMe: No indexer
        resolve(fs[`${funcName}Sync`](...args));
      } catch (error) {
        reject(error);
      }
    });

  return promises;
}, {});

module.exports = fs;
