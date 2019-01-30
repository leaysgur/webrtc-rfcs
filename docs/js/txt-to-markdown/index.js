import { formatTitle } from './title.js';
import { trimArr, appendLast } from './utils.js';

const listStartRe = /^(\s{3})(\s+)?[+o*](\s+)/;
export function txtToMarkdown(text) {
  const texts = text.split('\n');
  trimArr(texts);

  const lines = [''];
  let isEscaped = false;
  for (const line of texts) {
    // start escape block
    if (line.startsWith('```')) {
      // end
      if (isEscaped) {
        isEscaped = false;
        appendLast(lines, `\n${line}`);
        continue;
      } else {
        isEscaped = true;
      }
    }
    // inside code block
    if (isEscaped) {
      appendLast(lines, `\n${line}`);
      continue;
    }

    // add new paragraph
    if (line === '') {
      lines.push('');
    }
    // almost all lines are here
    else {
      // section header
      if (!line.startsWith('   ')) {
        // remove empty paragraph
        lines.length && lines.pop();
        lines.push(formatTitle(line));
        continue;
      }

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
        // last word continues
        if (curLine[curLine.length - 1].endsWith('-')) {
          appendLast(lines, text);
        }
        // join as sentence
        else {
          appendLast(lines, ` ${text}`);
        }
      }
      // first word of sentence
      else {
        appendLast(lines, text);
      }
    }
  }

  trimArr(lines);
  return lines.join('\n\n');
}
