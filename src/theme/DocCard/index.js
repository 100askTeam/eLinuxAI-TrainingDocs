import React from 'react';
import DocCard from '@theme-original/DocCard';
import {findFirstSidebarItemLink} from '@docusaurus/theme-common/internal';
import {useSidebarHref} from '@site/src/components/SidebarNavigation';

export default function DocCardWrapper({item, ...props}) {
  const href = useSidebarHref(findFirstSidebarItemLink(item));
  return <DocCard {...props} item={{...item, href}} />;
}
