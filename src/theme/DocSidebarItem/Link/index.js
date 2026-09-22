import React from 'react';
import Link from '@theme-original/DocSidebarItem/Link';

export default function LinkWrapper(props) {
  const sidebarName = props.item?.customProps?.sidebarName;
  const href = props.item?.href;
  // 只处理站内绝对路径；SSR 和浏览器使用相同逻辑，不依赖 window。
  if (sidebarName && href?.startsWith('/') && !href.startsWith('//')) {
    const url = new URL(href, 'https://docusaurus.invalid');
    url.searchParams.set('sidebar', sidebarName);
    // 仅覆盖导航目标，保留 item.href 供原组件计算高亮和展开状态。
    return <Link {...props} to={url.pathname + url.search + url.hash} />;
  }
  return <Link {...props} />;
}
