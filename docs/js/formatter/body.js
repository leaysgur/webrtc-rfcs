const listStartRe = /^(\s{3})(\s+)?[o*](\s+)/;
export function formatBody(rest) {
  trimArr(rest);

  const lines = [''];
  let isEscaped = false;
  for (const line of rest) {
    // start
    if (line === '```') {
      // end
      if (isEscaped) {
        isEscaped = false;
        lines[lines.length - 1] += `\n${line}`;
        continue;
      } else {
        isEscaped = true;
      }
    }

    // inside code block
    if (isEscaped) {
      lines[lines.length - 1] += `\n${line}`;
      continue;
    }

    // add new paragraph
    if (line === '') {
      lines.push('');
    }
    // almost all lines are here
    else {
      let text;
      // if list marker found
      if (listStartRe.test(line)) {
        text = line.replace(listStartRe, '$2*$3');
      } else {
        // starts with 3 spaces
        text = line.trim();
      }

      const curLine = lines[lines.length - 1];
      if (curLine.length) {
        // word continues
        if (curLine[curLine.length - 1].endsWith('-')) {
          lines[lines.length - 1] += text;
        }
        // join as sentence
        else {
          lines[lines.length - 1] += ` ${text}`;
        }
      }
      // first word of sentence
      else {
        lines[lines.length - 1] += text;
      }
    }
  }

  return lines.join('\n\n');
}

function trimArr(rest) {
  // trimStart()
  while (rest[0].trim().length === 0) {
    rest.shift();
  }
  // trimEnd()
  while (rest[rest.length - 1].trim().length === 0) {
    rest.pop();
  }
}
