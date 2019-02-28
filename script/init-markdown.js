const fs = require('fs');

const [,, name] = process.argv;

const md = `
> Read [original](https://tools.ietf.org/html/${name}) / [summary](../summary/${name}.md)

---

# Xxx
`.trim();

fs.writeFileSync(`./markdown/${name}.md`, md);
console.log(`./markdown/${name}.md`, 'created.');
