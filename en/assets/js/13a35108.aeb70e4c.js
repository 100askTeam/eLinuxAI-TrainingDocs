"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[3352],{31176:(e,n,A)=>{A.r(n),A.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>r,metadata:()=>c,toc:()=>t});var i=A(85893),d=A(11151);const r={sidebar_position:7},s="\u6444\u50cf\u5934\u5b9e\u9a8c-\u7f16\u7801\u89c6\u9891\u6d41",c={id:"CanaanK230/part3/CameraExperimentEncodingVideoStream",title:"\u6444\u50cf\u5934\u5b9e\u9a8c-\u7f16\u7801\u89c6\u9891\u6d41",description:"\u786c\u4ef6\u8981\u6c42\uff1a",source:"@site/docs/CanaanK230/part3/07_CameraExperimentEncodingVideoStream.md",sourceDirName:"CanaanK230/part3",slug:"/CanaanK230/part3/CameraExperimentEncodingVideoStream",permalink:"/en/CanaanK230/part3/CameraExperimentEncodingVideoStream",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/docs/CanaanK230/part3/07_CameraExperimentEncodingVideoStream.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"canaanK230Sidebar",previous:{title:"\u5b9e\u73b0\u6444\u50cf\u5934\u7684\u663e\u793a\u5c4f\u5b9e\u65f6\u9884\u89c8",permalink:"/en/CanaanK230/part3/AchieveRealTimePreviewCameraDisplay"},next:{title:"\u663e\u793a\u5c4f\u5b9e\u9a8c-\u89e3\u7801\u663e\u793a",permalink:"/en/CanaanK230/part3/DisplayExperimentDecodingDisplay"}},l={},t=[{value:"1.\u89c6\u9891\u7f16\u7801\u67b6\u6784",id:"1\u89c6\u9891\u7f16\u7801\u67b6\u6784",level:2},{value:"1.1 \u7f16\u7801\u901a\u9053",id:"11-\u7f16\u7801\u901a\u9053",level:3},{value:"2.\u5e94\u7528\u5c42\u7a0b\u5e8f\u7f16\u8bd1\u4e0e\u89e3\u6790",id:"2\u5e94\u7528\u5c42\u7a0b\u5e8f\u7f16\u8bd1\u4e0e\u89e3\u6790",level:2},{value:"2.1 \u65b0\u589e\u7a0b\u5e8f",id:"21-\u65b0\u589e\u7a0b\u5e8f",level:3},{value:"2.1.1 \u65b0\u5efa\u5de5\u7a0b\u6587\u4ef6\u5939",id:"211-\u65b0\u5efa\u5de5\u7a0b\u6587\u4ef6\u5939",level:4},{value:"2.1.2 \u4fee\u6539Makefile",id:"212-\u4fee\u6539makefile",level:4},{value:"2.1.3 \u8fdb\u5165\u5de5\u7a0b\u76ee\u5f55",id:"213-\u8fdb\u5165\u5de5\u7a0b\u76ee\u5f55",level:4},{value:"2.1.4 \u65b0\u5efa\u6e90\u7801\u6587\u4ef6",id:"214-\u65b0\u5efa\u6e90\u7801\u6587\u4ef6",level:4},{value:"2.1.5 \u65b0\u5efaMakefile\u6587\u4ef6",id:"215-\u65b0\u5efamakefile\u6587\u4ef6",level:4},{value:"2.2 \u7a0b\u5e8f\u7f16\u8bd1",id:"22-\u7a0b\u5e8f\u7f16\u8bd1",level:3},{value:"2.3 \u7a0b\u5e8f\u8fd0\u884c",id:"23-\u7a0b\u5e8f\u8fd0\u884c",level:3},{value:"2.4 \u7a0b\u5e8f\u89e3\u6790",id:"24-\u7a0b\u5e8f\u89e3\u6790",level:3},{value:"2.4.1 \u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907",id:"241-\u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907",level:4},{value:"2.4.2 \u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u8bbe\u5907\u5c5e\u6027",id:"242-\u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u8bbe\u5907\u5c5e\u6027",level:4},{value:"2.4.3 \u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907",id:"243-\u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907",level:4},{value:"2.4.4 \u521d\u59cb\u5316\u89c6\u9891\u7f13\u51b2\u533a",id:"244-\u521d\u59cb\u5316\u89c6\u9891\u7f13\u51b2\u533a",level:4},{value:"2.4.5 \u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u901a\u9053\u5c5e\u6027",id:"245-\u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u901a\u9053\u5c5e\u6027",level:4},{value:"2.4.6 \u521b\u5efa\u89c6\u9891\u7f16\u7801\u5668\u901a\u9053",id:"246-\u521b\u5efa\u89c6\u9891\u7f16\u7801\u5668\u901a\u9053",level:4},{value:"2.4.7 \u542f\u52a8\u7f16\u7801\u5668\u901a\u9053",id:"247-\u542f\u52a8\u7f16\u7801\u5668\u901a\u9053",level:4},{value:"2.4.8 \u7ed1\u5b9a\u89c6\u9891\u8f93\u5165\u548c\u7f16\u7801\u5668",id:"248-\u7ed1\u5b9a\u89c6\u9891\u8f93\u5165\u548c\u7f16\u7801\u5668",level:4},{value:"2.4.9 \u542f\u52a8\u89c6\u9891\u8f93\u5165\u8bbe\u5907",id:"249-\u542f\u52a8\u89c6\u9891\u8f93\u5165\u8bbe\u5907",level:4},{value:"2.4.10 \u521b\u5efa\u8f93\u51fa\u7ebf\u7a0b",id:"2410-\u521b\u5efa\u8f93\u51fa\u7ebf\u7a0b",level:4}];function a(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,d.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"\u6444\u50cf\u5934\u5b9e\u9a8c-\u7f16\u7801\u89c6\u9891\u6d41",children:"\u6444\u50cf\u5934\u5b9e\u9a8c-\u7f16\u7801\u89c6\u9891\u6d41"}),"\n",(0,i.jsx)(n.p,{children:"\u786c\u4ef6\u8981\u6c42\uff1a"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"DshanPI-CanMV\u5f00\u53d1\u677f"}),"\n",(0,i.jsx)(n.li,{children:"Type-C\u6570\u636e\u7ebf x2"}),"\n",(0,i.jsx)(n.li,{children:"GC2093\u6444\u50cf\u5934"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"\u5f00\u53d1\u73af\u5883\uff1a"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Ubuntu20.04"}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["\u6ce8\u610f\uff1a\u5728\u5b66\u4e60\u524d\u8bf7\u6309\u7167",(0,i.jsx)(n.a,{href:"https://eai.100ask.net/CanaanK230/part2/DshanPICanMVK230SDKEnvironmentConstruction",children:"\u300aK230 SDK\u73af\u5883\u642d\u5efa\u300b"}),"\u642d\u5efa\u597dK230\u7684\u5f00\u53d1\u73af\u5883\u6216\u8005\u76f4\u63a5\u83b7\u53d6\u8d44\u6599\u5149\u76d8\u4e2d\u642d\u5efa\u597d\u73af\u5883\u7684Ubuntu\u865a\u62df\u673a\u3002"]}),"\n",(0,i.jsxs)(n.p,{children:["\u914d\u5957\u6e90\u7801\uff1a",(0,i.jsx)(n.a,{href:"https://pan.baidu.com/s/1VBd0n3FKO0bj8yHOWk4HEw?pwd=ov5d",children:"https://pan.baidu.com/s/1VBd0n3FKO0bj8yHOWk4HEw?pwd=ov5d"})," \u63d0\u53d6\u7801\uff1aov5d"]}),"\n",(0,i.jsxs)(n.p,{children:["\u5177\u4f53\u4f4d\u7f6e\uff1a ",(0,i.jsx)(n.code,{children:"12_\u591a\u5a92\u4f53\u5e94\u7528\u793a\u4f8b\u6e90\u7801\\06_sample_venc_100ask"})]}),"\n",(0,i.jsx)(n.h2,{id:"1\u89c6\u9891\u7f16\u7801\u67b6\u6784",children:"1.\u89c6\u9891\u7f16\u7801\u67b6\u6784"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"image-20241106175525675",src:A(24871).Z+"",width:"808",height:"243"})}),"\n",(0,i.jsx)(n.p,{children:"\u5178\u578b\u7684\u7f16\u7801\u6d41\u7a0b\u5305\u62ec\u4e86\u8f93\u5165\u56fe\u50cf\u7684\u63a5\u6536\u3001\u56fe\u50cf\u5185\u5bb9\u7684\u906e\u6321\u548c\u8986\u76d6\u3001\u56fe\u50cf\u7684\u7f16\u7801\u3001\u4ee5\u53ca\u7801\u6d41\u7684\u8f93\u51fa\u7b49\u8fc7\u7a0b\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u7f16\u7801\u6a21\u5757\u7531VENC\u63a5\u6536\u901a\u9053\u3001\u7f16\u7801\u901a\u9053\u30012D\u63a5\u6536\u901a\u9053\u30012D\u8fd0\u7b97\u6a21\u5757\u7ec4\u6210\u3002\u7f16\u7801\u80fd\u529b\u548c2D\u8fd0\u7b97\u80fd\u529b\u89c1\u4e0b\u8868\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u7f16\u7801\u6570\u636e\u6d41\u7a0b\u56fe\u4e2d\u7684\u7eff\u8272\u7bad\u5934\u6240\u793a\u8def\u5f84\uff0c\u4e3a\u5355\u72ec\u505a2D\u8fd0\u7b97\u7684\u6d41\u7a0b\u3002\u84dd\u8272\u7bad\u5934\u6240\u793a\u8def\u5f84\u4e3a\u5355\u72ec\u505a\u7f16\u7801\u8fd0\u7b97\u7684\u6d41\u7a0b\u3002\u7d2b\u8272\u7bad\u5934\u6240\u793a\u8def\u5f84\u4e3a\u5148\u505a2D\u8fd0\u7b97\u518d\u8fdb\u884c\u7f16\u7801\u7684\u6d41\u7a0b\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u8868 1-1 \u7f16\u7801\u80fd\u529b"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{}),(0,i.jsx)(n.th,{children:"H264"}),(0,i.jsx)(n.th,{children:"HEVC"}),(0,i.jsx)(n.th,{children:"JPEG"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"\u8f93\u5165\u683c\u5f0f"}),(0,i.jsx)(n.td,{children:"YUV420 NV12 8bit, ARGB8888, BGRA8888"}),(0,i.jsx)(n.td,{children:"YUV420 NV12 8bit, ARGB8888, BGRA8888"}),(0,i.jsx)(n.td,{children:"YUV420 NV12 8bit, YUV422 UYVY 8bit, ARGB8888, BGRA8888"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"\u8f93\u51fa\u683c\u5f0f"}),(0,i.jsx)(n.td,{children:"YUV420 H.264 Baseline Profile(BP) ; H.264 Main Profile(MP) ; H.264 High Profile(HP); H.264 High 10 Profile(HP)"}),(0,i.jsx)(n.td,{children:"YUV420 HEVC (H.265) Main ; HEVC (H.265) Main 10 Profile"}),(0,i.jsx)(n.td,{children:"YUV420 and YUV422 JPEG baseline sequential"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"\u6700\u5927\u5206\u8fa8\u7387"}),(0,i.jsx)(n.td,{children:"3840x2160"}),(0,i.jsx)(n.td,{children:"3840x2160"}),(0,i.jsx)(n.td,{children:"8192x8192"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"\u7801\u7387\u63a7\u5236\u6a21\u5f0f"}),(0,i.jsx)(n.td,{children:"CBR/VBR/FIXQP"}),(0,i.jsx)(n.td,{children:"CBR/VBR/FIXQP"}),(0,i.jsx)(n.td,{children:"FIXQP"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"GOP"}),(0,i.jsx)(n.td,{children:"I/P\u5e27"}),(0,i.jsx)(n.td,{children:"I/P\u5e27"}),(0,i.jsx)(n.td,{children:"-"})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"\u7f16\u7801\u901a\u9053"}),(0,i.jsx)(n.td,{children:"4\u8def"}),(0,i.jsx)(n.td,{children:"4\u8def"}),(0,i.jsx)(n.td,{children:"4\u8def"})]})]})]}),"\n",(0,i.jsx)(n.p,{children:"\u6ce8\u610f\uff1aH264/HEVC/JPEG\u5171\u75284\u8def\u3002"}),"\n",(0,i.jsx)(n.p,{children:"\u88681-2 2D\u8fd0\u7b97\u80fd\u529b"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"video\u8f93\u5165\u683c\u5f0f"}),(0,i.jsx)(n.th,{children:"video\u8f93\u51fa\u683c\u5f0f"}),(0,i.jsx)(n.th,{children:"\u53e0\u52a0\u6570\u636e\u683c\u5f0f"}),(0,i.jsx)(n.th,{children:"\u6700\u5927\u5206\u8fa8\u7387"})]})}),(0,i.jsx)(n.tbody,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:"I420/NV12/ARGB8888/BGRA8888"}),(0,i.jsx)(n.td,{children:"\u540c\u8f93\u5165\u683c\u5f0f"}),(0,i.jsx)(n.td,{children:"ARGB8888/ARGB4444/ARGB1555"}),(0,i.jsx)(n.td,{children:"3840x2160"})]})})]}),"\n",(0,i.jsx)(n.h3,{id:"11-\u7f16\u7801\u901a\u9053",children:"1.1 \u7f16\u7801\u901a\u9053"}),"\n",(0,i.jsx)(n.p,{children:"\u7f16\u7801\u901a\u9053\u4f5c\u4e3a\u57fa\u672c\u5bb9\u5668\uff0c\u4fdd\u5b58\u7f16\u7801\u901a\u9053\u7684\u591a\u79cd\u7528\u6237\u8bbe\u7f6e\u548c\u7ba1\u7406\u7f16\u7801\u901a\u9053\u7684\u591a\u79cd\u5185\u90e8\u8d44\u6e90\u3002\u7f16\u7801\u901a\u9053\u5b8c\u6210\u56fe\u50cf\u53e0\u52a0\u548c\u7f16\u7801\u7684\u529f\u80fd\u30022D\u6a21\u5757\u5b9e\u73b0\u56fe\u50cf\u53e0\u52a0\u8fd0\u7b97\uff0c\u7f16\u7801\u5668\u6a21\u5757\u5b9e\u73b0\u56fe\u50cf\u7f16\u7801\uff0c\u4e24\u8005\u65e2\u53ef\u4ee5\u5355\u72ec\u4f7f\u7528\uff0c\u4e5f\u53ef\u4ee5\u534f\u540c\u4f7f\u7528\u3002"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{src:"data:image/jpeg;base64,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",alt:"encode channel"})}),"\n",(0,i.jsx)(n.h2,{id:"2\u5e94\u7528\u5c42\u7a0b\u5e8f\u7f16\u8bd1\u4e0e\u89e3\u6790",children:"2.\u5e94\u7528\u5c42\u7a0b\u5e8f\u7f16\u8bd1\u4e0e\u89e3\u6790"}),"\n",(0,i.jsx)(n.h3,{id:"21-\u65b0\u589e\u7a0b\u5e8f",children:"2.1 \u65b0\u589e\u7a0b\u5e8f"}),"\n",(0,i.jsx)(n.h4,{id:"211-\u65b0\u5efa\u5de5\u7a0b\u6587\u4ef6\u5939",children:"2.1.1 \u65b0\u5efa\u5de5\u7a0b\u6587\u4ef6\u5939"}),"\n",(0,i.jsx)(n.p,{children:"\u5728k230_sdk/src/big/mpp/userapps/sample\u76ee\u5f55\u4e0b\u65b0\u5efa\u5de5\u7a0b"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"mkdir sample_venc_100ask\n"})}),"\n",(0,i.jsx)(n.h4,{id:"212-\u4fee\u6539makefile",children:"2.1.2 \u4fee\u6539Makefile"}),"\n",(0,i.jsx)(n.p,{children:"\u4fee\u6539k230_sdk/src/big/mpp/userapps/sample\u76ee\u5f55\u4e0b\u7684Makefile\u6587\u4ef6\uff0c\u65b0\u589esample_venc_100ask\u5de5\u7a0b\u7684\u7f16\u8bd1\u89c4\u5219"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"@cd sample_venc_100ask; make || exit 1\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"image-20241018211707565",src:A(57928).Z+"",width:"706",height:"240"})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"@cd sample_venc_100ask; make clean\n"})}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"image-20241018211812935",src:A(43164).Z+"",width:"627",height:"215"})}),"\n",(0,i.jsx)(n.h4,{id:"213-\u8fdb\u5165\u5de5\u7a0b\u76ee\u5f55",children:"2.1.3 \u8fdb\u5165\u5de5\u7a0b\u76ee\u5f55"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"cd sample_venc_100ask/\n"})}),"\n",(0,i.jsx)(n.h4,{id:"214-\u65b0\u5efa\u6e90\u7801\u6587\u4ef6",children:"2.1.4 \u65b0\u5efa\u6e90\u7801\u6587\u4ef6"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"vi sample_venc_100ask.c\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u586b\u5165\u6e90\u7801\u3002"}),"\n",(0,i.jsx)(n.h4,{id:"215-\u65b0\u5efamakefile\u6587\u4ef6",children:"2.1.5 \u65b0\u5efaMakefile\u6587\u4ef6"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"vi Makefile\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u586b\u5165\u4e00\u4e0b\u5185\u5bb9\uff1a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'CURRECT_DIR_NAME=$(shell basename `pwd`)\nLOCAL_SRC_DIR = $(shell pwd)\nBIN = $(MPP_SRC_DIR)/userapps/sample/elf/$(CURRECT_DIR_NAME).elf\nLIBPATH = $(MPP_LIB_PATH)\nLIBS = $(MPP_LIBS)\n\nLOCAL_CFLAGS = -I$(LOCAL_SRC_DIR)\n\nSRCS = $(wildcard $(LOCAL_SRC_DIR)/*.c)\n\nOBJS = $(patsubst %.c,%.o,$(SRCS))\n\nall: $(BIN)\n        @-rm -f $(OBJS)\n        echo "${PWD}/Makefile all"\n\n$(OBJS): %.o : %.c\n        @$(CC) $(CC_CFLAGS) $(LOCAL_CFLAGS) $(BSP_CFLGAS) $(RTSMART_CFLAGS) $(MPP_USER_CFLGAS) -c $< -o $@\n\n$(BIN): $(OBJS)\n        $(CC) -o $(BIN) $(LINKFLAG) -Wl,--whole-archive -Wl,--no-whole-archive -n --static $(OBJS) -L$(LIBPATH) -Wl,--start-group $(LIBS) -Wl,--end-group\n\nclean:\n        echo "${PWD}/Makefile clean"\n        -rm -rf $(BIN)\n        -rm -f $(OBJS)\n\n.PHONY: all clean\n'})}),"\n",(0,i.jsx)(n.h3,{id:"22-\u7a0b\u5e8f\u7f16\u8bd1",children:"2.2 \u7a0b\u5e8f\u7f16\u8bd1"}),"\n",(0,i.jsx)(n.p,{children:"1.\u8fdb\u5165K230SDK\u76ee\u5f55"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"cd ~/k230_sdk\n"})}),"\n",(0,i.jsx)(n.p,{children:"2.\u4e0b\u8f7dtoolchain\u548c\u51c6\u5907\u6e90\u7801"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"source tools/get_download_url.sh && make prepare_sourcecode\n"})}),"\n",(0,i.jsx)(n.p,{children:"3.\u6302\u8f7d\u5de5\u5177\u94fe\u76ee\u5f55"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"sudo mount --bind $(pwd)/toolchain /opt/toolchain\n"})}),"\n",(0,i.jsx)(n.p,{children:"4.\u914d\u7f6e\u677f\u7ea7\u578b\u53f7"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"make CONF=k230_canmv_dongshanpi_defconfig prepare_memory\t\n"})}),"\n",(0,i.jsx)(n.p,{children:"5.\u7f16\u8bd1\u7a0b\u5e8f"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"make mpp-apps\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u7b49\u5f85\u7f16\u8bd1\u5b8c\u6210\uff0c\u7f16\u8bd1\u5b8c\u6210\u540e\uff0c\u53ef\u6267\u884c\u7a0b\u5e8f",(0,i.jsx)(n.code,{children:"sample_venc_100ask.elf"}),"\u4f1a\u751f\u6210\u5728",(0,i.jsx)(n.code,{children:"k230_sdk/src/big/mpp/userapps/sample/elf"}),"\u76ee\u5f55\u4e0b\u3002"]}),"\n",(0,i.jsx)(n.p,{children:"\u4f7f\u7528ADB\u5c06\u53ef\u6267\u884c\u7a0b\u5e8f\u4f20\u8f93\u81f3\u5f00\u53d1\u677f\u4e2d"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"adb push src/big/mpp/userapps/sample/elf/sample_venc_100ask.elf /sharefs/app\n"})}),"\n",(0,i.jsx)(n.h3,{id:"23-\u7a0b\u5e8f\u8fd0\u884c",children:"2.3 \u7a0b\u5e8f\u8fd0\u884c"}),"\n",(0,i.jsx)(n.p,{children:"\u4f7f\u7528\u4e32\u53e3\u8f6f\u4ef6\u8bbf\u95ee\u5f00\u53d1\u677f\u7684\u5927\u6838\u4e32\u53e3\u7ec8\u7aef\u3002"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsx)(n.p,{children:"\u5982\u679c\u6ca1\u6709\u5173\u95ed\u5f00\u673a\u81ea\u542f\u7a0b\u5e8f\uff0c\u53ef\u6309\u4e0bq+\u56de\u8f66\u952e\u53ef\u9000\u51fa\u5f00\u673a\u81ea\u542f\u7a0b\u5e8f\u3002"}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"1.\u8fdb\u5165\u53ef\u6267\u884c\u6587\u4ef6\u76ee\u5f55"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"cd /sharefs/app\n"})}),"\n",(0,i.jsx)(n.p,{children:"2.\u8fd0\u884c\u7a0b\u5e8f"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"./sample_venc_100ask.elf\n"})}),"\n",(0,i.jsx)(n.p,{children:"\u6267\u884c\u5b8c\u6210\u540e\u6548\u679c\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"image-20241021102839994",src:A(33862).Z+"",width:"762",height:"508"})}),"\n",(0,i.jsxs)(n.p,{children:["3.\u8f93\u5165",(0,i.jsx)(n.code,{children:"q"}),"\u5e76\u6309\u4e0b\u56de\u8f66\u5373\u53ef\u9000\u51fa\u7a0b\u5e8f\u3002"]}),"\n",(0,i.jsx)(n.h3,{id:"24-\u7a0b\u5e8f\u89e3\u6790",children:"2.4 \u7a0b\u5e8f\u89e3\u6790"}),"\n",(0,i.jsx)(n.p,{children:"\u4ee3\u7801\u6d41\u7a0b\u56fe\u5982\u4e0b\u6240\u793a\uff1a"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"image-20241024154711051",src:A(57307).Z+"",width:"342",height:"766"})}),"\n",(0,i.jsx)(n.h4,{id:"241-\u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907",children:"2.4.1 \u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"// \u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907\u5c5e\u6027\u7ed3\u6784\u4f53\nmemset(&dev_attr, 0, sizeof(k_vicap_dev_attr));\n// \u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u901a\u9053\u5c5e\u6027\u7ed3\u6784\u4f53\nmemset(&chn_attr, 0, sizeof(k_vicap_chn_attr));\n// \u521d\u59cb\u5316\u4f20\u611f\u5668\u4fe1\u606f\u7ed3\u6784\u4f53\nmemset(&sensor_info, 0, sizeof(k_vicap_sensor_info));\n// \u8bbe\u7f6e\u4f20\u611f\u5668\u7c7b\u578b\nsensor_info.sensor_type = GC2093_MIPI_CSI2_1920X1080_30FPS_10BIT_LINEAR;\nret = kd_mpi_vicap_get_sensor_info(sensor_info.sensor_type, &sensor_info);\n"})}),"\n",(0,i.jsx)(n.h4,{id:"242-\u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u8bbe\u5907\u5c5e\u6027",children:"2.4.2 \u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u8bbe\u5907\u5c5e\u6027"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"dev_attr.acq_win.width = sensor_info.width;   // 480\ndev_attr.acq_win.height = sensor_info.height; // 800\ndev_attr.mode = VICAP_WORK_ONLINE_MODE;\n"})}),"\n",(0,i.jsx)(n.h4,{id:"243-\u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907",children:"2.4.3 \u521d\u59cb\u5316\u89c6\u9891\u8f93\u5165\u8bbe\u5907"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ret = kd_mpi_vicap_init(vicap_dev);\n"})}),"\n",(0,i.jsx)(n.h4,{id:"244-\u521d\u59cb\u5316\u89c6\u9891\u7f13\u51b2\u533a",children:"2.4.4 \u521d\u59cb\u5316\u89c6\u9891\u7f13\u51b2\u533a"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"sample_vb_init(K_FALSE); \n"})}),"\n",(0,i.jsx)(n.h4,{id:"245-\u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u901a\u9053\u5c5e\u6027",children:"2.4.5 \u8bbe\u7f6e\u89c6\u9891\u8f93\u5165\u901a\u9053\u5c5e\u6027"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"attr.venc_attr.pic_width = width;  // \u5bbd\nattr.venc_attr.pic_height = height; // \u9ad8\nattr.venc_attr.stream_buf_size = STREAM_BUF_SIZE; // \u6d41\u7f13\u51b2\u533a\u5927\u5c0f\nattr.venc_attr.stream_buf_cnt = OUTPUT_BUF_CNT;  // \u6d41\u7f13\u51b2\u533a\u6570\u91cf\n\nattr.rc_attr.rc_mode = rc_mode;  \nattr.rc_attr.cbr.src_frame_rate = 30;\nattr.rc_attr.cbr.dst_frame_rate = 30;\nattr.rc_attr.cbr.bit_rate = bitrate;\n\nattr.venc_attr.type = type;   // \u7f16\u7801\u7c7b\u578b\nattr.venc_attr.profile = profile;\n"})}),"\n",(0,i.jsx)(n.h4,{id:"246-\u521b\u5efa\u89c6\u9891\u7f16\u7801\u5668\u901a\u9053",children:"2.4.6 \u521b\u5efa\u89c6\u9891\u7f16\u7801\u5668\u901a\u9053"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ret = kd_mpi_venc_create_chn(ch, &attr);\n"})}),"\n",(0,i.jsx)(n.h4,{id:"247-\u542f\u52a8\u7f16\u7801\u5668\u901a\u9053",children:"2.4.7 \u542f\u52a8\u7f16\u7801\u5668\u901a\u9053"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"ret = kd_mpi_venc_start_chn(ch);\n"})}),"\n",(0,i.jsx)(n.h4,{id:"248-\u7ed1\u5b9a\u89c6\u9891\u8f93\u5165\u548c\u7f16\u7801\u5668",children:"2.4.8 \u7ed1\u5b9a\u89c6\u9891\u8f93\u5165\u548c\u7f16\u7801\u5668"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:'static void sample_vi_bind_venc(k_u32 chn_id)\n{\n    k_mpp_chn venc_mpp_chn;\n    k_mpp_chn vi_mpp_chn;\n    k_s32 ret;\n\n#ifdef ENABLE_VDSS\n    vi_mpp_chn.mod_id = K_ID_VICAP;\n#else\n    vi_mpp_chn.mod_id = K_ID_VI;\n#endif\n\n    venc_mpp_chn.mod_id = K_ID_VENC;  // \u89c6\u9891\u7f16\u7801\u5668\u901a\u9053\u6a21\u5757ID\n    venc_mpp_chn.dev_id = 0;\t      // \u89c6\u9891\u7f16\u7801\u5668\u901a\u9053\u8bbe\u5907ID\n    venc_mpp_chn.chn_id = chn_id;     // \u89c6\u9891\u7f16\u7801\u5668\u901a\u9053ID\n\n    vi_mpp_chn.dev_id = chn_id;\n    vi_mpp_chn.chn_id = chn_id;\n    ret = kd_mpi_sys_bind(&vi_mpp_chn, &venc_mpp_chn);\n    if (ret)\n    {\n        printf("kd_mpi_sys_bind failed:0x%x\\n", ret);\n    }\n\n    return;\n}\n'})}),"\n",(0,i.jsx)(n.h4,{id:"249-\u542f\u52a8\u89c6\u9891\u8f93\u5165\u8bbe\u5907",children:"2.4.9 \u542f\u52a8\u89c6\u9891\u8f93\u5165\u8bbe\u5907"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"void sample_vicap_start(k_u32 ch)\n{\n#ifdef ENABLE_VDSS\n    k_s32 ret;\n    ret = kd_mpi_vdss_start_pipe(0, ch);\n    CHECK_RET(ret, __func__, __LINE__);\n#else\n    k_s32 ret;\n\n    ret = kd_mpi_vicap_start_stream(VICAP_DEV_ID_0);\n    CHECK_RET(ret, __func__, __LINE__);\n#endif\n}\n"})}),"\n",(0,i.jsx)(n.h4,{id:"2410-\u521b\u5efa\u8f93\u51fa\u7ebf\u7a0b",children:"2.4.10 \u521b\u5efa\u8f93\u51fa\u7ebf\u7a0b"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"pthread_create(&g_venc_conf.output_tid, NULL, output_thread, &info);\n"})})]})}function p(e={}){const{wrapper:n}={...(0,d.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},57928:(e,n,A)=>{A.d(n,{Z:()=>i});const i=A.p+"assets/images/image-20241018211707565-eb4a43a1af53be0d4a4bbc7747f64c75.png"},43164:(e,n,A)=>{A.d(n,{Z:()=>i});const i=A.p+"assets/images/image-20241018211812935-0a605d47f884be053f473b0474556835.png"},33862:(e,n,A)=>{A.d(n,{Z:()=>i});const i=A.p+"assets/images/image-20241021102839994-51a014ec7f95a42d0e7a368e07de65de.png"},57307:(e,n,A)=>{A.d(n,{Z:()=>i});const i=A.p+"assets/images/image-20241024154711051-267be4599fccc7a5b26bc73fae799b4a.png"},24871:(e,n,A)=>{A.d(n,{Z:()=>i});const i=A.p+"assets/images/image-20241106175525675-dadd4142f6d4c0940bf65bf07e9b51e9.png"},11151:(e,n,A)=>{A.d(n,{Z:()=>c,a:()=>s});var i=A(67294);const d={},r=i.createContext(d);function s(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:s(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);