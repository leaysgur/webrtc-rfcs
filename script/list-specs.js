const fs = require('fs');

const specs = fs.readdirSync('./summary/', { encoding: 'utf8' })
  .map(fname => {
    const [name] = fname.split('.');
    return {
      name,
      originalLink: `https://tools.ietf.org/html/${name}`,
      markdownLink: `./markdown/${name}.md`,
      summaryLink: `./summary/${name}.md`,
    };
  });

const listMd = `
## Spec list
${specs.map(spec =>
  `- ${spec.name}: [original](${spec.originalLink}) / [markdown](${spec.markdownLink}) / [summary](${spec.summaryLink})`
).join('\n').trim()}
`;

const readMe = fs.readFileSync('./README.md', { encoding: 'utf8' });
const [content] = readMe.split('## Spec list');

fs.writeFileSync('./README.md', [content.trim(), listMd].join('\n'));
