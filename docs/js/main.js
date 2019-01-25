import { format } from './formatter/index.js';

(function main() {
  const [$input, $output] = document.querySelectorAll('textarea');

  // auto select to copy
  $output.onclick = ev => ev.target.select();

  // requestAnimationFrame(render);
  (function render() {
    requestAnimationFrame(render);

    const src = $input.value.trim();
    $output.value = src.length ? format(src) : '';
  }());
}());
