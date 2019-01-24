const titleRe = /\.\s+/;
export function formatTitle(head) {
  const [id, title] = head.split(titleRe);
  const lv = id.split('.').length + 1;

  return `${'#'.repeat(lv)} ${id}. ${title}`;
}
