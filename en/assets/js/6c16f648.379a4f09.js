"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8295],{19797:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>o,frontMatter:()=>d,metadata:()=>s,toc:()=>a});var r=i(85893),l=i(11151);const d={sidebar_position:24},t="2.11 Timer \u6a21\u5757API\u624b\u518c",s={id:"CanaanK230/part5/TimerModuleAPIManual",title:"2.11 Timer \u6a21\u5757API\u624b\u518c",description:"\u524d\u8a00",source:"@site/docs/CanaanK230/part5/24_TimerModuleAPIManual.md",sourceDirName:"CanaanK230/part5",slug:"/CanaanK230/part5/TimerModuleAPIManual",permalink:"/en/CanaanK230/part5/TimerModuleAPIManual",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/docs/CanaanK230/part5/24_TimerModuleAPIManual.md",tags:[],version:"current",sidebarPosition:24,frontMatter:{sidebar_position:24},sidebar:"canaanK230Sidebar",previous:{title:"2.10 SPI \u6a21\u5757API\u624b\u518c",permalink:"/en/CanaanK230/part5/SPIModuleAPIManual"},next:{title:"2.12 WDT \u6a21\u5757API\u624b\u518c",permalink:"/en/CanaanK230/part5/WDTModuleAPIManual"}},c={},a=[{value:"\u524d\u8a00",id:"\u524d\u8a00",level:2},{value:"\u6982\u8ff0",id:"\u6982\u8ff0",level:3},{value:"\u8bfb\u8005\u5bf9\u8c61",id:"\u8bfb\u8005\u5bf9\u8c61",level:3},{value:"\u7f29\u7565\u8bcd\u5b9a\u4e49",id:"\u7f29\u7565\u8bcd\u5b9a\u4e49",level:3},{value:"\u4fee\u8ba2\u8bb0\u5f55",id:"\u4fee\u8ba2\u8bb0\u5f55",level:3},{value:"1. \u6982\u8ff0",id:"1-\u6982\u8ff0",level:2},{value:"2. API\u63cf\u8ff0",id:"2-api\u63cf\u8ff0",level:2},{value:"2.1 \u793a\u4f8b",id:"21-\u793a\u4f8b",level:3},{value:"2.2 \u6784\u9020\u51fd\u6570",id:"22-\u6784\u9020\u51fd\u6570",level:3},{value:"2.3 init",id:"23-init",level:3},{value:"2.4 deinit",id:"24-deinit",level:3}];function h(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,l.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"211-timer-\u6a21\u5757api\u624b\u518c",children:"2.11 Timer \u6a21\u5757API\u624b\u518c"}),"\n",(0,r.jsx)(n.h2,{id:"\u524d\u8a00",children:"\u524d\u8a00"}),"\n",(0,r.jsx)(n.h3,{id:"\u6982\u8ff0",children:"\u6982\u8ff0"}),"\n",(0,r.jsx)(n.p,{children:"\u672c\u6587\u6863\u4e3b\u8981\u4ecb\u7ecdmachine\u6a21\u5757\u4e0b\u7684Timer\u7c7bAPI\u3002"}),"\n",(0,r.jsx)(n.h3,{id:"\u8bfb\u8005\u5bf9\u8c61",children:"\u8bfb\u8005\u5bf9\u8c61"}),"\n",(0,r.jsx)(n.p,{children:"\u672c\u6587\u6863\uff08\u672c\u6307\u5357\uff09\u4e3b\u8981\u9002\u7528\u4e8e\u4ee5\u4e0b\u4eba\u5458\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u6280\u672f\u652f\u6301\u5de5\u7a0b\u5e08"}),"\n",(0,r.jsx)(n.li,{children:"\u8f6f\u4ef6\u5f00\u53d1\u5de5\u7a0b\u5e08"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"\u7f29\u7565\u8bcd\u5b9a\u4e49",children:"\u7f29\u7565\u8bcd\u5b9a\u4e49"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"\u7b80\u79f0"}),(0,r.jsx)(n.th,{children:"\u8bf4\u660e"})]})}),(0,r.jsx)(n.tbody,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"Timer"}),(0,r.jsx)(n.td,{children:"\u5b9a\u65f6\u5668"})]})})]}),"\n",(0,r.jsx)(n.h3,{id:"\u4fee\u8ba2\u8bb0\u5f55",children:"\u4fee\u8ba2\u8bb0\u5f55"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"\u6587\u6863\u7248\u672c\u53f7"}),(0,r.jsx)(n.th,{children:"\u4fee\u6539\u8bf4\u660e"}),(0,r.jsx)(n.th,{children:"\u4fee\u6539\u8005"}),(0,r.jsx)(n.th,{children:"\u65e5\u671f"})]})}),(0,r.jsx)(n.tbody,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"V1.0"}),(0,r.jsx)(n.td,{children:"\u521d\u7248"}),(0,r.jsx)(n.td,{children:"\u8f6f\u4ef6\u90e8"}),(0,r.jsx)(n.td,{children:"2023-09-22"})]})})]}),"\n",(0,r.jsx)(n.h2,{id:"1-\u6982\u8ff0",children:"1. \u6982\u8ff0"}),"\n",(0,r.jsx)(n.p,{children:"K230\u5185\u90e8\u5305\u542b6\u4e2aTimer\u786c\u4ef6\u6a21\u5757\uff0c\u6700\u5c0f\u5b9a\u65f6\u5468\u671f\u4e3a1us\u3002"}),"\n",(0,r.jsx)(n.h2,{id:"2-api\u63cf\u8ff0",children:"2. API\u63cf\u8ff0"}),"\n",(0,r.jsx)(n.p,{children:"Timer\u7c7b\u4f4d\u4e8emachine\u6a21\u5757\u4e0b"}),"\n",(0,r.jsx)(n.h3,{id:"21-\u793a\u4f8b",children:"2.1 \u793a\u4f8b"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"from machine import Timer\n# \u5b9e\u4f8b\u5316\u4e00\u4e2a\u8f6f\u5b9a\u65f6\u5668\ntim = Timer(-1)\ntim.init(period=100, mode=Timer.ONE_SHOT, callback=lambda t:print(1))\ntim.init(period=1000, mode=Timer.PERIODIC, callback=lambda t:print(2))\ntim.deinit()\n"})}),"\n",(0,r.jsx)(n.h3,{id:"22-\u6784\u9020\u51fd\u6570",children:"2.2 \u6784\u9020\u51fd\u6570"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"timer = Timer(index, mode=Timer.PERIODIC, freq=-1, period=-1, callback=None, arg=None)\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"index: Timer\u53f7\uff0c\u53d6\u503c:[-1,5]\uff0c-1\u4ee3\u8868\u8f6f\u4ef6\u5b9a\u65f6\u5668"}),"\n",(0,r.jsx)(n.li,{children:"mode: \u8fd0\u884c\u6a21\u5f0f\uff0c\u5355\u6b21\u6216\u5468\u671f\uff0c\u53ef\u9009\u53c2\u6570"}),"\n",(0,r.jsxs)(n.li,{children:["freq: Timer\u8fd0\u884c\u9891\u7387\uff0c\u652f\u6301\u6d6e\u70b9\uff0c\u5355\u4f4dHz\uff0c\u53ef\u9009\u53c2\u6570\uff0c\u4f18\u5148\u7ea7\u9ad8\u4e8e",(0,r.jsx)(n.code,{children:"period"})]}),"\n",(0,r.jsx)(n.li,{children:"period: Timer\u8fd0\u884c\u5468\u671f\uff0c\u5355\u4f4dms\uff0c\u53ef\u9009\u53c2\u6570"}),"\n",(0,r.jsx)(n.li,{children:"callback: \u8d85\u65f6\u56de\u8c03\u51fd\u6570\uff0c\u5fc5\u987b\u8bbe\u7f6e\uff0c\u8981\u5e26\u4e00\u4e2a\u53c2\u6570"}),"\n",(0,r.jsx)(n.li,{children:"arg: \u8d85\u65f6\u56de\u8c03\u51fd\u6570\u53c2\u6570\uff0c\u53ef\u9009\u53c2\u6570"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"\u6ce8\u610f\uff1a"})," [0-5]\u786c\u4ef6Timer\u6682\u4e0d\u53ef\u7528"]}),"\n",(0,r.jsx)(n.h3,{id:"23-init",children:"2.3 init"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"Timer.init(mode=Timer.PERIODIC, freq=-1, period=-1, callback=None, arg=None)\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u521d\u59cb\u5316\u5b9a\u65f6\u5668\u53c2\u6570"}),"\n",(0,r.jsx)(n.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"mode: \u8fd0\u884c\u6a21\u5f0f\uff0c\u5355\u6b21\u6216\u5468\u671f\uff0c\u53ef\u9009\u53c2\u6570"}),"\n",(0,r.jsxs)(n.li,{children:["freq: Timer\u8fd0\u884c\u9891\u7387\uff0c\u652f\u6301\u6d6e\u70b9\uff0c\u5355\u4f4dHz\uff0c\u53ef\u9009\u53c2\u6570\uff0c\u4f18\u5148\u7ea7\u9ad8\u4e8e",(0,r.jsx)(n.code,{children:"period"})]}),"\n",(0,r.jsx)(n.li,{children:"period: Timer\u8fd0\u884c\u5468\u671f\uff0c\u5355\u4f4dms\uff0c\u53ef\u9009\u53c2\u6570"}),"\n",(0,r.jsx)(n.li,{children:"callback: \u8d85\u65f6\u56de\u8c03\u51fd\u6570\uff0c\u5fc5\u987b\u8bbe\u7f6e\uff0c\u8981\u5e26\u4e00\u4e2a\u53c2\u6570"}),"\n",(0,r.jsx)(n.li,{children:"arg: \u8d85\u65f6\u56de\u8c03\u51fd\u6570\u53c2\u6570\uff0c\u53ef\u9009\u53c2\u6570"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,r.jsx)(n.p,{children:"\u65e0"}),"\n",(0,r.jsx)(n.h3,{id:"24-deinit",children:"2.4 deinit"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"Timer.deinit()\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u91ca\u653eTimer\u8d44\u6e90"}),"\n",(0,r.jsx)(n.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,r.jsx)(n.p,{children:"\u65e0"}),"\n",(0,r.jsx)(n.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,r.jsx)(n.p,{children:"\u65e0"})]})}function o(e={}){const{wrapper:n}={...(0,l.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}},11151:(e,n,i)=>{i.d(n,{Z:()=>s,a:()=>t});var r=i(67294);const l={},d=r.createContext(l);function t(e){const n=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),r.createElement(d.Provider,{value:n},e.children)}}}]);