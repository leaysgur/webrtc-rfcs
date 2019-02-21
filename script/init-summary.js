const fs = require('fs');

const [,, targetPath] = process.argv;
const fileName = targetPath.split('/').pop();

const md = fs.readFileSync(`./markdown/${fileName}`, { encoding: 'utf8' });

const toc = [];
for (const line of md.split('\n')) {
  if (line.startsWith('#')) {
    toc.push(line);
  }
}

const summary = `
> [Read original](../md/${fileName})

---

${toc.join('\n\n')}
`.trim();

fs.writeFileSync(`./summary/${fileName}`, summary);
