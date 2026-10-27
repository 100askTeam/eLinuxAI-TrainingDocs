import React, {useContext} from 'react';
import DocPaginator from '@theme-original/DocPaginator';
import {useLocation} from '@docusaurus/router';
import {SidebarNavigationContext} from '@site/src/components/SidebarNavigation';
import {boardSidebarNames, sidebarPagination} from '@site/src/utils/sidebarNavigation.mjs';

export default function DocPaginatorWrapper(props) {
  const sidebar = useContext(SidebarNavigationContext);
  const {pathname} = useLocation();
  // 构建时的 previous/next 属于默认目录；板卡模式需按筛选后的目录重算。
  const pagination = boardSidebarNames.includes(sidebar?.name)
    ? sidebarPagination(sidebar.items, pathname, sidebar.name)
    : null;
  return <DocPaginator {...props} {...pagination} />;
}
