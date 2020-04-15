function processItem(item, res = '') {
  if (item.items) {
    item.items.forEach((childItem, i) => {
      const isLast = i === item.items.length - 1;
      const spaces = new Array(3).join(' ');
      console.log(`${res + (isLast ? '└' : '├')}──${childItem.name}`);
      processItem(childItem, res + (isLast ? ' ' : '|') + spaces);
    });
  }
}

function printTree(input) {
  if (!input || !input.name) {
    console.error("Error: Expected object with 'name' and 'items' properties");
    return;
  }

  console.log(`${input.name}`);
  processItem(input);
}

module.exports = printTree;
