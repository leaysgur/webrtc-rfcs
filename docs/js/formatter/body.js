const listStartRe = /^(o)(\s+)/;
export function formatBody(rest) {
  const lines = [];
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
      let text = line.slice(3);

      // if list marker found
      if (listStartRe.test(text)) {
        text = text.replace(listStartRe, '*$2');
      }

      lines[lines.length - 1] += text;
    }
  }

  // trimStart()
  while (lines[0].trim().length === 0) {
    lines.shift();
  }

  return lines.join('\n\n');
}
