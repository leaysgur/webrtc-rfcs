const listStartRe = /^(o)(\s+)/;
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
      // starts with 3 spaces
      let text = line.trim();

      // if list marker found
      if (listStartRe.test(text)) {
        text = text.replace(listStartRe, '*$2');
      }

      const curLine = lines[lines.length - 1];
      lines[lines.length - 1] += (curLine.length ? ` ${text}` : text);
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
