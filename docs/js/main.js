const [$input, $output] = document.querySelectorAll('textarea');
import { format } from './formatter/index.js';

requestAnimationFrame(render);
function render() {
  requestAnimationFrame(render);

  const src = $input.value.trim();
  $output.value = src.length ? format(src) : '';
}
