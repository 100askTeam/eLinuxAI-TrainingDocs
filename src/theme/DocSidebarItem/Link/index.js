import React from 'react';
import Link from '@theme-original/DocSidebarItem/Link';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';

export default function LinkWrapper(props) {
  const sidebar = useDocsSidebar();
  const sidebarName = sidebar?.name;
  // 修改 href，附加 sidebar 参数保持当前侧边栏上下文
  const modifiedProps = {...props};
  if (sidebarName && props.item?.href) {
    try {
      const url = new URL(props.item.href, window.location.origin);
      url.searchParams.set('sidebar', sidebarName);
      modifiedProps.item = {...props.item, href: url.pathname + url.search};
    } catch (e) {
      // 非标准 URL 保持原样
    }
  }
  return (
    <>
      <Link {...modifiedProps} />
    </>
  );
}
