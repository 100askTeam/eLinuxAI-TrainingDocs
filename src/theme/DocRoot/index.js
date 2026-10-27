import React, {useMemo} from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {
  DocsSidebarProvider,
  useDocRootMetadata,
} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {useDocsVersion} from '@docusaurus/theme-common/internal';
import DocRootLayout from '@theme/DocRoot/Layout';
import NotFoundContent from '@theme/NotFound/Content';
import {SidebarNavigationContext} from '@site/src/components/SidebarNavigation';
import {resolveSidebarName} from '@site/src/utils/sidebarNavigation.mjs';

// 手机菜单在 Navbar 中渲染，不能读取这里的 DocsSidebarProvider。
// 将侧边栏名称随数据传递，同时保留原始 href 用于活动项匹配。
function withSidebarName(items, sidebarName) {
  return items?.map((item) => ({
    ...item,
    customProps: {...item.customProps, sidebarName},
    ...(item.type === 'category' && {
      items: withSidebarName(item.items, sidebarName),
    }),
  }));
}

export default function DocRoot(props) {
  const currentDocRouteMetadata = useDocRootMetadata(props);
  const location = useLocation();
  const versionMetadata = useDocsVersion();
  const isBrowser = useIsBrowser();

  // 读取 ?sidebar= 查询参数，保持用户当前板卡侧边栏上下文
  const urlParams = new URLSearchParams(location.search);
  // 静态 HTML 不含查询参数；首次 hydration 先匹配服务端，再切换板卡。
  const querySidebar = isBrowser ? urlParams.get('sidebar') : null;
  const sidebarName = resolveSidebarName(
    versionMetadata.docsSidebars,
    currentDocRouteMetadata?.sidebarName,
    querySidebar,
    location.pathname,
  );
  const sourceItems = versionMetadata.docsSidebars[sidebarName];
  const sidebarItems = useMemo(
    () => withSidebarName(sourceItems, sidebarName),
    [sourceItems, sidebarName],
  );
  const navigation = useMemo(() => ({name: sidebarName, items: sidebarItems}),
    [sidebarName, sidebarItems]);

  if (!currentDocRouteMetadata) {
    return <NotFoundContent />;
  }

  const {docElement} = currentDocRouteMetadata;

  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.page.docsDocPage)}>
      <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
        <SidebarNavigationContext.Provider value={navigation}>
          <DocRootLayout>{docElement}</DocRootLayout>
        </SidebarNavigationContext.Provider>
      </DocsSidebarProvider>
    </HtmlClassNameProvider>
  );
}
