import {createContext, useContext} from 'react';
import {sidebarContains, withSidebarQuery} from '@site/src/utils/sidebarNavigation.mjs';

// MDX 也用于普通页面，因此默认值为空，不能直接调用 useDocsSidebar。
export const SidebarNavigationContext = createContext(null);

export function useSidebarHref(href) {
  const sidebar = useContext(SidebarNavigationContext);
  return sidebarContains(sidebar?.items, href)
    ? withSidebarQuery(href, sidebar.name)
    : href;
}
