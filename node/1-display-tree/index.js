function processItem(item, res = "") {
  if (item.items) {
    item.items.forEach((childItem, i) => {
      const isLast = i === item.items.length - 1;
      const spaces = new Array(3).join(" ");
      console.log(res + (isLast ? "└" : "├") + "──" + childItem.name);
      processItem(childItem, res + (isLast ? " " : "|") + spaces);
    });
  }
}

function printTree(input) {
  console.log(`${input.name}`);
  processItem(input);
}

const example = {
  name: "1",
  items: [
    {
      name: 2,
      items: [
        {
          name: 3,
          items: [
            {
              name: 8,
            },
            {
              name: 9,
            },
          ],
        },
        {
          name: 4,
          items: [{ name: 10 }],
        },
      ],
    },
    {
      name: 5,
      items: [
        {
          name: 6,
          items: [
            {
              name: 7,
            },
          ],
        },
      ],
    },
  ],
};

if (process.argv[2]) {
  printTree(JSON.parse(process.argv[2]));
} else {
  printTree(example);
}
