const fs = require('fs');
const { execFile } = require('child_process');

const [,, targetPath] = process.argv;
const fname = targetPath.split('/').pop();
const [name] = fname.split('.');

const md = fs.readFileSync(`./markdown/${fname}`, { encoding: 'utf8' });

const toc = [];
for (const line of md.split('\n')) {
  if (line.startsWith('#')) {
    toc.push(line);
  }
}

const summary = `
> Read [original](https://tools.ietf.org/html/${name}) / [markdown](../markdown/${fname})

---

${toc.join('\n\n')}
`.trim();

fs.writeFileSync(`./summary/${fname}`, summary);
console.log(`./summary/${fname}`, 'created.');
execFile('open', [`./summary/${fname}`]);
