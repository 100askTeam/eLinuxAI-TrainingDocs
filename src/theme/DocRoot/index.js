import React from 'react';
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

export default function DocRoot(props) {
  const currentDocRouteMetadata = useDocRootMetadata(props);
  const location = useLocation();
  const versionMetadata = useDocsVersion();

  if (!currentDocRouteMetadata) {
    return <NotFoundContent />;
  }

  const {docElement, sidebarName: defaultSidebarName, sidebarItems: defaultSidebarItems} = currentDocRouteMetadata;

  // 读取 ?sidebar= 查询参数，保持用户当前板卡侧边栏上下文
  const urlParams = new URLSearchParams(location.search);
  const querySidebar = urlParams.get('sidebar');
  const sidebarName = querySidebar || defaultSidebarName;
  const sidebarItems = querySidebar
    ? versionMetadata.docsSidebars[querySidebar] || defaultSidebarItems
    : defaultSidebarItems;

  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.page.docsDocPage)}>
      <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
        <DocRootLayout>{docElement}</DocRootLayout>
      </DocsSidebarProvider>
    </HtmlClassNameProvider>
  );
}
