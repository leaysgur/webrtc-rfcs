import { formatTitle } from './title.js';
import { formatBody } from './body.js';

export function format(text) {
  const [head, ...rest] = text.split('\n');

  const title = formatTitle(head);
  const body = formatBody(rest);

  return `${title}\n\n${body}`;
}
