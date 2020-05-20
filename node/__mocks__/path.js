
const path = jest.genMockFromModule("path");

// mock join to be more platform independent
path.join = (...args) => args.join('/');

module.exports = path;

