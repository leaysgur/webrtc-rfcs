export function trimArr(rest) {
  // trimStart()
  while (rest[0].trim().length === 0) {
    rest.shift();
  }
  // trimEnd()
  while (rest[rest.length - 1].trim().length === 0) {
    rest.pop();
  }
}

export function appendLast(arr, text) {
    arr[arr.length - 1] += text;
}
