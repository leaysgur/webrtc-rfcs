const titleSplitRe = /\.\s+/;
export function formatTitle(head) {
  const [id, title] = head.split(titleSplitRe);

  // e.g.: 1. Introduction
  if (id && title) {
    const lv = id.split('.').length + 1;
    return `${'#'.repeat(lv)} ${id}. ${title}`;
  }

  // e.g.: Abstract
  return `${'#'.repeat(2)} ${head}`;
}
