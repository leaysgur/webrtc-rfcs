const listStartRe = /^(o)(\s+)/;
export function formatBody(rest) {
  // trimStart()
  while (rest[0].trim().length === 0) {
    rest.shift();
  }
  // trimEnd()
  while (rest[rest.length - 1].trim().length === 0) {
    rest.pop();
  }

  const lines = [''];
  let isEscaped = false;
  for (const line of rest) {
    // start
    if (line === '```') {
      // end
      if (isEscaped) {
        isEscaped = false;
        lines.push(line);
        continue;
      } else {
        isEscaped = true;
      }
    }

    // inside code block
    if (isEscaped) {
      lines.push(line);
      continue;
    }

    // add new paragraph
    if (line === '') {
      lines.push('');
    }
    // almost all lines are here
    else {
      // starts with 3 spaces
      let [, text] = line.split('   ');

      // if list marker found
      if (listStartRe.test(text)) {
        text = text.replace(listStartRe, '*$2');
      }

      lines[lines.length - 1] += ` ${text}`;
    }
  }

  return lines.map(l => l.trim()).join('\n\n');
}
