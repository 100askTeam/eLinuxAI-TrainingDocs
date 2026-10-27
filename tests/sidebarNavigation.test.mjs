import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSidebarName, sidebarContains, sidebarPagination, withSidebarQuery}
  from '../src/utils/sidebarNavigation.mjs';

const doc = (href, label = href) => ({type: 'link', docId: href, href, label});
const common = doc('/CanaanK230/Userdoc');
const v2 = [common, doc('/CanaanK230/CANMV_V2download')];
const v3 = [common, doc('/CanaanK230/CANMV_V3download'), {
  type: 'category', label: '开发板上手指南', href: '/category/开发板上手指南',
  items: [doc('/CanaanK230/EdgeOS', 'EdgeOS')],
}];
const sidebars = {canmvV2Sidebar: v2, canmvV3Sidebar: v3, _sharedSidebar: [common]};

test('direct board-specific links select their board instead of the shared fallback', () => {
  assert.equal(resolveSidebarName(sidebars, '_sharedSidebar', null, '/CanaanK230/EdgeOS'), 'canmvV3Sidebar');
  assert.equal(resolveSidebarName(sidebars, '_sharedSidebar', 'canmvV2Sidebar', '/CanaanK230/EdgeOS'), 'canmvV3Sidebar');
});

test('shared docs retain an explicit valid board; invalid parameters use the fallback', () => {
  assert.equal(resolveSidebarName(sidebars, '_sharedSidebar', 'canmvV2Sidebar', common.href), 'canmvV2Sidebar');
  for (const name of [null, 'missing', '__proto__']) {
    assert.equal(resolveSidebarName(sidebars, '_sharedSidebar', name, common.href), '_sharedSidebar');
  }
});

test('category membership handles nested docs, encoded Chinese paths and trailing slashes', () => {
  assert.ok(sidebarContains(v3, '/category/%E5%BC%80%E5%8F%91%E6%9D%BF%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97/'));
  assert.ok(sidebarContains(v3, '/CanaanK230/EdgeOS?sidebar=canmvV3Sidebar#start'));
  assert.equal(sidebarContains(v2, '/CanaanK230/EdgeOS'), false);
});

test('navigation preserves query/hash and does not rewrite external or anchor links', () => {
  assert.equal(withSidebarQuery('/en/CanaanK230/Userdoc?x=1&sidebar=old#start', 'canmvV3Sidebar'),
    '/en/CanaanK230/Userdoc?x=1&sidebar=canmvV3Sidebar#start');
  for (const href of ['https://example.com/docs', '//example.com/docs', '#start', 'mailto:info@example.com']) {
    assert.equal(withSidebarQuery(href, 'canmvV3Sidebar'), href);
    assert.equal(sidebarContains(v3, href), false);
  }
});

test('pagination follows the selected board, including categories, without crossing boards', () => {
  const next = sidebarPagination(v3, common.href, 'canmvV3Sidebar').next;
  assert.equal(next.permalink, '/CanaanK230/CANMV_V3download?sidebar=canmvV3Sidebar');
  assert.ok(next.title);
  const last = sidebarPagination(v3, '/CanaanK230/EdgeOS', 'canmvV3Sidebar');
  assert.equal(last.previous.title, '开发板上手指南');
  assert.equal(last.next, undefined);
  assert.equal(sidebarPagination(v2, '/CanaanK230/EdgeOS', 'canmvV2Sidebar'), null);
});
