import React from 'react';
import Link from '@theme-original/DocSidebarItem/Link';
import {withSidebarQuery} from '@site/src/utils/sidebarNavigation.mjs';

export default function LinkWrapper(props) {
  const sidebarName = props.item?.customProps?.sidebarName;
  const href = props.item?.href;
  // 仅覆盖导航目标，保留 item.href 供原组件计算高亮和展开状态。
  return <Link {...props} to={withSidebarQuery(href, sidebarName)} />;
}
