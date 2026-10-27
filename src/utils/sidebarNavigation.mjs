export const boardSidebarNames = [
  'canmvV1Sidebar', 'canmvV2Sidebar', 'canmvV3Sidebar',
  'aimaixSidebar', 'canmvEvbSidebar',
];

function internalPath(href) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) {
    return undefined;
  }
  return decodeURI(new URL(href, 'https://docusaurus.invalid').pathname)
    .replace(/\/$/, '').toLowerCase();
}

export function sidebarContains(items, href) {
  const path = internalPath(href);
  return path !== undefined && !!items?.some((item) =>
    internalPath(item.href) === path ||
    (item.type === 'category' && sidebarContains(item.items, href)),
  );
}

export function withSidebarQuery(href, sidebarName) {
  if (!sidebarName || internalPath(href) === undefined) return href;
  const url = new URL(href, 'https://docusaurus.invalid');
  url.searchParams.set('sidebar', sidebarName);
  return url.pathname + url.search + url.hash;
}

export function resolveSidebarName(sidebars, defaultName, queryName, pathname) {
  // 不允许旧的或手工输入的参数把其他板卡的目录套到当前页面上。
  if (Object.prototype.hasOwnProperty.call(sidebars, queryName) &&
      sidebarContains(sidebars[queryName], pathname)) return queryName;
  const matches = boardSidebarNames.filter((name) =>
    sidebarContains(sidebars[name], pathname));
  if (matches.length === 1) return matches[0];
  return defaultName;
}

export function sidebarPagination(items, pathname, sidebarName) {
  const entries = [];
  const seen = new Set();
  function visit(children) {
    children?.forEach((item) => {
      const path = internalPath(item.href);
      if (path !== undefined && !seen.has(path) && !item.unlisted &&
          !item.linkUnlisted && (item.docId || item.type === 'category')) {
        seen.add(path);
        entries.push({title: item.label, permalink: withSidebarQuery(item.href, sidebarName)});
      }
      if (item.type === 'category') visit(item.items);
    });
  }
  visit(items);
  const index = entries.findIndex((entry) => internalPath(entry.permalink) === internalPath(pathname));
  return index < 0 ? null : {previous: entries[index - 1], next: entries[index + 1]};
}
