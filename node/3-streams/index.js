const fs = require("fs");
const readline = require("readline");
const stream = require("stream");

const TOTAL_NUMS_COUNT = 17e6;
const PARTS_COUNT = 34;
const PARTS = [...new Array(PARTS_COUNT)].map((_, i) => `part${i}`);

const getRandomNumber = () => Math.round(Math.random() * 89999) + 10000;

const drainProcess = (writable) =>
  new Promise((res) => writable.once("drain", res));

class Sortable extends stream.Transform {
  constructor(options) {
    super(options);
    this.array = [];
    this.temp = "";
  }

  _transform(chunk, enc, done) {
    
    let str = chunk.toString();
    if (this.temp) {
      str = `${this.temp}${str}`;
      this.temp = "";
    }
    if (str.endsWith("\n")) {
      this.array.push(...str.split("\n"));
    } else {
      const splitted = str.split("\n");
      this.temp = splitted[splitted.length - 1];
      this.array.push(...splitted.slice(0, splitted.length - 1));
    }
    done();
  }

  _flush(done) {
    const res = this.array
      .filter(Boolean)
      .sort((a, b) => a - b)
      .join("\n");
    this.push(res);
    delete this.array;
    done();
  }
}

async function generateBigFile(fileName, linesCount = 10) {
  const wStream = fs.createWriteStream(fileName);
  for (let i = 0; i < linesCount; i++) {
    const shouldContinue = wStream.write(`${getRandomNumber()}\n`);
    if (!shouldContinue) {
      await drainProcess(wStream);
    }
  }
}

async function sortFile(file) {
  const r = fs.createReadStream(file);
  const w = fs.createWriteStream(`${file}_sorted`);
  const s = new Sortable();
  return new Promise((res) => {
    r.pipe(s).pipe(w);
    s.on("end", res);
  });
}

async function splitBigFile(fileName) {
  const rl = readline.createInterface({
    input: fs.createReadStream(fileName),
    crlfDelay: Infinity,
  });

  const fileNames = PARTS.map((part) => `${fileName}_${part}`);
  const files = fileNames.map((name) => fs.createWriteStream(name));

  let i = 0;
  for await (const line of rl) {
    const success = files[i].write(line + "\n");
    if (!success) {
      await drainProcess(files[i]);
    }
    if (i < files.length - 1) {
      i++;
    } else {
      i = 0;
    }
  }

  rl.close();
  files.forEach((f) => f.close());

  for (let i = 0; i < fileNames.length; i++) {
    await sortFile(fileNames[i]);
  }
}

async function merge(initialFile) {
  const readLines = PARTS.map((part) => {
    return readline.createInterface({
      input: fs.createReadStream(`${initialFile}_${part}_sorted`),
      crlfDelay: Infinity,
    });
  });
  const output = fs.createWriteStream("output");
  const data = {};

  const getLine = (rline) => {
    const getLineGen = (async function* () {
      for await (const line of rline) {
        yield line;
      }
    })();
    return async () => (await getLineGen.next()).value;
  };

  const generators = readLines.map((rl) => getLine(rl));

  for (let i = 0; i < PARTS.length; i++) {
    const nextData = await generators[i]();
    data[i] = nextData ? +nextData : null;
  }

  while (Object.values(data).filter((entry) => entry !== null).length) {
    const nums = Object.values(data).map((num) =>
      num === null ? Infinity : num
    );
    const min = Math.min(...nums);
    const index = nums.indexOf(min);

    const success = output.write(data[index].toString() + "\n");
    if (!success) {
      await drainProcess(output);
    }
    const nextData = await generators[index]();
    data[index] = nextData ? +nextData : null;
  }

 
}

async function main() {
  const start = process.hrtime.bigint();
  const initialFile = "bigFile";

  // generate one big file
  await generateBigFile(initialFile, TOTAL_NUMS_COUNT);

  // split into several sorted files
  await splitBigFile(initialFile);

  // sort and merge to output
  await merge(initialFile);

  PARTS.forEach((part) => {
    fs.unlinkSync(`${initialFile}_${part}`);
    fs.unlinkSync(`${initialFile}_${part}_sorted`);
  });

  const end = process.hrtime.bigint();

  const used = process.memoryUsage();
  console.info(`Time: ${(end - start) / 1000000000n}`);

  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
}

main();
