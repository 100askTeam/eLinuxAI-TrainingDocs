"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[9263],{77544:(t,n,e)=>{e.r(n),e.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>a});var r=e(85893),s=e(11151);const i={sidebar_position:7},d="7. \u5f00\u53d1\u5de5\u5177\u7b80\u4ecb",o={id:"CanaanK230/part4/Introductiontodevelopmenttools",title:"7. \u5f00\u53d1\u5de5\u5177\u7b80\u4ecb",description:"\u6211\u4eec\u4e3a\u5728k230\u4e0a\u5b9e\u73b0AI\u5f00\u53d1\u63d0\u4f9b\u4e86\u4e30\u5bcc\u7684\u5de5\u5177\uff0c\u5305\u62ecAI Cube\u3001\u5728\u7ebf\u8bad\u7ec3\u5e73\u53f0\u3001k230trainingscripts(KTS)\u7b49\u3002\u60a8\u53ef\u4ee5\u6839\u636e\u60a8\u7684\u4e2a\u4eba\u60c5\u51b5\u9009\u62e9\u5408\u9002\u7684\u5de5\u5177\u8fdb\u884c\u5f00\u53d1\u3002",source:"@site/docs/CanaanK230/part4/07-Introductiontodevelopmenttools.md",sourceDirName:"CanaanK230/part4",slug:"/CanaanK230/part4/Introductiontodevelopmenttools",permalink:"/CanaanK230/part4/Introductiontodevelopmenttools",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/docs/CanaanK230/part4/07-Introductiontodevelopmenttools.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"canaanK230Sidebar",previous:{title:"6.\u6df1\u5165\u89e3\u6790AI\u5f00\u53d1\u6d41\u7a0b",permalink:"/CanaanK230/part4/In-depthanalysisoftheAIdevelopmentprocess"},next:{title:"8. \u4f7f\u7528\u5728\u7ebf\u4e91\u8bad\u7ec3\u5e73\u53f0\u5f00\u53d1",permalink:"/CanaanK230/part4/Developedusinganonlinecloudtrainingplatform"}},c={},a=[];function l(t){const n={h1:"h1",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.a)(),...t.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"7-\u5f00\u53d1\u5de5\u5177\u7b80\u4ecb",children:"7. \u5f00\u53d1\u5de5\u5177\u7b80\u4ecb"}),"\n",(0,r.jsx)(n.p,{children:"\u6211\u4eec\u4e3a\u5728k230\u4e0a\u5b9e\u73b0AI\u5f00\u53d1\u63d0\u4f9b\u4e86\u4e30\u5bcc\u7684\u5de5\u5177\uff0c\u5305\u62ecAI Cube\u3001\u5728\u7ebf\u8bad\u7ec3\u5e73\u53f0\u3001k230_training_scripts(KTS)\u7b49\u3002\u60a8\u53ef\u4ee5\u6839\u636e\u60a8\u7684\u4e2a\u4eba\u60c5\u51b5\u9009\u62e9\u5408\u9002\u7684\u5de5\u5177\u8fdb\u884c\u5f00\u53d1\u3002"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"\u5de5\u5177"}),(0,r.jsx)(n.th,{children:"\u4f18\u70b9"}),(0,r.jsx)(n.th,{children:"\u7f3a\u70b9"}),(0,r.jsx)(n.th,{children:"\u9002\u914d\u7528\u6237/\u573a\u666f"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"\u5728\u7ebf\u8bad\u7ec3\u5e73\u53f0"}),(0,r.jsx)(n.td,{children:"1.\u8bad\u7ec3\u6570\u636e\u96c6\u4e91\u7aef\u5b58\u50a8\uff0c\u63d0\u4f9b\u5b58\u50a8\u8d44\u6e90\u548c\u8ba1\u7b97\u8d44\u6e90\uff1b 2.\u652f\u6301\u5728\u7ebf\u6807\u6ce8\u529f\u80fd\uff0c\u53ef\u4ee5\u5b8c\u6210\u5bfc\u5165\u6570\u636e\uff0c\u6807\u6ce8\u8bad\u7ec3\uff1b 3.\u652f\u6301\u6570\u636e\u96c6\u53ef\u89c6\u5316\u3001\u6a21\u578b\u8bad\u7ec3\u3001\u6d4b\u8bd5\u3001\u90e8\u7f72\u5305\u751f\u6210\u7b49\u529f\u80fd\uff1b 4.\u90e8\u7f72\u5305\u63d0\u4f9b\u53ef\u76f4\u63a5\u4e0a\u677f\u8fd0\u884c\u7684\u53ef\u6267\u884c\u6587\u4ef6\uff0c\u540c\u65f6\u63d0\u4f9bC++\u548cMicroPython\u90e8\u7f72\u6e90\u7801\uff0c\u4efb\u52a1\u5b8c\u6210\u540e\u90e8\u7f72\u5305\u53d1\u9001\u5230\u6ce8\u518c\u90ae\u7bb1\uff1b"}),(0,r.jsx)(n.td,{children:"1.\u4efb\u52a1\u7c7b\u578b\u4ec5\u652f\u6301\u56fe\u50cf\u5206\u7c7b\u548c\u76ee\u6807\u68c0\u6d4b\uff1b 2.\u6570\u636e\u5b89\u5168\u6027\u4e0d\u654f\u611f\uff1b"}),(0,r.jsx)(n.td,{children:"\u9002\u7528\u4e8e\u4e0d\u5177\u5907\u8ba1\u7b97\u8d44\u6e90\u3001\u6570\u636e\u96c6\u65e0\u5b89\u5168\u6027\u8981\u6c42\u3001\u4e86\u89e3\u5d4c\u5165\u5f0f\u5f00\u53d1\u7684\u7528\u6237\uff1b"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"AI Cube"}),(0,r.jsx)(n.td,{children:"1.\u8bad\u7ec3\u6570\u636e\u672c\u5730\u5b58\u50a8\uff0c\u6570\u636e\u5b89\u5168\u53ef\u63a7\uff1b 2.\u652f\u6301\u4efb\u52a1\u4e30\u5bcc\uff0c\u652f\u6301\u56fe\u50cf\u5206\u7c7b\u3001\u76ee\u6807\u68c0\u6d4b\u3001\u8bed\u4e49\u5206\u5272\u3001OCR\u68c0\u6d4b\u3001OCR\u8bc6\u522b\u3001\u5ea6\u91cf\u5b66\u4e60\u3001\u591a\u6807\u7b7e\u5206\u7c7b\u3001\u5f02\u5e38\u68c0\u6d4b\u51718\u7c7b\u4efb\u52a1\uff1b 3.\u81ea\u4e3b\u529f\u80fd\u4e30\u5bcc\uff0c\u9664\u652f\u6301\u6a21\u578b\u8bad\u7ec3\u3001\u6a21\u578b\u6d4b\u8bd5\u3001\u90e8\u7f72\u5305\u751f\u6210\u7b49\u57fa\u7840\u529f\u80fd\uff0c\u8fd8\u652f\u6301\u5305\u62ec\u6570\u636e\u53ef\u89c6\u5316\u62c6\u5206\u3001\u6570\u636e\u96c6\u67e5\u770b\u3001\u8bad\u7ec3\u53c2\u6570\u81ea\u4e3b\u914d\u7f6e\u3001\u6570\u636e\u589e\u5f3a\u53ef\u89c6\u5316\u3001\u72ec\u7acb\u6570\u636e\u6d4b\u8bd5\u7b49\u7ec6\u5316\u529f\u80fd\uff1b 4.\u90e8\u7f72\u5305\u63d0\u4f9b\u53ef\u76f4\u63a5\u4e0a\u677f\u8fd0\u884c\u7684\u53ef\u6267\u884c\u6587\u4ef6\uff0c\u540c\u65f6\u63d0\u4f9bC++\u548cMicroPython\u90e8\u7f72\u6e90\u7801\uff1b 5.\u652f\u6301ubuntu\u548cwindows\u53cc\u5e73\u53f0\u5e94\u7528\uff1b"}),(0,r.jsx)(n.td,{children:"1.\u7528\u6237\u9700\u81ea\u884c\u914d\u7f6e\u8ba1\u7b97\u8d44\u6e90\uff1b 2.\u56e0\u5305\u542b\u591a\u7c7b\u4efb\u52a1\u8bad\u7ec3\u73af\u5883\uff0c\u5b89\u88c5\u5305\u8f83\u5927\uff1b"}),(0,r.jsx)(n.td,{children:"\u9002\u7528\u4e8e\u5177\u5907\u8ba1\u7b97\u8d44\u6e90\uff0c\u4e86\u89e3\u5d4c\u5165\u5f0f\u5f00\u53d1\uff0c\u6709\u6570\u636e\u5b89\u5168\u6027\u8981\u6c42\u7684\u7528\u6237\uff1b"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"k230_training_scripts(KTS)"}),(0,r.jsx)(n.td,{children:"1.\u63d0\u4f9bcv\u3001nlp\u3001\u8bed\u97f3\u7b49\u4e0d\u540c\u6a21\u6001\u4efb\u52a1\u7684k230 AI \u5f00\u53d1\u793a\u4f8b\uff1b 2.\u652f\u6301\u5b9e\u73b0\u7aef\u5230\u7aef\u7684\u5168\u6d41\u7a0b\u6559\u5b66\uff0c\u5b9e\u73b0\u5305\u62ec\u73af\u5883\u642d\u5efa\u3001\u6a21\u578b\u8bad\u7ec3\u3001\u6a21\u578b\u6d4b\u8bd5\u3001\u6a21\u578b\u8f6c\u6362\u3001\u955c\u50cf\u7f16\u8bd1\u3001\u4e0a\u677f\u8c03\u8bd5\u7b49\u8be6\u7ec6\u6b65\u9aa4\uff1b 3.\u5404\u6b65\u9aa4\u7075\u6d3b\u53ef\u63a7\uff0c\u7528\u6237\u53ef\u4ee5\u9009\u62e9\u6839\u636e\u81ea\u5df1\u7684\u9700\u6c42\u66ff\u6362\u6a21\u578b\u3001\u8c03\u53c2\u7b49\uff0c\u4e5f\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u5176\u4ed6\u9884\u8bad\u7ec3\u6a21\u578b\u81ea\u884c\u914d\u7f6e\u6821\u6b63\u96c6\u8fdb\u884c\u6a21\u578b\u8f6c\u6362\uff0c\u53ef\u4ee5\u4fee\u6539\u4e0a\u677f\u7684C++\u4ee3\u7801\u5b9e\u73b0\u4efb\u52a1\u9002\u914d\uff1b"}),(0,r.jsx)(n.td,{children:"1.\u4ee3\u7801\u6027\u8f83\u5f3a\uff0c\u7528\u6237\u9700\u8981\u6709\u8f83\u5f3a\u7684\u52a8\u624b\u80fd\u529b\uff1b 2.\u8d44\u6e90\u8981\u6c42\u9ad8\uff0c\u9700\u8981\u6709\u5bf9\u5e94\u7684\u670d\u52a1\u5668\u8d44\u6e90\u6216\u8005\u4e2a\u4eba\u8ba1\u7b97\u8d44\u6e90\uff1b"}),(0,r.jsx)(n.td,{children:"\u9002\u7528\u4e8e\u6570\u636e\u5b89\u5168\u6027\u9ad8\uff0c\u559c\u6b22\u52a8\u624b\u5f00\u53d1\uff0c\u8c03\u8bd5\u6e90\u7801\uff0c\u5e76\u5177\u5907\u4e00\u5b9a\u7684\u670d\u52a1\u5668\u8d44\u6e90\u548c\u8ba1\u7b97\u8d44\u6e90\u7684\u7528\u6237\uff1b"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"CanCollectorPlus"}),(0,r.jsx)(n.td,{children:"1. \u4f5c\u4e3a\u4e0a\u8ff0\u4e09\u4e2a\u5de5\u5177\u7684\u8865\u5145\uff0c\u83b7\u5f97k230\u91c7\u96c6\u7684\u6570\u636e\u96c6\uff1b 2. \u91c7\u96c6\u7684\u6570\u636e\u4f5c\u4e3a\u8bad\u7ec3\u6570\u636e\uff0c\u548c\u90e8\u7f72\u65f6\u5f00\u53d1\u677f\u91c7\u96c6\u7684\u6570\u636e\u4fdd\u6301\u5206\u5e03\u4e00\u81f4\uff0c\u51cf\u5c0f\u989c\u8272\u3001\u5149\u7167\u3001\u89c6\u89d2\u3001\u5206\u8fa8\u7387\u7b49\u5b58\u5728\u5dee\u5f02\u3002"}),(0,r.jsx)(n.td,{children:"1. \u9700\u8981\u7528\u6237\u81ea\u884c\u5b8c\u6210\u6807\u6ce8\uff1b"}),(0,r.jsx)(n.td,{children:"\u9002\u7528\u4e8e\u4f7f\u7528\u516c\u5f00\u6570\u636e\u96c6\u8bad\u7ec3\u7684\u6a21\u578b\u5728k230\u5f00\u53d1\u677f\u4e0a\u90e8\u7f72\u6548\u679c\u5dee\u5f02\u8f83\u5927\u7684\u573a\u666f\uff1b"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"K230-Canmv Micropython\u5f00\u53d1\u52a9\u624b"}),(0,r.jsx)(n.td,{children:"1.\u80fd\u591f\u8f85\u52a9\u7528\u6237\u5f00\u53d1\uff0c\u7528\u6237\u5728\u5f00\u53d1\u8fc7\u7a0b\u4e2d\u9047\u5230\u964c\u751f\u6982\u5ff5\u548c\u590d\u6742\u4ee3\u7801\u65f6\u53ef\u4ee5\u4e00\u952e\u67e5\u8be2\uff0c\u80fd\u591f\u964d\u4f4e\u7528\u6237\u5f00\u53d1\u95e8\u69db\uff0c\u63d0\u9ad8\u7528\u6237\u5f00\u53d1\u6548\u7387\uff1b 2.\u80fd\u591f\u5e2e\u52a9\u7528\u6237\u68b3\u7406AI Demo\u3001\u5916\u8bbe\u3001\u591a\u5a92\u4f53\u7b49\u793a\u4f8b\u4ee3\u7801\uff0c\u5e2e\u52a9\u7528\u6237\u5feb\u901f\u4e86\u89e3\u793a\u4f8b\u7a0b\u5e8f\u903b\u8f91\u7ed3\u6784\uff1b 3.\u80fd\u591f\u4e3a\u7528\u6237\u63d0\u4f9bAI\u5e94\u7528\u7c7b\u6838\u5fc3\u4ee3\u7801\u6846\u67b6\uff0c\u65b9\u4fbf\u7528\u6237\u5f00\u53d1\u65b0\u7684AI\u5e94\u7528\uff1b 4.\u80fd\u591f\u6839\u636e\u7528\u6237\u9700\u6c42\u7ec4\u7ec7\u751f\u6210\u65b0\u7684micropython\u4ee3\u7801\uff0c\u53ef\u4ee5\u8fc5\u901f\u4e3a\u7528\u6237\u63d0\u4f9b\u5f00\u53d1\u601d\u8def\uff1b"}),(0,r.jsx)(n.td,{children:"1.\u9700\u8981\u80fd\u591f\u8bbf\u95eeGPTs\u5546\u5e97 ; 2.\u673a\u5668\u4eba\u5185\u7f6e\u77e5\u8bc6\u5e93\u53ef\u80fd\u4f1a\u4e0e\u7528\u6237\u624b\u4e2d\u4f7f\u7528\u7684sdk\u7248\u672c\u4e0d\u4e00\u81f4\uff1b 3.\u673a\u5668\u4eba\u751f\u6210\u7684\u4ee3\u7801\u6709\u65f6\u5728\u7ec6\u8282\u90e8\u5206\u5b58\u5728\u7455\u75b5\uff0c\u9700\u8981\u7528\u6237\u4f7f\u7528\u65f6\u8fdb\u884c\u7504\u522b;"}),(0,r.jsx)(n.td,{children:"\u9002\u7528\u4e8e\u5bf9K230\u6216\u5d4c\u5165\u5f0f\u5f00\u53d1\u7f3a\u5c11\u7ecf\u9a8c\uff0c\u4f46\u540c\u65f6\u9700\u8981\u5feb\u901f\u5f00\u53d1\u4e0a\u624b\u7684\u7528\u6237"})]})]})]})]})}function h(t={}){const{wrapper:n}={...(0,s.a)(),...t.components};return n?(0,r.jsx)(n,{...t,children:(0,r.jsx)(l,{...t})}):l(t)}},11151:(t,n,e)=>{e.d(n,{Z:()=>o,a:()=>d});var r=e(67294);const s={},i=r.createContext(s);function d(t){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof t?t(n):{...n,...t}}),[n,t])}function o(t){let n;return n=t.disableParentContext?"function"==typeof t.components?t.components(s):t.components||s:d(t.components),r.createElement(i.Provider,{value:n},t.children)}}}]);