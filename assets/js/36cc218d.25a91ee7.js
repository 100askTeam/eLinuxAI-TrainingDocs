"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[8898],{85687:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>r,contentTitle:()=>t,default:()=>h,frontMatter:()=>l,metadata:()=>c,toc:()=>d});var s=i(85893),a=i(11151);const l={sidebar_position:5},t="K230 RVV\u5b9e\u6218",c={id:"CanaanK230/part3/K230RVVActualcombat",title:"K230 RVV\u5b9e\u6218",description:"\u6982\u8ff0",source:"@site/docs/CanaanK230/part3/05_K230RVVActualcombat.md",sourceDirName:"CanaanK230/part3",slug:"/CanaanK230/part3/K230RVVActualcombat",permalink:"/CanaanK230/part3/K230RVVActualcombat",draft:!1,unlisted:!1,editUrl:"https://github.com/100askTeam/eLinuxAI-TrainingDocs/tree/main/docs/CanaanK230/part3/05_K230RVVActualcombat.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"canaanK230Sidebar",previous:{title:"K230 GUI\u5b9e\u6218 - LVGL\u79fb\u690d\u6559\u7a0b",permalink:"/CanaanK230/part3/K230GUIpractical LVGLportingtutorials"},next:{title:"K230 USB\u5e94\u7528\u5b9e\u6218-UVC\u4f20\u8f93YUV\u53ca\u7f16\u7801\u7801\u6d41",permalink:"/CanaanK230/part3/K230USBapplicationisUVCtransmissionofYUVandcodedstreams"}},r={},d=[{value:"\u6982\u8ff0",id:"\u6982\u8ff0",level:2},{value:"1.\u73af\u5883\u51c6\u5907",id:"1\u73af\u5883\u51c6\u5907",level:2},{value:"1.1 \u786c\u4ef6\u73af\u5883",id:"11-\u786c\u4ef6\u73af\u5883",level:3},{value:"1.2 \u8f6f\u4ef6\u73af\u5883",id:"12-\u8f6f\u4ef6\u73af\u5883",level:3},{value:"2. \u4f7f\u7528RVV\u529f\u80fd",id:"2-\u4f7f\u7528rvv\u529f\u80fd",level:2},{value:"2.1 \u6e90\u7801\u7f16\u5199",id:"21-\u6e90\u7801\u7f16\u5199",level:3},{value:"2.1.1 \u6e90\u7801",id:"211-\u6e90\u7801",level:4},{value:"2.1.2 SCONS\u914d\u7f6e\u6587\u4ef6",id:"212-scons\u914d\u7f6e\u6587\u4ef6",level:4},{value:"2.2 \u7f16\u8bd1",id:"22-\u7f16\u8bd1",level:3},{value:"2.3 \u8fd0\u884c",id:"23-\u8fd0\u884c",level:3},{value:"2.4 \u53cd\u7f16\u8bd1",id:"24-\u53cd\u7f16\u8bd1",level:3}];function o(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"k230-rvv\u5b9e\u6218",children:"K230 RVV\u5b9e\u6218"}),"\n",(0,s.jsx)(n.h2,{id:"\u6982\u8ff0",children:"\u6982\u8ff0"}),"\n",(0,s.jsx)(n.p,{children:"RVV\uff08RISC-V Vector Extension\uff09\u662f\u6307RISC-V\u6307\u4ee4\u96c6\u67b6\u6784\u7684\u5411\u91cf\u6269\u5c55\u3002RISC-V\u662f\u4e00\u79cd\u5f00\u6e90\u7684\u6307\u4ee4\u96c6\u67b6\u6784\uff0c\u5b83\u7684\u8bbe\u8ba1\u7b80\u6d01\u3001\u53ef\u6269\u5c55\u6027\u5f3a\uff0c\u5e76\u4e14\u5177\u6709\u5e7f\u6cdb\u7684\u5e94\u7528\u9886\u57df\u3002RVV\u4f5c\u4e3aRISC-V\u7684\u4e00\u4e2a\u53ef\u9009\u6269\u5c55\uff0c\u65e8\u5728\u652f\u6301\u5411\u91cf\u5904\u7406\u548c\u5e76\u884c\u8ba1\u7b97\u3002RVV\u5b9a\u4e49\u4e86\u4e00\u7ec4\u65b0\u7684\u6307\u4ee4\uff0c\u7528\u4e8e\u6267\u884c\u5411\u91cf\u64cd\u4f5c\u3002\u8fd9\u4e9b\u6307\u4ee4\u5141\u8bb8\u540c\u65f6\u5904\u7406\u591a\u4e2a\u6570\u636e\u5143\u7d20\uff0c\u4ece\u800c\u63d0\u9ad8\u8ba1\u7b97\u6548\u7387\u548c\u541e\u5410\u91cf\u3002\u5411\u91cf\u64cd\u4f5c\u53ef\u4ee5\u5728\u5355\u4e2a\u6307\u4ee4\u4e2d\u6267\u884c\uff0c\u800c\u4e0d\u9700\u8981\u901a\u8fc7\u5faa\u73af\u6216\u9010\u4e2a\u64cd\u4f5c\u6765\u5904\u7406\u6bcf\u4e2a\u6570\u636e\u5143\u7d20\u3002RVV\u652f\u6301\u4e0d\u540c\u7684\u5411\u91cf\u957f\u5ea6\uff0c\u53ef\u4ee5\u6839\u636e\u5e94\u7528\u7684\u9700\u6c42\u9009\u62e9\u4e0d\u540c\u7684\u5411\u91cf\u957f\u5ea6\u3002\u5411\u91cf\u957f\u5ea6\u53ef\u4ee5\u662f\u56fa\u5b9a\u7684\uff0c\u4e5f\u53ef\u4ee5\u662f\u53ef\u914d\u7f6e\u7684\u3002RVV\u8fd8\u652f\u6301\u4e0d\u540c\u7684\u6570\u636e\u7c7b\u578b\uff0c\u5305\u62ec\u6574\u6570\u3001\u6d6e\u70b9\u6570\u548c\u5b9a\u70b9\u6570\u7b49\u3002"}),"\n",(0,s.jsx)(n.p,{children:"RVV\u7684\u5f15\u5165\u4e3a\u5904\u7406\u5668\u63d0\u4f9b\u4e86\u5411\u91cf\u5904\u7406\u548c\u5e76\u884c\u8ba1\u7b97\u7684\u80fd\u529b\uff0c\u53ef\u4ee5\u52a0\u901f\u5404\u79cd\u5e94\u7528\uff0c\u5982\u56fe\u50cf\u5904\u7406\u3001\u4fe1\u53f7\u5904\u7406\u3001\u673a\u5668\u5b66\u4e60\u3001\u79d1\u5b66\u8ba1\u7b97\u7b49\u3002\u540c\u65f6\uff0cRVV\u7684\u5f00\u653e\u548c\u53ef\u6269\u5c55\u6027\u4e5f\u4f7f\u5f97\u5404\u4e2a\u5382\u5546\u548c\u5f00\u53d1\u8005\u6839\u636e\u81ea\u5df1\u7684\u9700\u6c42\u8fdb\u884c\u5b9a\u5236\u548c\u4f18\u5316\u3002K230 \u91c7\u7528\u7684\u662f\u7384\u94c1C908\u53cc\u6838\u5904\u7406\u5668,\u5176\u4e2d\u5927\u6838C908\u5e26\u4e86RVV1.0\u6269\u5c55\uff0c\u672c\u6587\u63cf\u8ff0\u4e86\u5982\u4f55\u5728\u5927\u6838rt-smart\u4e0a\u4f7f\u7528rvv\u529f\u80fd\u3002\u4ee5\u53ca\u4f53\u9a8cRVV\u52a0\u901f\u5e26\u6765\u7684\u5b9e\u9645\u6548\u679c\u3002"}),"\n",(0,s.jsx)(n.h2,{id:"1\u73af\u5883\u51c6\u5907",children:"1.\u73af\u5883\u51c6\u5907"}),"\n",(0,s.jsx)(n.h3,{id:"11-\u786c\u4ef6\u73af\u5883",children:"1.1 \u786c\u4ef6\u73af\u5883"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"K230-UNSIP-LP3-EVB-V1.0/K230-UNSIP-LP3-EVB-V1.1"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"12-\u8f6f\u4ef6\u73af\u5883",children:"1.2 \u8f6f\u4ef6\u73af\u5883"}),"\n",(0,s.jsx)(n.p,{children:"k230_SDK"}),"\n",(0,s.jsx)(n.h2,{id:"2-\u4f7f\u7528rvv\u529f\u80fd",children:"2. \u4f7f\u7528RVV\u529f\u80fd"}),"\n",(0,s.jsx)(n.h3,{id:"21-\u6e90\u7801\u7f16\u5199",children:"2.1 \u6e90\u7801\u7f16\u5199"}),"\n",(0,s.jsx)(n.p,{children:"\u4e3a\u4e86\u4f53\u9a8cRVV\u5728\u5411\u91cf\u8ba1\u7b97\u4e0a\u52a0\u901f\u7684\u4f18\u52bf\uff0c\u6211\u4eec\u4ee5\u56fe\u50cf\u7f29\u653e\u4f5c\u4e3a\u5e94\u7528\u573a\u666f\uff0c\u7f16\u5199\u4e00\u4e2ademo\u3002\u5728sdk\u7684\u5982\u4e0b\u8def\u5f84\u521b\u5efa\u4e00\u4e2a\u6587\u4ef6\u5939"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"k230_sdk/src/big/rt-smart/userapps/testcases/scale"})}),"\n",(0,s.jsx)(n.p,{children:"\u6ce8\u610f\u5982\u679c\u5728k230_sdk\u4e0b\u8fd0\u884c\u4e86make\u6216\u8005make rt-smart\u7684\u8bdd\u53ef\u80fd\u4f1a\u5bfc\u81f4\u4fee\u6539\u88ab\u8986\u76d6\uff0c\u8bfb\u8005\u53ef\u4ee5\u5c06\u5b8c\u6210\u540e\u7684\u6e90\u7801\u62f7\u8d1d\u4e00\u4efd\u5230\u5982\u4e0b\u76ee\u5f55"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"k230_sdk/src/big/unittest/testcases"})}),"\n",(0,s.jsx)(n.h4,{id:"211-\u6e90\u7801",children:"2.1.1 \u6e90\u7801"}),"\n",(0,s.jsx)(n.p,{children:"\u5728scale\u76ee\u5f55\u4e0b\u521b\u5efaC\u6e90\u7801\u6587\u4ef6scale.c"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-C",children:'#include <stdio.h>\n#include <stdlib.h>\n#include <stddef.h>\n#include <stdint.h>\n#include <time.h>\n\n#pragma pack(push, 1)\ntypedef struct {\n    unsigned short signature;\n    unsigned int fileSize;\n    unsigned short reserved1;\n    unsigned short reserved2;\n    unsigned int dataOffset;\n} BitmapFileHeader;\n\ntypedef struct {\n    unsigned int headerSize;\n    int width;\n    int height;\n    unsigned short planes;\n    unsigned short bitsPerPixel;\n    unsigned int compression;\n    unsigned int imageSize;\n    int xPixelsPerMeter;\n    int yPixelsPerMeter;\n    unsigned int colorsUsed;\n    unsigned int colorsImportant;\n} BitmapInfoHeader;\n#pragma pack(pop)\n\n\n\nvoid __attribute__((optimize(3)))\nscaleBMP(const char* inputPath, const char* outputPath, float scaleFactor) {\n    // \u8bfb\u53d6\u8f93\u5165BMP\u6587\u4ef6\n    FILE* inputFile = fopen(inputPath, "rb");\n    if (inputFile == NULL) {\n        printf("Failed to open input BMP file.\\n");\n        return;\n    }\n\n    BitmapFileHeader fileHeader;\n    BitmapInfoHeader infoHeader;\n    fread(&fileHeader, sizeof(BitmapFileHeader), 1, inputFile);\n    fread(&infoHeader, sizeof(BitmapInfoHeader), 1, inputFile);\n\n    int originalWidth = infoHeader.width;\n    int originalHeight = infoHeader.height;\n    int originalImageSize = infoHeader.imageSize;\n\n    unsigned char* originalImageData = (unsigned char*) malloc(originalImageSize);\n    fread(originalImageData, originalImageSize, 1, inputFile);\n    fclose(inputFile);\n\n    // \u8ba1\u7b97\u7f29\u653e\u540e\u7684\u56fe\u50cf\u5c3a\u5bf8\n    int scaledWidth = (int)(originalWidth * scaleFactor);\n    int scaledHeight = (int)(originalHeight * scaleFactor);\n    int scaledImageSize = scaledWidth * scaledHeight * 3;\n\n    // \u521b\u5efa\u8f93\u51faBMP\u6587\u4ef6\n    FILE* outputFile = fopen(outputPath, "wb");\n    if (outputFile == NULL) {\n        printf("Failed to create output BMP file.\\n");\n        free(originalImageData);\n        return;\n    }\n\n    // \u66f4\u65b0BMP\u6587\u4ef6\u5934\u4fe1\u606f\n    fileHeader.fileSize = sizeof(BitmapFileHeader) + sizeof(BitmapInfoHeader) + scaledImageSize;\n    infoHeader.width = scaledWidth;\n    infoHeader.height = scaledHeight;\n    infoHeader.imageSize = scaledImageSize;\n    fwrite(&fileHeader, sizeof(BitmapFileHeader), 1, outputFile);\n    fwrite(&infoHeader, sizeof(BitmapInfoHeader), 1, outputFile);\n\n    clock_t start, finish;\n    start = clock();\n    // \u7f29\u653e\u56fe\u50cf\u6570\u636e\n    unsigned char* scaledImageData = (unsigned char*) malloc(scaledImageSize);\n    for (int y = 0; y < scaledHeight; y++) {\n        for (int x = 0; x < scaledWidth; x++) {\n            int originalX = (int)(x / scaleFactor);\n            int originalY = (int)(y / scaleFactor);\n            scaledImageData[(y * scaledWidth + x) * 3 + 0] = originalImageData[(originalY * originalWidth + originalX) * 3 + 0];\n            scaledImageData[(y * scaledWidth + x) * 3 + 1] = originalImageData[(originalY * originalWidth + originalX) * 3 + 1];\n            scaledImageData[(y * scaledWidth + x) * 3 + 2] = originalImageData[(originalY * originalWidth + originalX) * 3 + 2];\n        }\n    }\n    finish = clock();\n    printf("scale cacl use time:%f ms\\n",(double)(finish - start) / CLOCKS_PER_SEC);\n\n    // \u5199\u5165\u7f29\u653e\u540e\u7684\u56fe\u50cf\u6570\u636e\n    fwrite(scaledImageData, scaledImageSize, 1, outputFile);\n    fclose(outputFile);\n\n    free(originalImageData);\n    free(scaledImageData);\n\n    printf("BMP image scaling completed.\\n");\n}\n\n\nint main() \n{\n    const char* inputPath = "input.bmp";\n    const char* outputPath = "output.bmp";\n    float scaleFactor = 0.5; // \u7f29\u653e\u56e0\u5b50\n    scaleBMP(inputPath, outputPath, scaleFactor);\n    return 0;\n}\n'})}),"\n",(0,s.jsx)(n.h4,{id:"212-scons\u914d\u7f6e\u6587\u4ef6",children:"2.1.2 SCONS\u914d\u7f6e\u6587\u4ef6"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u521b\u5efaSConscript\u6587\u4ef6"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",children:"# RT-Thread building script for component\n\nfrom building import *\n\ncwd = GetCurrentDir()\nsrc = Glob('*.c')\nCPPPATH = [cwd]\n\nCPPDEFINES = [\n    'HAVE_CCONFIG_H',\n]\ngroup = DefineGroup('scale', src, depend = [''], CPPPATH = CPPPATH, CPPDEFINES = CPPDEFINES)\n\nReturn('group')\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\u521b\u5efaSConstruct\u6587\u4ef6"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-python",children:"import os\nimport sys\n\n# add building.py path\nsys.path = sys.path + [os.path.join('..','..','..','tools')]\nfrom building import *\n\nBuildApplication('scale', 'SConscript', usr_root = '../../..')\n"})}),"\n",(0,s.jsx)(n.h3,{id:"22-\u7f16\u8bd1",children:"2.2 \u7f16\u8bd1"}),"\n",(0,s.jsxs)(n.p,{children:["\u8fdb\u5165\u76ee\u5f55 ",(0,s.jsx)(n.code,{children:"src/big/rt-smart"})," \u8fd0\u884c\u811a\u672c ",(0,s.jsx)(n.code,{children:"source smart-env.sh riscv64"})," \u914d\u7f6e\u73af\u5883\u53d8\u91cf\u3002"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"$ source smart-env.sh riscv64\nArch         => riscv64\nCC           => gcc\nPREFIX       => riscv64-unknown-linux-musl-\nEXEC_PATH    => /home/testUser/k230_sdk/src/big/rt-smart/../../../toolchain/riscv64-linux-musleabi_for_x86_64-pc-linux-gnu/bin\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\u8fdb\u5165",(0,s.jsx)(n.code,{children:"userapps/testcases/scale"}),"\u76ee\u5f55\u8fd0\u884c",(0,s.jsx)(n.code,{children:"scons --release"}),"\u7f16\u8bd1"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"$ cd userapps/testcases/scale\n$ scons --release\nscons: Reading SConscript files ...\nscons: done reading SConscript files.\nscons: Building targets ...\nscons: building associated VariantDir targets: build/scale\nCC build/scale/scal.o\nLINK scale.elf\n/home/haohaibo/work/k230_sdk/toolchain/riscv64-linux-musleabi_for_x86_64-pc-linux-gnu/bin/../lib/gcc/riscv64-unknown-linux-musl/12.0.1/../../../../riscv64-unknown-linux-musl/bin/ld: warning: scale.elf has a LOAD segment with RWX permissions\nscons: done building targets.\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u5c06\u7f16\u8bd1\u597d\u7684\u7a0b\u5e8f\u91cd\u547d\u540d"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"mv scale.elf scale_with_rvv.elf\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u7f16\u8f91k230_sdk/src/big/rt-smart/tools/riscv64.py\u6587\u4ef6\uff0c\u53bb\u6389\u7f16\u8bd1\u9009\u9879\u7684v\u6269\u5c55\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-diff",children:"$:k230_sdk/src/big/rt-smart/userapps/testcases/scale$ git diff\ndiff --git a/tools/riscv64.py b/tools/riscv64.py\nindex 16fc9b2..c045bf5 100644\n--- a/tools/riscv64.py\n+++ b/tools/riscv64.py\n@@ -44,7 +44,7 @@ class ARCHRISCV64():\n                 EXT_CFLAGS = ''\n                 EXT_LFLAGS = ''\n \n-            DEVICE = ' -mcmodel=medany -march=rv64imafdcv -mabi=lp64d'\n+            DEVICE = ' -mcmodel=medany -march=rv64imafdc -mabi=lp64d'\n             self.CFLAGS    = configuration.get('CFLAGS', DEVICE + ' -Werror -Wall' + EXT_CFLAGS)\n             self.AFLAGS    = configuration.get('AFLAGS', ' -c' + DEVICE + ' -x assembler-with-cpp -D__ASSEMBLY__ -I.' + EXT_CFLAGS)\n             LINK_SCRIPT    = configuration.get('LINK_SCRIPT', os.path.join(USR_ROOT, 'linker_scripts', 'riscv64', 'link.lds'))\nhaohaibo@develop:~/work/k230_sdk/src/big/rt-smart/userapps/testcases/scale$ \n\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u91cd\u65b0\u7f16\u8bd1\u6e90\u7801,\u4e4b\u540e\u5c06\u7f16\u8bd1\u5b8c\u7684scale.elf\u548cscale_with_rvv.elf\u5168\u90e8\u62f7\u8d1d\u5230sharefs\u4e0b\u8fd0\u884c\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"23-\u8fd0\u884c",children:"2.3 \u8fd0\u884c"}),"\n",(0,s.jsx)(n.p,{children:"\u51c6\u5907\u4e00\u5f2024\u4f4dbmp\u7684\u56fe\u7247\uff0c\u547d\u540d\u4e3ainput.bmp(\u53ef\u4ee5\u7528PC\u753b\u56fe\u8f6f\u4ef6\u4fdd\u5b58\u751f\u6210), \u4e0e\u7a0b\u5e8f\u653e\u5728\u540c\u4e00\u76ee\u5f55\uff0c\u4e4b\u540e\u5927\u6838\u901a\u8fc7sharefs\u8fd0\u884c\u8fd9\u4fe9\u4e2a\u7a0b\u5e8f\u3002"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-shell",children:"msh /sharefs>scale.elf\nscale cacl use time:0.013952 ms\nBMP image scaling completed.\nmsh /sharefs>scale.elf\nscale cacl use time:0.013960 ms\nBMP image scaling completed.\nmsh /sharefs>scale.elf\nscale cacl use time:0.013941 ms\nBMP image scaling completed.\nmsh /sharefs>scale.elf\nscale cacl use time:0.013936 ms\nBMP image scaling completed.\nmsh /sharefs>scale.elf\nscale cacl use time:0.013945 ms\nBMP image scaling completed.\nmsh /sharefs>scale.elf\nscale cacl use time:0.013957 ms\nBMP image scaling completed.\nmsh /sharefs>scale_with_rvv.elf\nscale cacl use time:0.010139 ms\nBMP image scaling completed.\nmsh /sharefs>scale_with_rvv.elf\nscale cacl use time:0.010133 ms\nBMP image scaling completed.\nmsh /sharefs>scale_with_rvv.elf\nscale cacl use time:0.010135 ms\nBMP image scaling completed.\nmsh /sharefs>scale_with_rvv.elf\nscale cacl use time:0.010144 ms\nBMP image scaling completed.\nmsh /sharefs>scale_with_rvv.elf\nscale cacl use time:0.010142 ms\nBMP image scaling completed.\n"})}),"\n",(0,s.jsx)(n.p,{children:"\u4ece\u6253\u5370\u4fe1\u606f\u770b\uff0c\u4f7f\u7528\u4e86V\u6269\u5c55\u6307\u4ee4\u540e\uff0c\u6570\u7ec4\u7684\u8ba1\u7b97\u660e\u663e\u52a0\u5feb\u4e86\uff0c\u5982\u679c\u589e\u5927\u56fe\u50cf\u7684\u5206\u8fa8\u7387\u52304K\uff0c\u53ef\u4ee5\u770b\u5230\u66f4\u660e\u663e\u7684\u5bf9\u6bd4\u3002"}),"\n",(0,s.jsx)(n.h3,{id:"24-\u53cd\u7f16\u8bd1",children:"2.4 \u53cd\u7f16\u8bd1"}),"\n",(0,s.jsx)(n.p,{children:"\u53ef\u4ee5\u5728\u6e90\u7801\u76ee\u5f55\u4e0b\u4f7f\u7528objdump\u5de5\u5177\u53cd\u7f16\u8bd1\u53ef\u786e\u8ba4\u662f\u5426\u4ea7\u751f\u4e86vector\u6307\u4ee4"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-text",children:"$ riscv64-unknown-linux-musl-objdump scale_with_rvv.elf -S |grep 'vadd'\n   200002c7e:03bf4dd7          vadd.vx v27,v27,t5\n   200002c94:03834c57          vadd.vx v24,v24,t1\n$ riscv64-unknown-linux-musl-objdump scale_with_rvv.elf -S |grep 'vmul'\n   200002c98:97856c57           vmul.vx v24,v24,a0\n\n"})})]})}function h(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},11151:(e,n,i)=>{i.d(n,{Z:()=>c,a:()=>t});var s=i(67294);const a={},l=s.createContext(a);function t(e){const n=s.useContext(l);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:t(e.components),s.createElement(l.Provider,{value:n},e.children)}}}]);