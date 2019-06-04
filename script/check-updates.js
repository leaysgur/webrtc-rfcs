const { exec } = require('child_process');
const { readdir } = require('fs');

(async function() {
  const currentDrafts = await readCurrentDrafts().catch(console.error);
  const nextDraftUrls = currentDrafts.map(({ id, ver }) => {
    const nextVer = String(ver + 1).padStart(2, '0');
    return `https://tools.ietf.org/html/${id}-${nextVer}`;
  });

  const numOfDratfs = nextDraftUrls.length;
  console.log(`checking new version for ${numOfDratfs} drafts...`);
  console.log('');

  const found = [];
  await Promise.all(nextDraftUrls.map(url => {
    console.log('fetch', url);
    return fetchStatusCode(url).then(statusCode => {
      if (statusCode === 200) {
        found.push(url);
      }
    });
  })).catch(console.error);

  console.log('');
  if (found.length === 0) {
    console.log('All drafts are still fresh! ;D');
    return;
  }

  console.log(`${found.length} updated drafts were found!`);
  for (const url of found) {
    console.log(url);
  }
}());


function readCurrentDrafts() {
  return new Promise((resolve, reject) => {
    readdir('./markdown', (err, items) => {
      if (err) {
        reject(err);
      }

      const drafts = items.filter(fName => fName.startsWith('draft'))
        .map(fName => {
          const [id] = fName.split('.md');
          const frags = id.split('-');
          const ver = frags.pop();
          return { id: frags.join('-'), ver: parseInt(ver) };
        });

      resolve(drafts);
    });
  });
}

function fetchStatusCode(url) {
  return new Promise((resolve, reject) => {
    exec([
      'curl',
      '-s',
      url,
      '-o /dev/null',
      '-w \'%{http_code}\'',
    ].join(' '), (err, stdout, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
      }
      resolve(parseInt(stdout.toString()));
    });
  });
}
