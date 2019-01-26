import { txtToMarkdown } from './txt-to-markdown/index.js';

(function main() {
  const [$input, $output] = document.querySelectorAll('textarea');

  // auto select to copy
  $output.onclick = ev => ev.target.select();

  // requestAnimationFrame(render);
  (function render() {
    requestAnimationFrame(render);

    const src = $input.value.trim();
    $output.value = src.length ? txtToMarkdown(src) : '';

    syncScrollPos($input, $output);
  }());
}());

function syncScrollPos(el1, el2) {
  const pos = el1.scrollTop / el1.scrollHeight;
  el2.scrollTop = el2.scrollHeight * pos;
}

