import React, {useMemo} from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {
  DocsSidebarProvider,
  useDocRootMetadata,
} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import {useDocsVersion} from '@docusaurus/theme-common/internal';
import DocRootLayout from '@theme/DocRoot/Layout';
import NotFoundContent from '@theme/NotFound/Content';

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

  // 读取 ?sidebar= 查询参数，保持用户当前板卡侧边栏上下文
  const urlParams = new URLSearchParams(location.search);
  const querySidebar = urlParams.get('sidebar');
  const hasQuerySidebar = querySidebar &&
    Object.prototype.hasOwnProperty.call(versionMetadata.docsSidebars, querySidebar);
  const sidebarName = hasQuerySidebar
    ? querySidebar
    : currentDocRouteMetadata?.sidebarName;
  const sourceItems = hasQuerySidebar
    ? versionMetadata.docsSidebars[querySidebar]
    : currentDocRouteMetadata?.sidebarItems;
  const sidebarItems = useMemo(
    () => withSidebarName(sourceItems, sidebarName),
    [sourceItems, sidebarName],
  );

  if (!currentDocRouteMetadata) {
    return <NotFoundContent />;
  }

  const {docElement} = currentDocRouteMetadata;

  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.page.docsDocPage)}>
      <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
        <DocRootLayout>{docElement}</DocRootLayout>
      </DocsSidebarProvider>
    </HtmlClassNameProvider>
  );
}
