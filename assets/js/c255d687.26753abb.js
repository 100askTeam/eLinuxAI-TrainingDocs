"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[2928],{65003:(n,e,i)=>{i.r(e),i.d(e,{assets:()=>c,contentTitle:()=>l,default:()=>t,frontMatter:()=>r,metadata:()=>h,toc:()=>x});var d=i(85893),s=i(11151);const r={sidebar_position:2},l="K230\u7cfb\u7edf\u63a7\u5236MAPI\u53c2\u8003",h={id:"CanaanK230/part7/K230ThesystemcontrolstheMAPIreference",title:"K230\u7cfb\u7edf\u63a7\u5236MAPI\u53c2\u8003",description:"1. \u6982\u8ff0",source:"@site/docs/CanaanK230/part7/02_K230ThesystemcontrolstheMAPIreference.md",sourceDirName:"CanaanK230/part7",slug:"/CanaanK230/part7/K230ThesystemcontrolstheMAPIreference",permalink:"/CanaanK230/part7/K230ThesystemcontrolstheMAPIreference",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/docs/CanaanK230/part7/02_K230ThesystemcontrolstheMAPIreference.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"canaanK230Sidebar",previous:{title:"K230\u6838\u95f4\u901a\u8bafAPI\u53c2\u8003",permalink:"/CanaanK230/part7/K230Inter-corecommunicationAPIreference"},next:{title:"K230 \u4e2d\u95f4\u4ef6API\u53c2\u8003",permalink:"/CanaanK230/part7/K230MultimediaMiddlewareAPIReference"}},c={},x=[{value:"1. \u6982\u8ff0",id:"1-\u6982\u8ff0",level:2},{value:"1.1 \u6982\u8ff0",id:"11-\u6982\u8ff0",level:3},{value:"1.2 \u529f\u80fd\u63cf\u8ff0",id:"12-\u529f\u80fd\u63cf\u8ff0",level:3},{value:"2. API\u53c2\u8003",id:"2-api\u53c2\u8003",level:2},{value:"2.1 kd_mapi_sys_init",id:"21-kd_mapi_sys_init",level:3},{value:"2.2 kd_mapi_sys_deinit",id:"22-kd_mapi_sys_deinit",level:3},{value:"2.3 kd_mapi_media_init",id:"23-kd_mapi_media_init",level:3},{value:"2.4 kd_mapi_media_deinit",id:"24-kd_mapi_media_deinit",level:3},{value:"2.5 kd_mapi_alloc_buffer",id:"25-kd_mapi_alloc_buffer",level:3},{value:"2.6 kd_mapi_free_buffer",id:"26-kd_mapi_free_buffer",level:3},{value:"2.7 kd_mapi_sys_get_vb_block",id:"27-kd_mapi_sys_get_vb_block",level:3},{value:"2.8 kd_mapi_sys_release_vb_block",id:"28-kd_mapi_sys_release_vb_block",level:3},{value:"3. \u6570\u636e\u7c7b\u578b",id:"3-\u6570\u636e\u7c7b\u578b",level:2},{value:"3.1 k_mapi_mod_id_e",id:"31-k_mapi_mod_id_e",level:3},{value:"3.2 k_mapi_media_config_t",id:"32-k_mapi_media_config_t",level:3},{value:"3.3 k_mapi_media_attr_t",id:"33-k_mapi_media_attr_t",level:3},{value:"4. \u9519\u8bef\u7801",id:"4-\u9519\u8bef\u7801",level:2}];function j(n){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.a)(),...n.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(e.h1,{id:"k230\u7cfb\u7edf\u63a7\u5236mapi\u53c2\u8003",children:"K230\u7cfb\u7edf\u63a7\u5236MAPI\u53c2\u8003"}),"\n",(0,d.jsx)(e.h2,{id:"1-\u6982\u8ff0",children:"1. \u6982\u8ff0"}),"\n",(0,d.jsx)(e.h3,{id:"11-\u6982\u8ff0",children:"1.1 \u6982\u8ff0"}),"\n",(0,d.jsx)(e.p,{children:"\u7cfb\u7edf\u63a7\u5236\u6839\u636e k230\u82af\u7247\u7279\u6027\uff0c\u5b8c\u6210\u786c\u4ef6\u5404\u4e2a\u90e8\u4ef6\u7684\u590d\u4f4d\u3001\u57fa\u672c\u521d\u59cb\u5316\u5de5\u4f5c\uff0c\u540c\u65f6\u8d1f\u8d23\u5b8c\u6210 MPP\uff08Media Process Platform \u5a92\u4f53\u5904\u7406\u5e73\u53f0\uff09\u7cfb\u7edf\u6838\u95f4\u901a\u8baf\u5efa\u7acb\uff0c\u591a\u5a92\u4f53\u5185\u5b58\u7ba1\u7406\u7b49\u6a21\u5757\u7684\u521d\u59cb\u5316\u3001\u53bb\u521d\u59cb\u5316\u3002"}),"\n",(0,d.jsx)(e.h3,{id:"12-\u529f\u80fd\u63cf\u8ff0",children:"1.2 \u529f\u80fd\u63cf\u8ff0"}),"\n",(0,d.jsx)(e.p,{children:"MAPI\u7684\u7279\u6027\u662f\u8de8OS\u8c03\u7528\uff0c\u5728K230\u7684\u5927\u5c0f\u6838\u4e0a\u5747\u53ef\u4ee5\u8c03\u7528\u76f8\u540c\u7684API\u6765\u5b9e\u73b0\u9700\u8981\u7684\u529f\u80fd\u3002\u6574\u4f53\u7684\u7cfb\u7edf\u67b6\u6784\u5982\u4e0b\u56fe\u6240\u793a"}),"\n",(0,d.jsx)(e.p,{children:"\u5173\u4e8eMAPI\u4e2d\u6d89\u53ca\u7ed1\u5b9a\u4ee5\u53ca\u5185\u5b58\u7ba1\u7406\u7684\u5177\u4f53\u5185\u5bb9\u8bf7\u53c2\u8003\u6587\u6863\u300aK230 \u7cfb\u7edf\u63a7\u5236 API\u53c2\u8003 V1.0\u300b\u4e2d\u7684\u76f8\u5173\u5185\u5bb9"}),"\n",(0,d.jsx)(e.h2,{id:"2-api\u53c2\u8003",children:"2. API\u53c2\u8003"}),"\n",(0,d.jsx)(e.p,{children:"\u8be5\u529f\u80fd\u6a21\u5757\u63d0\u4f9b\u4ee5\u4e0bAPI\uff1a"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.a,{href:"#k230%E7%B3%BB%E7%BB%9F%E6%8E%A7%E5%88%B6mapi%E5%8F%82%E8%80%83",children:"K230\u7cfb\u7edf\u63a7\u5236MAPI\u53c2\u8003"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#%E5%85%8D%E8%B4%A3%E5%A3%B0%E6%98%8E",children:"\u514d\u8d23\u58f0\u660e"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#%E5%95%86%E6%A0%87%E5%A3%B0%E6%98%8E",children:"\u5546\u6807\u58f0\u660e"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#%E7%9B%AE%E5%BD%95",children:"\u76ee\u5f55"})}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.a,{href:"#%E5%89%8D%E8%A8%80",children:"\u524d\u8a00"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#%E6%A6%82%E8%BF%B0",children:"\u6982\u8ff0"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#%E8%AF%BB%E8%80%85%E5%AF%B9%E8%B1%A1",children:"\u8bfb\u8005\u5bf9\u8c61"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#%E7%BC%A9%E7%95%A5%E8%AF%8D%E5%AE%9A%E4%B9%89",children:"\u7f29\u7565\u8bcd\u5b9a\u4e49"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#%E4%BF%AE%E8%AE%A2%E8%AE%B0%E5%BD%95",children:"\u4fee\u8ba2\u8bb0\u5f55"})}),"\n"]}),"\n"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.a,{href:"#1-%E6%A6%82%E8%BF%B0",children:"1. \u6982\u8ff0"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#11-%E6%A6%82%E8%BF%B0",children:"1.1 \u6982\u8ff0"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#12-%E5%8A%9F%E8%83%BD%E6%8F%8F%E8%BF%B0",children:"1.2 \u529f\u80fd\u63cf\u8ff0"})}),"\n"]}),"\n"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.a,{href:"#2-api%E5%8F%82%E8%80%83",children:"2. API\u53c2\u8003"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#21-kd_mapi_sys_init",children:"2.1 kd_mapi_sys_init"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#22-kd_mapi_sys_deinit",children:"2.2 kd_mapi_sys_deinit"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#23-kd_mapi_media_init",children:"2.3 kd_mapi_media_init"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#24-kd_mapi_media_deinit",children:"2.4 kd_mapi_media_deinit"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#25-kd_mapi_alloc_buffer",children:"2.5 kd_mapi_alloc_buffer"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#26-kd_mapi_free_buffer",children:"2.6 kd_mapi_free_buffer"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#27-kd_mapi_sys_get_vb_block",children:"2.7 kd_mapi_sys_get_vb_block"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#28-kd_mapi_sys_release_vb_block",children:"2.8 kd_mapi_sys_release_vb_block"})}),"\n"]}),"\n"]}),"\n",(0,d.jsxs)(e.li,{children:[(0,d.jsx)(e.a,{href:"#3-%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B",children:"3. \u6570\u636e\u7c7b\u578b"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#31-k_mapi_mod_id_e",children:"3.1 k_mapi_mod_id_e"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#32-k_mapi_media_config_t",children:"3.2 k_mapi_media_config_t"})}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#33-k_mapi_media_attr_t",children:"3.3 k_mapi_media_attr_t"})}),"\n"]}),"\n"]}),"\n",(0,d.jsx)(e.li,{children:(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"4. \u9519\u8bef\u7801"})}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,d.jsx)(e.h3,{id:"21-kd_mapi_sys_init",children:"2.1 kd_mapi_sys_init"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u521d\u59cb\u5316\u7cfb\u7edf\u8d44\u6e90\uff0c\u5efa\u7acb\u53cc\u6838\u95f4\u7684\u6d88\u606f\u901a\u4fe1\u7ba1\u9053\u3002\u4e3a\u4e86\u5efa\u7acb\u53cc\u6838\u8fde\u63a5\uff0c\u5728\u6bcf\u4e2a\u64cd\u4f5c\u7cfb\u7edf\u4e0a\u8fd0\u884c\u7684\u670d\u52a1\u9700\u8981\u5728\u521d\u59cb\u5316\u8fc7\u7a0b\u4e2d\u8c03\u7528\u8fd9\u4e2a\u63a5\u53e3\u6765\u5efa\u7acb\u8fde\u63a5\uff0c\u7136\u540e\u624d\u80fd\u8fdb\u884c\u6838\u95f4\u901a\u4fe1\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsx)(e.p,{children:"k_s32 kd_mapi_sys_init(void );"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u8fd9\u4e2a\u51fd\u6570\u9700\u8981\u5728\u8c03\u7528kd_mapi_media_init\u4e4b\u524d\u88ab\u8c03\u7528"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"22-kd_mapi_sys_deinit",children:"2.2 kd_mapi_sys_deinit"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u53bb\u521d\u59cb\u5316\u7cfb\u7edf\u8d44\u6e90\uff0c\u65ad\u5f00\u53cc\u6838\u95f4\u7684\u6d88\u606f\u901a\u4fe1\u7ba1\u9053\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsx)(e.p,{children:"k_s32 kd_mapi_sys_deinit(void );"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5f53kd_mapi_sys_init\u6ca1\u6709\u88ab\u8c03\u7528\u65f6\uff0c\u5bf9\u8fd9\u4e2amapi\u7684\u8c03\u7528\u8fd4\u56de\u6210\u529f\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"23-kd_mapi_media_init",children:"2.3 kd_mapi_media_init"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u521d\u59cb\u5316\u591a\u5a92\u4f53\u76f8\u5173\u8d44\u6e90\u3002\u4e3b\u8981\u662f\u914d\u7f6evb\u7684\u4e2a\u6570\u548c\u5927\u5c0f"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsxs)(e.p,{children:["k_s32 kd_mapi_media_init(const ",(0,d.jsx)(e.a,{href:"#33-k_mapi_media_attr_t",children:"k_mapi_media_attr_t"})," *media_attr);"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u53c2\u6570\u540d\u79f0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8f93\u5165/\u8f93\u51fa"})})]})}),(0,d.jsx)(e.tbody,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"media_attr"}),(0,d.jsx)(e.td,{children:"\u5a92\u4f53\u5c5e\u6027\u6307\u9488"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]})})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"24-kd_mapi_media_deinit",children:"2.4 kd_mapi_media_deinit"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u53bb\u521d\u59cb\u5316\u591a\u5a92\u4f53\u76f8\u5173\u8d44\u6e90\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsx)(e.p,{children:"k_s32 kd_mapi_media_deinit(void);"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"25-kd_mapi_alloc_buffer",children:"2.5 kd_mapi_alloc_buffer"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5728\u7528\u6237\u6001\u5206\u914d MMZ \u7684\u5185\u5b58(\u5e26cache)"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsx)(e.p,{children:"k_s32 kd_mapi_alloc_buffer(k_u64 *phys_addr, void **virt_addr, k_u32 len, const k_char *name);"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u53c2\u6570\u540d\u79f0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8f93\u5165/\u8f93\u51fa"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"phys_addr"}),(0,d.jsx)(e.td,{children:"buffer\u7684\u7269\u7406\u5730\u5740"}),(0,d.jsx)(e.td,{children:"\u8f93\u51fa"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"virt_addr"}),(0,d.jsx)(e.td,{children:"buffer\u7684\u865a\u62df\u5730\u5740"}),(0,d.jsx)(e.td,{children:"\u8f93\u51fa"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"len"}),(0,d.jsx)(e.td,{children:"buffer\u7684\u957f\u5ea6"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"name"}),(0,d.jsx)(e.td,{children:"buffer\u7684\u540d\u79f0"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"Buffer \u7684\u865a\u62df\u5730\u5740\u548c\u7269\u7406\u5730\u5740\u5df2\u7ecf\u6620\u5c04"}),"\n",(0,d.jsx)(e.li,{children:"\u5728\u5206\u914d\u5185\u5b58\u4e4b\u540e\u5728\u5927\u6838\u7aefmsh\u4e0b\u901a\u8fc7 cat /proc/umap/media-mem \u67e5\u770b buffer \u662f\u5426\u5206\u914d\u6210\u529f\u3002"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"26-kd_mapi_free_buffer",children:"2.6 kd_mapi_free_buffer"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5728\u7528\u6237\u6001\u91ca\u653e MMZ \u7684\u5185\u5b58\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsx)(e.p,{children:"k_s32 kd_mapi_free_buffer(k_u64 phys_addr, void *virt_addr, k_u32 len);"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u53c2\u6570\u540d\u79f0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8f93\u5165/\u8f93\u51fa"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"phys_addr"}),(0,d.jsx)(e.td,{children:"buffer\u7684\u7269\u7406\u5730\u5740"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"virt_addr"}),(0,d.jsx)(e.td,{children:"buffer\u7684\u865a\u62df\u5730\u5740"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"len"}),(0,d.jsx)(e.td,{children:"buffer\u7684\u957f\u5ea6"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5728\u91ca\u653e\u5185\u5b58\u4e4b\u540e\u5728\u5927\u6838\u7aefmsh\u4e0b\u901a\u8fc7 cat /proc/umap/media-mem \u67e5\u770b buffer \u662f\u5426\u91ca\u653e\u6210\u529f\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"27-kd_mapi_sys_get_vb_block",children:"2.7 kd_mapi_sys_get_vb_block"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5728\u7528\u6237\u6001\u83b7\u53d6\u4e00\u4e2a\u7f13\u5b58\u5757\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsx)(e.p,{children:"k_s32 kd_mapi_sys_get_vb_block(k_u32 *pool_id, k_u64 *phys_addr, k_u64 blk_size, const char* mmz_name);"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u53c2\u6570\u540d\u79f0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8f93\u5165/\u8f93\u51fa"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"pool_id"}),(0,d.jsx)(e.td,{children:"\u7f13\u5b58\u5757\u6240\u5728\u7684\u7f13\u5b58\u6c60ID\u53f7"}),(0,d.jsx)(e.td,{children:"\u8f93\u51fa"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"phys_addr"}),(0,d.jsx)(e.td,{children:"\u7f13\u5b58\u5757\u7684\u7269\u7406\u5730\u5740"}),(0,d.jsx)(e.td,{children:"\u8f93\u51fa"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"blk_size"}),(0,d.jsx)(e.td,{children:"\u7f13\u5b58\u5757\u7684\u5927\u5c0f"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"mmz_name"}),(0,d.jsx)(e.td,{children:"\u7f13\u5b58\u6c60\u6240\u5728\u7684ddr\u7684\u540d\u79f0"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5982\u679c\u7528\u6237\u9700\u8981\u4ece\u4efb\u610f\u4e00\u4e2a\u516c\u5171\u7f13\u5b58\u6c60\u4e2d\u83b7\u53d6\u4e00\u5757\u6307\u5b9a\u5927\u5c0f\u7684\u7f13\u5b58\u5757\uff0c\u5c06\u7b2c 2 \u4e2a\u53c2\u6570 blk_size \u8bbe\u7f6e\u4e3a\u9700\u8981\u7684\u7f13\u5b58\u5757\u5927\u5c0f\uff0c\u5e76\u6307\u5b9a\u8981\u4ece\u54ea\u4e2a DDR \u4e0a\u7684\u516c\u5171\u7f13\u5b58\u6c60\u83b7\u53d6\u7f13\u5b58\u5757\u3002\u5982\u679c\u6307\u5b9a\u7684 DDR \u4e0a\u5e76\u6ca1\u6709\u516c\u5171\u7f13\u5b58\u6c60\uff0c\u90a3\u4e48\u5c06\u83b7\u53d6\u4e0d\u5230\u7f13\u5b58\u5757\u3002\u5982\u679cmmz_name \u7b49\u4e8e NULL\uff0c\u5219\u8868\u793a\u5728\u6ca1\u6709\u547d\u540d\u7684 DDR \u4e0a\u7684\u516c\u5171\u7f13\u5b58\u6c60\u83b7\u53d6\u7f13\u5b58\u5757"}),"\n",(0,d.jsx)(e.li,{children:"\u5a92\u4f53\u521d\u59cb\u5316\u65f6\uff0c\u5982\u679c VB \u5728\u6ca1\u6709\u547d\u540d\u7684 DDR \u4e2d\u521b\u5efa\u7f13\u5b58\u6c60\uff0c\u5219\u4ece\u4efb\u610f\u4e00\u4e2a\u516c\u5171\u7f13\u5b58\u6c60\u4e2d\u83b7\u53d6\u4e00\u5757\u6307\u5b9a\u5927\u5c0f\u7684\u7f13\u5b58\u5757, mmz_name\u8bbe\u7f6e\u4e3a NULL \u5373\u53ef"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"28-kd_mapi_sys_release_vb_block",children:"2.8 kd_mapi_sys_release_vb_block"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u63cf\u8ff0\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5728\u7528\u6237\u6001\u91ca\u653e\u4e00\u4e2a\u7f13\u5b58\u5757\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bed\u6cd5\u3011"}),"\n",(0,d.jsx)(e.p,{children:"k_s32 kd_mapi_sys_release_vb_block(k_u64 phys_addr, k_u64 blk_size);"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u53c2\u6570\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u53c2\u6570\u540d\u79f0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8f93\u5165/\u8f93\u51fa"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"phys_addr"}),(0,d.jsx)(e.td,{children:"\u7f13\u5b58\u5757\u7684\u7269\u7406\u5730\u5740"}),(0,d.jsx)(e.td,{children:"\u8f93\u51fa"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"blk_size"}),(0,d.jsx)(e.td,{children:"\u7f13\u5b58\u5757\u7684\u5927\u5c0f"}),(0,d.jsx)(e.td,{children:"\u8f93\u5165"})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8fd4\u56de\u503c\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u8fd4\u56de\u503c"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0"}),(0,d.jsx)(e.td,{children:"\u6210\u529f"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"\u975e0"}),(0,d.jsxs)(e.td,{children:["\u5931\u8d25\uff0c\u5176\u503c\u53c2\u89c1",(0,d.jsx)(e.a,{href:"#4-%E9%94%99%E8%AF%AF%E7%A0%81",children:"\u9519\u8bef\u7801"})]})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u82af\u7247\u5dee\u5f02\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u9700\u6c42\u3011"}),"\n",(0,d.jsxs)(e.ul,{children:["\n",(0,d.jsx)(e.li,{children:"\u5934\u6587\u4ef6\uff1amapi_sys_api.h"}),"\n",(0,d.jsx)(e.li,{children:"\u5e93\u6587\u4ef6\uff1alibmapi.a"}),"\n"]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u83b7\u53d6\u7684\u7f13\u5b58\u5757\u4f7f\u7528\u5b8c\u540e\uff0c\u5e94\u8be5\u8c03\u7528\u6b64\u63a5\u53e3\u91ca\u653e\u7f13\u5b58\u5757\u3002"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u4e3e\u4f8b\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u4e3b\u9898\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h2,{id:"3-\u6570\u636e\u7c7b\u578b",children:"3. \u6570\u636e\u7c7b\u578b"}),"\n",(0,d.jsx)(e.h3,{id:"31-k_mapi_mod_id_e",children:"3.1 k_mapi_mod_id_e"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bf4\u660e\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5b9a\u4e49MAPI\u6a21\u5757ID"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u5b9a\u4e49\u3011"}),"\n",(0,d.jsx)(e.pre,{children:(0,d.jsx)(e.code,{className:"language-C",children:"\ntypedef enum\n\n{\n\nK_MAPI_MOD_SYS = 0,\n\nK_MAPI_MOD_VI,\n\nK_MAPI_MOD_VPROC,\n\nK_MAPI_MOD_VENC,\n\nK_MAPI_MOD_VDEC,\n\nK_MAPI_MOD_VREC,\n\nK_MAPI_MOD_VO,\n\nK_MAPI_MOD_AI,\n\nK_MAPI_MOD_AENC,\n\nK_MAPI_MOD_ADEC,\n\nK_MAPI_MOD_AREC,\n\nK_MAPI_MOD_AO,\n\nK_MAPI_MOD_VVI,\n\nK_MAPI_MOD_VVO,\n\nK_MAPI_MOD_DPU,\n\nK_MAPI_MOD_VICAP,\n\nK_MAPI_MOD_SENSOR,\n\nK_MAPI_MOD_ISP,\n\nK_MAPI_MOD_BUTT,\n\n} k_mapi_mod_id_e;\n"})}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6210\u5458\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u4e8b\u9879\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u6570\u636e\u7c7b\u578b\u53ca\u63a5\u53e3\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"32-k_mapi_media_config_t",children:"3.2 k_mapi_media_config_t"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bf4\u660e\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5b9a\u4e49\u5a92\u4f53\u914d\u7f6e\u5c5e\u6027\u7ed3\u6784\u4f53"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u5b9a\u4e49\u3011"}),"\n",(0,d.jsx)(e.pre,{children:(0,d.jsx)(e.code,{className:"language-C",children:"\ntypedef struct {\n\nk_vb_supplement_config vb_supp;\n\nk_vb_config vb_config;\n\n} k_mapi_media_config_t;\n"})}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6210\u5458\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u6210\u5458\u540d\u79f0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"vb_supp"}),(0,d.jsx)(e.td,{children:"VB \u9644\u52a0\u4fe1\u606f\u7ed3\u6784\u4f53\uff0c\u53c2\u89c1\u300aK230 \u7cfb\u7edf\u63a7\u5236 API\u53c2\u8003\u300b"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"vb_config"}),(0,d.jsx)(e.td,{children:"\u89c6\u9891\u7f13\u5b58\u6c60\u5c5e\u6027\u7ed3\u6784\u4f53\uff0c\u53c2\u89c1\u300aK230 \u7cfb\u7edf\u63a7\u5236 API\u53c2\u8003\u300b"})]})]})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u4e8b\u9879\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u6570\u636e\u7c7b\u578b\u53ca\u63a5\u53e3\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h3,{id:"33-k_mapi_media_attr_t",children:"3.3 k_mapi_media_attr_t"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u8bf4\u660e\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u5b9a\u4e49\u5a92\u4f53\u521d\u59cb\u5316\u5c5e\u6027\u7ed3\u6784\u4f53"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u5b9a\u4e49\u3011"}),"\n",(0,d.jsx)(e.pre,{children:(0,d.jsx)(e.code,{className:"language-C",children:"\ntypedef struct {\n\nk_mapi_media_config_t media_config;\n\n} k_mapi_media_attr_t;\n"})}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6210\u5458\u3011"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u6210\u5458\u540d\u79f0"})}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsx)(e.tbody,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"media_config"}),(0,d.jsx)(e.td,{children:"\u5a92\u4f53\u914d\u7f6e\u5c5e\u6027\u7ed3\u6784\u4f53"})]})})]}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u6ce8\u610f\u4e8b\u9879\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.p,{children:"\u3010\u76f8\u5173\u6570\u636e\u7c7b\u578b\u53ca\u63a5\u53e3\u3011"}),"\n",(0,d.jsx)(e.p,{children:"\u65e0"}),"\n",(0,d.jsx)(e.h2,{id:"4-\u9519\u8bef\u7801",children:"4. \u9519\u8bef\u7801"}),"\n",(0,d.jsx)(e.p,{children:"\u8868 41"}),"\n",(0,d.jsxs)(e.table,{children:[(0,d.jsx)(e.thead,{children:(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.th,{children:"\u9519\u8bef\u4ee3\u7801"}),(0,d.jsx)(e.th,{children:"\u5b8f\u5b9a\u4e49"}),(0,d.jsx)(e.th,{children:(0,d.jsx)(e.strong,{children:"\u63cf\u8ff0"})})]})}),(0,d.jsxs)(e.tbody,{children:[(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0xb0008003"}),(0,d.jsx)(e.td,{children:"K_MAPI_ERR_SYS_ILLEGAL_PARAM"}),(0,d.jsx)(e.td,{children:"\u53c2\u6570\u9519\u8bef"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0xb0008006"}),(0,d.jsx)(e.td,{children:"K_MAPI_ERR_SYS_NULL_PTR"}),(0,d.jsx)(e.td,{children:"\u7a7a\u6307\u9488\u9519\u8bef"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0xb0008009"}),(0,d.jsx)(e.td,{children:"K_MAPI_ERR_SYS_NOT_PERM"}),(0,d.jsx)(e.td,{children:"\u64cd\u4f5c\u4e0d\u5141\u8bb8"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0xb0008010"}),(0,d.jsx)(e.td,{children:"K_MAPI_ERR_SYS_NOTREADY"}),(0,d.jsx)(e.td,{children:"\u8bbe\u5907\u672a\u5c31\u7eea"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0xb0008012"}),(0,d.jsx)(e.td,{children:"K_MAPI_ERR_SYS_BUSY"}),(0,d.jsx)(e.td,{children:"\u7cfb\u7edf\u5fd9"})]}),(0,d.jsxs)(e.tr,{children:[(0,d.jsx)(e.td,{children:"0xb000800c"}),(0,d.jsx)(e.td,{children:"K_MAPI_ERR_SYS_NOMEM"}),(0,d.jsx)(e.td,{children:"\u5206\u914d\u5185\u5b58\u5931\u8d25\uff0c\u5982\u7cfb\u7edf\u5185\u5b58\u4e0d\u8db3"})]})]})]})]})}function t(n={}){const{wrapper:e}={...(0,s.a)(),...n.components};return e?(0,d.jsx)(e,{...n,children:(0,d.jsx)(j,{...n})}):j(n)}},11151:(n,e,i)=>{i.d(e,{Z:()=>h,a:()=>l});var d=i(67294);const s={},r=d.createContext(s);function l(n){const e=d.useContext(r);return d.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function h(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(s):n.components||s:l(n.components),d.createElement(r.Provider,{value:e},n.children)}}}]);