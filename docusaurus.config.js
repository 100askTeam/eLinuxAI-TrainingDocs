// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * 递归过滤侧边栏（文档 + 分类都支持）：
 * - boards: [板卡]  → 仅在指定板卡显示（包含模式）
 * - exclude_boards: [板卡] → 在指定板卡隐藏（排除模式）
 * - 无标记 → 公共，所有板卡都显示
 * 分类级别通过 _category_.json 的 customProps 配置
 */
function filterSidebarByBoard(items, board, docs) {
  return items
    .map(item => {
      if (item.type === 'category') {
        // 分类级别过滤（通过 _category_.json 的 customProps）
        const catBoards = item.customProps?.boards;
        const catExclude = item.customProps?.exclude_boards;
        if (catBoards && Array.isArray(catBoards) && catBoards.length > 0) {
          if (!catBoards.includes(board)) return null;
        }
        if (catExclude && Array.isArray(catExclude) && catExclude.length > 0) {
          if (catExclude.includes(board)) return null;
        }
        const filtered = filterSidebarByBoard(item.items, board, docs);
        if (filtered.length === 0) return null;
        return { ...item, items: filtered };
      }
      if (item.type === 'doc') {
        const doc = docs.find(d => d.id === item.id);
        if (!doc) return item;
        const boards = doc.frontMatter?.boards;
        const excludeBoards = doc.frontMatter?.exclude_boards;
        if (boards && Array.isArray(boards) && boards.length > 0) {
          if (!boards.includes(board)) return null;
        }
        if (excludeBoards && Array.isArray(excludeBoards) && excludeBoards.length > 0) {
          if (excludeBoards.includes(board)) return null;
        }
        return item;
      }
      return item;
    })
    .filter(Boolean);
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '东山Π',
  tagline: 'DshanPI Linux AI Docs.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://eai.100ask.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '100askTeam', // Usually your GitHub org/user name.
  projectName: 'eLinuxAI-TrainingDocs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      中文: {
        label: 'zh-Hans',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          sidebarPath: './sidebars.js',
          sidebarItemsGenerator: async function ({ defaultSidebarItemsGenerator, item, docs, ...rest }) {
            const items = await defaultSidebarItemsGenerator({ defaultSidebarItemsGenerator, item, docs, ...rest });
            const board = item.customProps?.board;
            if (!board) return items;
            return filterSidebarByBoard(items, board, docs);
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/',
          
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'eLinux AI开发',
        logo: {
          alt: 'DshanPI',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'elinuxaiSidebar',
            position: 'left',
            label: '嵌入式AI基础',
          },
          {
            type: 'dropdown',
            label: '嘉楠K230开发',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'canmvV1Sidebar',
                label: 'CanMV V1',
              },
              {
                type: 'docSidebar',
                sidebarId: 'canmvV2Sidebar',
                label: 'CanMV V2',
              },
              {
                type: 'docSidebar',
                sidebarId: 'canmvV3Sidebar',
                label: 'CANMV V3',
              },
              {
                type: 'docSidebar',
                sidebarId: 'aimaixSidebar',
                label: 'AIMaix',
              },
              {
                type: 'docSidebar',
                sidebarId: 'canmvEvbSidebar',
                label: 'CANMV EVB',
              },
            ],
          },
          {
            type: 'docSidebar',
            sidebarId: 'calsspartoneSidebar',
            position: 'left',
            label: '嘉楠K510开发',
          },                   
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/100askTeam/eLinuxAI-TrainingDocs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'DongshanPI',
                href: 'https://dongshanpi.com',
              },
              {
                label: 'Canaan-Docs',
                href: 'https://canaan-docs.100ask.net/',
              },
              {
                label: 'Renesas-Docs',
                href: 'https://renesas-docs.100ask.net/',
              },
              {
                label: 'RTOS',
                href: 'https://rtos.100ask.net/',
              },
              {
                label: 'TinaSDK-Docs',
                href: 'https://tina.100ask.net/',
              },
              {
                label: 'Allwinner-Docs',
                href: 'https://allwinner-docs.100ask.net/',
              },
              {
                label: 'R128-Docs',
                href: 'https://aw-r128.100ask.net/',
              },                                                                                    
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'BiliBili',
                href: 'https://space.bilibili.com/275908810',
              },              
              {
                label: 'Stack Overflow',
                href: 'https://forums.100ask.net',
              },
              {
                label: 'VideoCenter',
                href: 'https://video.100ask.net/',
              },              
              {
                label: 'Twitter',
                href: 'https://twitter.com/dongshanpi',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Coding',
                href: 'https://weidongshan.coding.net/public/',
              },              
              {
                label: 'GitHub',
                href: 'https://github.com/100askTeam',
              },
              {
                label: 'Gitee',
                href: 'https://gitee.com/weidongshan',
              },              
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 100askTeam, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
