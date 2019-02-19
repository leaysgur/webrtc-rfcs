const fs = require('fs');

const specs = fs.readdirSync('./md/', { encoding: 'utf8' });

const listMd = `
## List

${specs.map(fname => `- ${fname.split('.')[0]} [[md](./md/${fname}) | [summary](./summary/${fname})]`).join('\n')}
`;

const readMe = fs.readFileSync('./README.md', { encoding: 'utf8' });
const [content] = readMe.split('## List');

fs.writeFileSync('./README.md', [content.trim(), listMd].join('\n'));
