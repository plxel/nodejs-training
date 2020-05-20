const printTree = require("./printTree");

describe("printTree", () => {
  const originalError = console.error;
  const originalLog = console.log;

  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
    console.log = originalLog;
  });

  const mockedWarn = (output) => consoleOutput.push(output);
  beforeEach(() => (console.warn = mockedWarn));

  it("should return error for incorrect input", () => {
    printTree();
    expect(console.error).toBeCalledWith("Error: Expected object with 'name' and 'items' properties");
  });

  it('should print root name if no items present', () => {
    printTree({ name: 'root' });
    expect(console.log).toBeCalledWith("root");
  })

  it("should print full tree correctly", () => {
    const data = {
      "name": "1",
      "items": [
        {
          "name": 2,
          "items": [
            {
              "name": 3,
              "items": [
                {
                  "name": 8
                },
                {
                  "name": 9
                }
              ]
            },
            {
              "name": 4,
              "items": [{ "name": 10 }]
            }
          ]
        },
        {
          "name": 5,
          "items": [
            {
              "name": 6,
              "items": [
                {
                  "name": 7
                }
              ]
            }
          ]
        }
      ]
    };

    printTree(data);

    const result = [
        [ '1' ],
        [ '├──2' ],
        [ '|  ├──3' ],
        [ '|  |  ├──8' ],
        [ '|  |  └──9' ],
        [ '|  └──4' ],
        [ '|     └──10' ],
        [ '└──5' ],
        [ '   └──6' ],
        [ '      └──7' ]
    ]

    expect(console.log.mock.calls).toEqual(result)
  })
});
