"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[7124],{54704:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>t,contentTitle:()=>d,default:()=>a,frontMatter:()=>r,metadata:()=>c,toc:()=>h});var l=s(85893),i=s(11151);const r={sidebar_position:8},d="K230 \u7f16\u7801\u5b9e\u6218 - rtsp sever\u642d\u5efa\u548c\u63a8\u6d41",c={id:"CanaanK230/part3/K230codingpracticertspserverbuildandpushstreams",title:"K230 \u7f16\u7801\u5b9e\u6218 - rtsp sever\u642d\u5efa\u548c\u63a8\u6d41",description:"1. \u73af\u5883\u51c6\u5907",source:"@site/docs/CanaanK230/part3/08_K230codingpracticertspserverbuildandpushstreams.md",sourceDirName:"CanaanK230/part3",slug:"/CanaanK230/part3/K230codingpracticertspserverbuildandpushstreams",permalink:"/en/CanaanK230/part3/K230codingpracticertspserverbuildandpushstreams",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/docs/CanaanK230/part3/08_K230codingpracticertspserverbuildandpushstreams.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"canaanK230Sidebar",previous:{title:"K230 \u56fe\u50cf\u5b9e\u6218 - \u5f00\u673a\u89c6\u9891\u548c\u5f00\u673alogo",permalink:"/en/CanaanK230/part3/K230imagepracticebootvideoandbootlogo"},next:{title:"K230 \u97f3\u9891\u5b9e\u6218 - \u97f3\u9891\u91c7\u96c6\u3001\u64ad\u653e\u548c\u7f16\u89e3\u7801",permalink:"/en/CanaanK230/part3/K230audiopracticeaudiocollectionplaybackandencoding"}},t={},h=[{value:"1. \u73af\u5883\u51c6\u5907",id:"1-\u73af\u5883\u51c6\u5907",level:2},{value:"1.1 \u786c\u4ef6\u73af\u5883",id:"11-\u786c\u4ef6\u73af\u5883",level:3},{value:"1.2 \u8f6f\u4ef6\u73af\u5883",id:"12-\u8f6f\u4ef6\u73af\u5883",level:3},{value:"1.3 \u8fd0\u884c\u51c6\u5907",id:"13-\u8fd0\u884c\u51c6\u5907",level:3},{value:"2. \u6e90\u7801\u4ecb\u7ecd",id:"2-\u6e90\u7801\u4ecb\u7ecd",level:2},{value:"2.1 \u6e90\u7801\u4f4d\u7f6e",id:"21-\u6e90\u7801\u4f4d\u7f6e",level:3},{value:"2.2 \u6e90\u7801\u4ecb\u7ecd",id:"22-\u6e90\u7801\u4ecb\u7ecd",level:3},{value:"2.2.1 \u7a0b\u5e8f\u4e3b\u8981\u6b65\u9aa4",id:"221-\u7a0b\u5e8f\u4e3b\u8981\u6b65\u9aa4",level:4},{value:"2.2.1.1 \u97f3\u89c6\u9891\u63a8\u6d41\u7a0b\u5e8f",id:"2211-\u97f3\u89c6\u9891\u63a8\u6d41\u7a0b\u5e8f",level:5},{value:"2.2.1.2 \u8bed\u97f3\u5bf9\u8bb2\u7a0b\u5e8f",id:"2212-\u8bed\u97f3\u5bf9\u8bb2\u7a0b\u5e8f",level:5},{value:"3.\u7a0b\u5e8f\u6267\u884c",id:"3\u7a0b\u5e8f\u6267\u884c",level:2},{value:"3.1 rtsp\u63a8\u97f3\u89c6\u9891\u6d41",id:"31-rtsp\u63a8\u97f3\u89c6\u9891\u6d41",level:3},{value:"3.1.1 \u53c2\u6570\u8bf4\u660e",id:"311-\u53c2\u6570\u8bf4\u660e",level:4},{value:"3.1.2 \u7f16\u8bd1\u7a0b\u5e8f",id:"312-\u7f16\u8bd1\u7a0b\u5e8f",level:4},{value:"3.1.3 \u8fd0\u884c\u7a0b\u5e8f",id:"313-\u8fd0\u884c\u7a0b\u5e8f",level:4},{value:"3.2 \u8bed\u97f3\u5bf9\u8bb2",id:"32-\u8bed\u97f3\u5bf9\u8bb2",level:3},{value:"3.2.1 \u7f16\u8bd1\u7a0b\u5e8f",id:"321-\u7f16\u8bd1\u7a0b\u5e8f",level:4},{value:"3.2.2 \u8fd0\u884c\u7a0b\u5e8f",id:"322-\u8fd0\u884c\u7a0b\u5e8f",level:4},{value:"4. \u8fd0\u884csharefs",id:"4-\u8fd0\u884csharefs",level:2}];function x(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.a)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.h1,{id:"k230-\u7f16\u7801\u5b9e\u6218---rtsp-sever\u642d\u5efa\u548c\u63a8\u6d41",children:"K230 \u7f16\u7801\u5b9e\u6218 - rtsp sever\u642d\u5efa\u548c\u63a8\u6d41"}),"\n",(0,l.jsx)(n.h2,{id:"1-\u73af\u5883\u51c6\u5907",children:"1. \u73af\u5883\u51c6\u5907"}),"\n",(0,l.jsx)(n.h3,{id:"11-\u786c\u4ef6\u73af\u5883",children:"1.1 \u786c\u4ef6\u73af\u5883"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"K230-USIP-LP3-EVB-V1.0/K230-UNSIP-LP3-EVB-V1.1"}),"\n",(0,l.jsx)(n.li,{children:"Ubuntu PC 20.04"}),"\n",(0,l.jsxs)(n.li,{children:["Typec USB\u7ebf * 2\u3002","\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"\u4e00\u6839\u8fde\u63a5\u5230UART0/3\uff0c\u7528\u4e8e\u4e32\u53e3\u6536\u53d1\uff0cUART0\u5bf9\u5e94\u5c0f\u6838\uff0cUART3\u5bf9\u5e94\u5927\u6838\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u4e00\u6839\u8fde\u63a5\u5230DC:5V\u63a5\u53e3\uff0c\u7528\u4e8e\u4f9b\u7535\u3002"}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(n.li,{children:"USB TypeC\u8f6c\u4ee5\u592a\u7f51\uff0c\u8fde\u63a5\u5230USB0\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u7f51\u7ebf\u4e00\u6839"}),"\n",(0,l.jsx)(n.li,{children:"SD\u5361(\u5982\u679c\u4f7f\u7528SD\u5361\u542f\u52a8\uff0c\u6216\u8f6f\u4ef6\u9700\u8981\u8bbf\u95eeSD\u5361)"}),"\n",(0,l.jsx)(n.li,{children:"\u6444\u50cf\u5934\u5b50\u677f\uff08IMX335\uff0c\u7528\u4e8ertsp\u63a8\u97f3\u89c6\u9891\u6d41\uff09"}),"\n",(0,l.jsx)(n.li,{children:"\u8033\u673a\uff08\u7528\u4e8e\u8bed\u97f3\u5bf9\u8bb2\uff09"}),"\n",(0,l.jsx)(n.li,{children:"\u675c\u90a6\u7ebf\u4e00\u6839\uff0c\u6309\u4e0b\u56fe\u8fde\u63a5USB0_OTG_EN\u548c\u9ad8\u7535\u5e73"}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.img,{alt:"usb_ethnet_pin",src:s(33721).Z+"",width:"554",height:"130"})}),"\n",(0,l.jsx)(n.p,{children:"\u6ce8\u610f\uff1a\u97f3\u9891\u5bf9\u8bb2\u9700\u8981\u4e24\u5957\u8bbe\u5907\u3002"}),"\n",(0,l.jsx)(n.h3,{id:"12-\u8f6f\u4ef6\u73af\u5883",children:"1.2 \u8f6f\u4ef6\u73af\u5883"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"K230 SDK"}),"\n",(0,l.jsx)(n.li,{children:"VLC\u64ad\u653e\u5668"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"13-\u8fd0\u884c\u51c6\u5907",children:"1.3 \u8fd0\u884c\u51c6\u5907"}),"\n",(0,l.jsx)(n.p,{children:"\u5728EVB\u4e0a\u6267\u884crtsp\u7a0b\u5e8f\u9700\u8981\u542f\u52a8\u7f51\u7edc\u670d\u52a1\uff0c\u5e76\u4fdd\u8bc1PC\u548cEVB\u677f\u5728\u540c\u4e00\u4e2a\u7f51\u6bb5\u3002"}),"\n",(0,l.jsx)(n.h2,{id:"2-\u6e90\u7801\u4ecb\u7ecd",children:"2. \u6e90\u7801\u4ecb\u7ecd"}),"\n",(0,l.jsx)(n.h3,{id:"21-\u6e90\u7801\u4f4d\u7f6e",children:"2.1 \u6e90\u7801\u4f4d\u7f6e"}),"\n",(0,l.jsxs)(n.p,{children:["\u5728SDK\u4e2d\u5305\u542b\u7684rtsp\u76f8\u5173demo\u4f4d\u4e8e",(0,l.jsx)(n.code,{children:"k230_sdk/src/common/cdk/user/samples"}),"\u76ee\u5f55\u4e0b\uff0c\u5176\u4e2d"]}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"rtsp_demo"}),"\uff1a\u8bed\u97f3\u63a8\u97f3\u89c6\u9891\u6d41\u7a0b\u5e8f"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"rtsp"}),"\uff1a\u8bed\u97f3\u5bf9\u8bb2\u670d\u52a1\u5668\u7aef\u7a0b\u5e8f"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"backchannel_client"}),"\uff1a\u8bed\u97f3\u5bf9\u8bb2\u5ba2\u6237\u7aef\u7a0b\u5e8f"]}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"22-\u6e90\u7801\u4ecb\u7ecd",children:"2.2 \u6e90\u7801\u4ecb\u7ecd"}),"\n",(0,l.jsx)(n.p,{children:"K230 SDK\u91c7\u7528\u53cc\u6838\u67b6\u6784\uff0c\u5c0f\u6838\u8fd0\u884clinux\u7cfb\u7edf\uff0c\u5b9e\u73b0\u7f51\u7edc\u63a7\u5236\u670d\u52a1\u3002\u5927\u6838\u8fd0\u884cRTT\u7cfb\u7edf\uff0c\u5b9e\u73b0\u5bf9\u97f3\u89c6\u9891\u786c\u4ef6\u7684\u63a7\u5236\u3002\u5c0f\u6838\u5728\u542f\u52a8\u8fc7\u7a0b\u4e2d\u8d1f\u8d23\u5f15\u5bfc\u5927\u6838\u3002\u5927\u5c0f\u6838\u901a\u8fc7\u6838\u95f4\u901a\u4fe1\u8fdb\u884c\u6d88\u606f\u901a\u4fe1\u548c\u5185\u5b58\u5171\u4eab\u3002\u591a\u5a92\u4f53\u8f6f\u4ef6\u67b6\u6784\u5982\u4e0b\uff1a"}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.img,{alt:"mpp_sturcture",src:s(86123).Z+"",width:"1280",height:"643"})}),"\n",(0,l.jsxs)(n.p,{children:["\u5c0f\u6838\u7f51\u7edc\u670d\u52a1\u79fb\u690d\u4e86live\u6e90\u7801\uff0c\u8def\u5f84\u4e3a",(0,l.jsx)(n.code,{children:"k230_sdk/src/common/cdk/user/thirdparty/live"}),"\n\u97f3\u9891\u4f7f\u7528G711\u7f16\u7801\u3002\n\u97f3\u89c6\u9891\u63a8\u6d41\u4e2d\uff0c\u89c6\u9891\u9ed8\u8ba4\u6700\u5927\u5206\u8fa8\u7387\u4e0e\u914d\u7f6e\u7684sensor_type\u76f8\u5173\uff0c\u9ed8\u8ba4\u6700\u5927\u5206\u8fa8\u7387\u4e3a1920x1080\u3002"]}),"\n",(0,l.jsx)(n.h4,{id:"221-\u7a0b\u5e8f\u4e3b\u8981\u6b65\u9aa4",children:"2.2.1 \u7a0b\u5e8f\u4e3b\u8981\u6b65\u9aa4"}),"\n",(0,l.jsx)(n.h5,{id:"2211-\u97f3\u89c6\u9891\u63a8\u6d41\u7a0b\u5e8f",children:"2.2.1.1 \u97f3\u89c6\u9891\u63a8\u6d41\u7a0b\u5e8f"}),"\n",(0,l.jsxs)(n.ol,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"new StreamingPlayer"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"\u521d\u59cb\u5316\u6838\u95f4\u901a\u4fe1\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u914d\u7f6evideo buffer\u3002"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"InitVicap"}),"\uff1a\u521d\u59cb\u5316\u6444\u50cf\u5934\u3002"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"CreateSession"}),"\uff1a","\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"\u521b\u5efaserver session\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u521b\u5efa\u5e76\u5f00\u542f\u97f3\u9891\u8f93\u5165\u901a\u9053\uff0c\u97f3\u9891\u91c7\u6837\u7387\u4e3a44.1k\uff0c\u91c7\u6837\u5bbd\u5ea616bit\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u521d\u59cb\u5316\u97f3\u9891\u7f16\u7801\uff0c\u97f3\u9891\u91c7\u7528G711A\u7f16\u7801\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u521b\u5efa\u89c6\u9891\u7f16\u7801\u901a\u9053\uff0c\u4f7f\u80fdIDR\u5e27\u3002"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"Start"}),"\uff1a","\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"\u5f00\u542f\u89c6\u9891\u7f16\u7801\u901a\u9053\u5e76\u7ed1\u5b9a\u5230vo\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u5f00\u542f\u89c6\u9891\u7f16\u7801\u901a\u9053\uff0c\u5e76\u5c06\u89c6\u9891\u8f93\u5165\u7ed1\u5b9a\u5230\u89c6\u9891\u7f16\u7801\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u5f00\u59cb\u97f3\u89c6\u9891\u63a8\u6d41\u3002"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(n.h5,{id:"2212-\u8bed\u97f3\u5bf9\u8bb2\u7a0b\u5e8f",children:"2.2.1.2 \u8bed\u97f3\u5bf9\u8bb2\u7a0b\u5e8f"}),"\n",(0,l.jsxs)(n.ol,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"Init"}),"\uff1a","\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"\u521b\u5efaserver session\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u521d\u59cb\u5316\u6838\u95f4\u901a\u4fe1\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u914d\u7f6evideo buffer\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u521b\u5efa\u5e76\u5f00\u542f\u97f3\u9891\u8f93\u5165\u901a\u9053\uff0c\u97f3\u9891\u91c7\u6837\u7387\u4e3a8k\uff0c\u91c7\u6837\u5bbd\u5ea6\u4e3a16bit\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u521b\u5efa\u97f3\u9891\u7f16\u7801\u901a\u9053\uff0c\u97f3\u9891\u91c7\u7528G711U\u7f16\u7801\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u521b\u5efa\u97f3\u9891\u8f93\u51fa\u901a\u9053\u548c\u97f3\u9891\u89e3\u7801\u901a\u9053\uff0c\u5e76\u5c06\u97f3\u9891\u89e3\u7801\u7ed1\u5b9a\u5230\u97f3\u9891\u8f93\u51fa\u3002"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"Start"}),"\uff1a","\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"\u5f00\u59cb\u63a8\u97f3\u9891\u6d41\u3002"}),"\n",(0,l.jsx)(n.li,{children:"\u5f00\u542f\u89c6\u9891\u7f16\u7801\u901a\u9053\uff0c\u5e76\u5c06\u89c6\u9891\u8f93\u5165\u7ed1\u5b9a\u5230\u89c6\u9891\u7f16\u7801\u3002"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"3\u7a0b\u5e8f\u6267\u884c",children:"3.\u7a0b\u5e8f\u6267\u884c"}),"\n",(0,l.jsx)(n.h3,{id:"31-rtsp\u63a8\u97f3\u89c6\u9891\u6d41",children:"3.1 rtsp\u63a8\u97f3\u89c6\u9891\u6d41"}),"\n",(0,l.jsx)(n.h4,{id:"311-\u53c2\u6570\u8bf4\u660e",children:"3.1.1 \u53c2\u6570\u8bf4\u660e"}),"\n",(0,l.jsxs)(n.table,{children:[(0,l.jsx)(n.thead,{children:(0,l.jsxs)(n.tr,{children:[(0,l.jsx)(n.th,{style:{textAlign:"left"},children:"\u53c2\u6570\u540d"}),(0,l.jsx)(n.th,{style:{textAlign:"left"},children:"\u63cf\u8ff0"}),(0,l.jsx)(n.th,{style:{textAlign:"left"},children:"\u53c2\u6570\u8303\u56f4"}),(0,l.jsx)(n.th,{style:{textAlign:"left"},children:"\u9ed8\u8ba4\u503c"})]})}),(0,l.jsxs)(n.tbody,{children:[(0,l.jsxs)(n.tr,{children:[(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"help"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"\u6253\u5370\u547d\u4ee4\u884c\u53c2\u6570\u4fe1\u606f"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"-"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"-"})]}),(0,l.jsxs)(n.tr,{children:[(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"n"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"session\u4e2a\u6570"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:(0,l.jsx)(n.code,{children:"[1, 3]"})}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"1"})]}),(0,l.jsxs)(n.tr,{children:[(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"t"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"\u7f16\u7801\u7c7b\u578b"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"h264\u3001h265\u3001mjpeg"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"h264"})]}),(0,l.jsxs)(n.tr,{children:[(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"w"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"\u89c6\u9891\u7f16\u7801\u5bbd\u5ea6"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:(0,l.jsx)(n.code,{children:"[128, 1920]"})}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"1280"})]}),(0,l.jsxs)(n.tr,{children:[(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"h"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"\u89c6\u9891\u7f16\u7801\u9ad8\u5ea6"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:(0,l.jsx)(n.code,{children:"[64, 1080]"})}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"720"})]}),(0,l.jsxs)(n.tr,{children:[(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"s"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"sensor\u7c7b\u578b\u3002"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"0: ov9732\uff1b1: ov9286 ir\uff1b2: ov9286 speckle\uff1b3: imx335 2LANE 1920Wx1080H\uff1b4: imx335 2LANE 2592Wx1944H\uff1b5: imx335 4LANE 2592Wx1944H\uff1b6: imx335 2LANE MCLK 7425 1920Wx1080H\uff1b7: imx335 2LANE MCLK 7425 2592Wx1944H\uff1b8: imx335 4LANE MCLK 7425 2592Wx1944H"}),(0,l.jsx)(n.td,{style:{textAlign:"left"},children:"7"})]})]})]}),"\n",(0,l.jsx)(n.h4,{id:"312-\u7f16\u8bd1\u7a0b\u5e8f",children:"3.1.2 \u7f16\u8bd1\u7a0b\u5e8f"}),"\n",(0,l.jsxs)(n.p,{children:["\u5728",(0,l.jsx)(n.code,{children:"k230_sdk"}),"\u76ee\u5f55\u4e0b\u6267\u884c",(0,l.jsx)(n.code,{children:"make cdk-user"}),"\uff0c\u5728",(0,l.jsx)(n.code,{children:"k230_sdk/src/common/cdk/user/out/little/"}),"\u76ee\u5f55\u4e0b\u751f\u6210",(0,l.jsx)(n.code,{children:"rtsp_demo"})]}),"\n",(0,l.jsxs)(n.p,{children:["\u7a0b\u5e8f\u6e90\u7801\u76ee\u5f55",(0,l.jsx)(n.code,{children:"k230_sdk/src/common/cdk/user/samples/rtsp_demo"})]}),"\n",(0,l.jsx)(n.h4,{id:"313-\u8fd0\u884c\u7a0b\u5e8f",children:"3.1.3 \u8fd0\u884c\u7a0b\u5e8f"}),"\n",(0,l.jsxs)(n.p,{children:["\u652f\u6301\u97f3\u89c6\u9891\u7801\u6d41\u540c\u65f6\u63a8\u6d41\u5230rtsp server\u4e0a\uff0c\u5176\u4e2d\u901a\u8fc7",(0,l.jsx)(n.code,{children:"mapi venc&aenc"}),"\u63a5\u53e3\u5b9e\u73b0\u5bf9\u97f3\u89c6\u9891\u7684\u7f16\u7801\uff1b\u63a8\u6d41\u4e4b\u540e\u901a\u8fc7url\u8fdb\u884c\u62c9\u53d6\uff0c\u76ee\u524d\u652f\u6301\u4e24\u8defurl\u63a8\u62c9\u6d41\u3002"]}),"\n",(0,l.jsxs)(n.ol,{children:["\n",(0,l.jsxs)(n.li,{children:["\u5728\u5927\u6838\u4e0a\u6267\u884c\uff1a",(0,l.jsx)(n.code,{children:"cd /sharefs; ./sample_sys_init.elf"})]}),"\n",(0,l.jsxs)(n.li,{children:["\u5728\u5c0f\u6838\u4e0a\u6267\u884c\uff1a",(0,l.jsx)(n.code,{children:"./rtsp_demo"})]}),"\n",(0,l.jsxs)(n.li,{children:["\u5c0f\u6838\u4e0a\u8fd0\u884crtsp_demo\u540e\uff0c\u4f1a\u6253\u5370\u51fa\u5f62\u5982\uff1a",(0,l.jsx)(n.code,{children:"rtsp://ip:8554/session0"})," \u548c ",(0,l.jsx)(n.code,{children:"rtsp://ip:8554/session01"})," \u7684url\u5730\u5740\uff0c\u53ef\u901a\u8fc7vlc\u62c9\u53d6\u5bf9\u5e94\u7684\u6d41\u8fdb\u884c\u64ad\u653e\u3002\nvlc\u62c9\u6d41\u65b9\u5f0f\uff1a\u5a92\u4f53->\u6253\u5f00\u7f51\u7edc\u4e32\u6d41->\u5728\u6253\u5f00\u7684\u7a97\u53e3\u4e2d\u8f93\u5165\u5bf9\u5e94\u7684url\u3002\n",(0,l.jsx)(n.img,{alt:"vlc",src:s(7749).Z+"",width:"545",height:"435"})]}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"32-\u8bed\u97f3\u5bf9\u8bb2",children:"3.2 \u8bed\u97f3\u5bf9\u8bb2"}),"\n",(0,l.jsx)(n.p,{children:"\u7528\u4e8e\u5b9e\u73b0\u97f3\u9891\u6570\u636e\u7684\u53cc\u5411\u4f20\u8f93\u548c\u5904\u7406\u3002\n\u8bed\u97f3\u5bf9\u8bb2\u6d89\u53ca\u5230\u4e24\u7aef\uff0c\u4e24\u7aef\u5747\u80fd\u5b9e\u65f6\u91c7\u96c6\u7f16\u7801\u53d1\u9001\u97f3\u9891\u6570\u636e\u5230\u5bf9\u7aef\uff0c\u540c\u65f6\u4e5f\u80fd\u63a5\u6536\u5bf9\u7aef\u6765\u7684\u97f3\u9891\u6570\u636e\u8fdb\u884c\u89e3\u7801\u548c\u8f93\u51fa\u3002\n\u5f53\u524d\u5b9e\u73b0\u53c2\u7167\u4e86ONVIF\uff0c\u5728rtsp\u534f\u8bae\u7684\u57fa\u7840\u4e0a\u6269\u5c55backchannel\uff0c\u4ece\u800c\u652f\u6301\u4ececlient\u5411server\u53d1\u9001\u97f3\u9891\u6570\u636e\uff1b\u4e0b\u6587\u4f7f\u7528server\u548cclient\u5206\u522b\u4ee3\u6307\u8bed\u97f3\u5bf9\u8bb2\u7684\u4e24\u7aef\u3002"}),"\n",(0,l.jsxs)(n.ol,{children:["\n",(0,l.jsx)(n.li,{children:"\u97f3\u9891\u7801\u6d41\u683c\u5f0f\u4e3aG711 mu-Law\uff1b"}),"\n",(0,l.jsx)(n.li,{children:"sever\u7aef\u5b9e\u73b0\u4e86\u5b9e\u65f6\u7684\u97f3\u9891\u91c7\u96c6\u7f16\u7801\u548c\u53d1\u9001\uff0c\u4ee5\u53ca\u901a\u8fc7backchannel\u63a5\u6536\u6765\u81eaclient\u7684\u97f3\u9891\u6570\u636e\u8fdb\u884c\u89e3\u7801\u548c\u8f93\u51fa\uff1b"}),"\n",(0,l.jsx)(n.li,{children:"client\u7aef\u5b9e\u73b0\u4e86\u97f3\u9891\u7801\u6d41\u7684\u63a5\u6536,\u89e3\u7801\u548c\u64ad\u653e\uff0c\u4ee5\u53ca\u5b9e\u65f6\u91c7\u96c6\u97f3\u9891\uff0cG711 mu-Law\u7f16\u7801\uff0c\u5e76\u901a\u8fc7backchannel\u53d1\u9001\u5230server\u7aef"}),"\n",(0,l.jsx)(n.li,{children:"\u4ec5\u652f\u6301\u4e00\u5bf9\u4e00\u7684\u5bf9\u8bb2\uff08\u4ec5\u652f\u6301\u4e00\u8defbackchannel\uff09\uff1b"}),"\n",(0,l.jsx)(n.li,{children:"\u4e0d\u652f\u6301\u56de\u58f0\u6d88\u9664\u7b49\u5904\u7406\uff08\u8bbe\u5907\u4fa7\u9700\u8981\u97f3\u9891\u8f93\u51fa\u5230\u8033\u673a\uff0c\u4e0d\u80fd\u4f7f\u7528\u5916\u653espeaker\uff09\uff1b"}),"\n"]}),"\n",(0,l.jsx)(n.h4,{id:"321-\u7f16\u8bd1\u7a0b\u5e8f",children:"3.2.1 \u7f16\u8bd1\u7a0b\u5e8f"}),"\n",(0,l.jsxs)(n.p,{children:["\u5728",(0,l.jsx)(n.code,{children:"k230_sdk"}),"\u76ee\u5f55\u4e0b\u6267\u884c",(0,l.jsx)(n.code,{children:"make cdk-user"}),"\uff0c\u5728",(0,l.jsx)(n.code,{children:"k230_sdk/src/common/cdk/user/out/little/"}),"\u76ee\u5f55\u4e0b\u751f\u6210",(0,l.jsx)(n.code,{children:"rtsp_server"}),"\u548c",(0,l.jsx)(n.code,{children:"backclient_test"})]}),"\n",(0,l.jsxs)(n.p,{children:["\u7a0b\u5e8f\u6e90\u7801\u76ee\u5f55:\n",(0,l.jsx)(n.code,{children:"k230_sdk/src/common/cdk/user/samples/rtsp_demo/rtsp_server"}),"\n",(0,l.jsx)(n.code,{children:"k230_sdk/src/common/cdk/user/samples/rtsp_demo/backchannel_client"})]}),"\n",(0,l.jsx)(n.h4,{id:"322-\u8fd0\u884c\u7a0b\u5e8f",children:"3.2.2 \u8fd0\u884c\u7a0b\u5e8f"}),"\n",(0,l.jsx)(n.p,{children:"\u4e24\u5757EVB\u8fde\u5230\u540c\u4e00\u4e2a\u7f51\u6bb5\uff0c\u4e00\u4e2a\u4f5c\u4e3aserver\uff0c\u4e00\u4e2a\u4f5c\u4e3aclient\u3002\u5927\u5c0f\u6838\u5b8c\u5168\u542f\u52a8\u540e\u3002"}),"\n",(0,l.jsx)(n.p,{children:"server\u7aef\u8fd0\u884c\u5982\u4e0b\u547d\u4ee4\uff1a"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["\u5728\u5927\u6838\u4e0a\u6267\u884c\uff1a",(0,l.jsx)(n.code,{children:"cd /sharefs; ./sample_sys_init.elf"})]}),"\n",(0,l.jsxs)(n.li,{children:["\u5728\u5c0f\u6838\u4e0a\u6267\u884c\uff1a",(0,l.jsx)(n.code,{children:"cd /mnt; ./rtsp_server"}),"\uff08\u8fd0\u884crtsp_server\u540e\uff0c\u4f1a\u6253\u5370\u51fa\u5f62\u5982\uff1a",(0,l.jsx)(n.code,{children:"rtsp://<server_ip>:8554/BackChannelTest"})," \u7684url\u5730\u5740\uff09"]}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:"client\u7aef\u8fd0\u884c\u5982\u4e0b\u547d\u4ee4\uff1a"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["\u5728\u5927\u6838\u4e0a\u6267\u884c\uff1a",(0,l.jsx)(n.code,{children:"cd /sharefs; ./sample_sys_init.elf"})]}),"\n",(0,l.jsxs)(n.li,{children:["\u5728\u5c0f\u6838\u4e0a\u6267\u884c\uff1a",(0,l.jsx)(n.code,{children:"./backclient_test rtsp://<server_ip>:8554/BackChannelTest"}),"\uff09"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"4-\u8fd0\u884csharefs",children:"4. \u8fd0\u884csharefs"}),"\n",(0,l.jsxs)(n.p,{children:["\u5927\u6838\u7684",(0,l.jsx)(n.code,{children:"sample_sys_init.elf"}),"\u9ed8\u8ba4\u6ca1\u6709\u88c5\u8f7d\u5230\u5927\u6838\u3002\u53ef\u4ee5\u901a\u8fc7\u4e0b\u9762\u4e24\u4e2d\u65b9\u5f0f\u5c06\u5176\u5728\u5927\u6838\u8fd0\u884c\u3002"]}),"\n",(0,l.jsxs)(n.ol,{children:["\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsxs)(n.p,{children:["\u4fee\u6539",(0,l.jsx)(n.code,{children:"k230_sdk/Makefile"}),"\u4e2d",(0,l.jsx)(n.code,{children:"mpp-apps"}),"\u7684\u7f16\u8bd1\u811a\u672c\uff0c\u5728",(0,l.jsx)(n.code,{children:"cd -;"}),"\u524d\u589e\u52a0\u5982\u4e0b\u547d\u4ee4\uff0c\u5e76\u5728",(0,l.jsx)(n.code,{children:"k230_sdk"}),"\u76ee\u5f55\u4e0b\u6267\u884c",(0,l.jsx)(n.code,{children:"make rt-smart;make build-image"}),"\uff0c\u751f\u6210\u7684\u955c\u50cf\u6587\u4ef6\u4e2d\uff0c\u5728\u5927\u6838\u7684",(0,l.jsx)(n.code,{children:"/bin"}),"\u76ee\u5f55\u4e0b\u5373\u5305\u542b",(0,l.jsx)(n.code,{children:"sample_sys_init.elf"})]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-sh",children:"cp userapps/sample/elf/sample_sys_init.elf $(RTSMART_SRC_DIR)/userapps/root/bin/; \\\n"})}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:"\u542f\u52a8\u5927\u5c0f\u6838\u4e4b\u540e\uff0c\u901a\u8fc7sharefs\u548ctftp\u5c06\u53ef\u6267\u884c\u7a0b\u5e8f\u4f20\u8f93\u5230EVB\u677f\u4e0a\u8fd0\u884c\u3002\n/sharefs\u7528\u4e8e\u5728\u5927\u5c0f\u6838\u4e4b\u95f4\u5171\u4eab\u6587\u4ef6\uff0c\u5927\u5c0f\u6838\u5747\u53ef\u4ee5\u901a\u8fc7\u8bbf\u95ee\u5404\u81ea\u7684/sharefs\u76ee\u5f55\u6765\u5b9e\u73b0\u5171\u4eab\u6587\u4ef6\u7cfb\u7edf\u7684\u529f\u80fd\u3002\u5927\u6838\u7684\u81ea\u8eab\u6587\u4ef6\u7cfb\u7edf\u4e3a\u53ea\u8bfb\u6a21\u5f0f\u3002\u53ef\u4ee5\u5728\u5c0f\u6838\u5c06/sharefs\u76ee\u5f55mount\u5230SD\u5361\u5206\u533a\u6216\u8005PC\u7684nfs\u76ee\u5f55\u7b49\uff0c\u5e76\u53ef\u901a\u8fc7tftp\u5b9e\u73b0\u6587\u4ef6\u4f20\u8f93\u529f\u80fd\u3002"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-sh",children:"mount /dev/mmcblk1p4 /sharefs #\u5c06/sharefs mount\u5230SD\u5361\u5206\u533a\n"})}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-sh",children:"mount -t nfs -o nolock <ipaddr>:<nfs_path> /sharefs/ #\u5c06/sharefs mount\u5230ipaddr\u7684nfs_path\u76ee\u5f55\n"})}),"\n",(0,l.jsx)(n.p,{children:"tftp\u7684\u547d\u4ee4\u5982\u4e0b\uff1a"}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-sh",children:"tftp -gr <filename> <ipaddr> #\u4eceipaddr\u7684\u4e3b\u673a\u4e0a\u5c06\u6587\u4ef6<filename>\u4f20\u8f93\u5230\u677f\u5361\u4e0a\ntftp -pl <filename> <ipaddr> #\u5c06\u6587\u4ef6<filename>\u4ece\u677f\u5361\u4f20\u8f93\u5230ipaddr\u7684\u4e3b\u673a\u4e0a\n"})}),"\n"]}),"\n"]})]})}function a(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(x,{...e})}):x(e)}},86123:(e,n,s)=>{s.d(n,{Z:()=>l});const l=s.p+"assets/images/mpp_structure-85a147652aa21ca6fa5bf57d2a313d95.png"},33721:(e,n,s)=>{s.d(n,{Z:()=>l});const l=s.p+"assets/images/usb_ethnet_pin-9313e94906938a048d2e800171d55278.png"},7749:(e,n,s)=>{s.d(n,{Z:()=>l});const l=s.p+"assets/images/vlc-58fa19a7957d6df032c7f9471ce4f1b7.png"},11151:(e,n,s)=>{s.d(n,{Z:()=>c,a:()=>d});var l=s(67294);const i={},r=l.createContext(i);function d(e){const n=l.useContext(r);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),l.createElement(r.Provider,{value:n},e.children)}}}]);