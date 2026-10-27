import React from 'react';
import Link from '@docusaurus/Link';
import {useSidebarHref} from '@site/src/components/SidebarNavigation';

export default function MDXA(props) {
  const href = useSidebarHref(props.to || props.href);
  return <Link {...props} to={href} />;
}
