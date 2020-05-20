const getFilesTree = require('./getFilesTree');

jest.mock('fs');
jest.mock('path');
describe('Tree', () => {
  const MOCK_FILE_INFO = {
    path: [
      { name: 'to', isDirectory: () => true },
      { name: 'file0.txt', isDirectory: () => false },
    ],
    'path/to': [
      { name: 'file1.txt', isDirectory: () => false },
      { name: 'file2.txt', isDirectory: () => false },
    ],
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  it('should transform files tree into name-items tree structure', async () => {
    expect.assertions(1);
    const filesTree = await getFilesTree(`path`, 3);
    expect(filesTree).toEqual([
      { items: [{ name: 'file1.txt' }, { name: 'file2.txt' }], name: 'to' },
      { name: 'file0.txt' },
    ]);
  });

  it('should transform files tree into name-items tree structure from nested folders', async () => {
    expect.assertions(1);
    const filesTree = await getFilesTree(`path/to`, 3);
    expect(filesTree).toEqual([{ name: 'file1.txt' }, { name: 'file2.txt' }]);
  });
});
