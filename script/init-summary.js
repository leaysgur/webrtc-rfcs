const fs = require('fs');

const [,, targetPath] = process.argv;
const fileName = targetPath.split('/').pop();

const md = fs.readFileSync(`./md/${fileName}`, { encoding: 'utf8' });

const toc = [];
for (const line of md.split('\n')) {
  if (line.startsWith('#')) {
    toc.push(line);
  }
}

fs.writeFileSync(`./summary/${fileName}`, toc.join('\n\n'));
