import React from 'react';
import Category from '@theme-original/DocSidebarItem/Category';
import {withSidebarQuery} from '@site/src/utils/sidebarNavigation.mjs';

export default function CategoryWrapper(props) {
  // 手机端通过 item 传递名称，不读取文档区域的 Context。
  const {href, customProps} = props.item;
  return <Category {...props} {...(href && {
    href: withSidebarQuery(href, customProps?.sidebarName),
  })} />;
}
