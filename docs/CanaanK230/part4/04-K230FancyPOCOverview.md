---
sidebar_position: 3
---
# 4. K230 Fancy POC 概述

本章节提供了多个使用K230开发板的POC工程搭建流程，展示了K230强大的能力，为用户使用K230搭建POC提供了思路。

## 4.1 概述

K230 Fancy Poc集合包括multimodal_chat_robot(多模态聊天机器人)、meta_human(数字人)、meta_hand(手势渲染)和finger_reader(指读)等项目。

## 4.2 源码位置

源码路径位于k230 sdk根目录下的`src/reference/fancy_poc`（[k230_sdk/src/reference/fancy_poc at main · kendryte/k230_sdk (github.com)](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc)）或[src/reference/fancy_poc · kendryte/k230_sdk - 码云 - 开源中国 (gitee.com)](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc)，关于每个POC的介绍:

**ai_scale** ：K230模拟AI电子秤  

- github：[ai_scale](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/ai_scale)  

- gitee：[ai_scale](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/ai_scale)

face_recognition :K230人脸识别系统  

- github:[face_recognition](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/face_recognition)  
- gitee:[face_recognition](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/face_recognition)

finger_reader ：K230指读工程  

- github:[finger_reader](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/finger_reader)  
- gitee[finger_reader](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/finger_reader)

housekeeper  智能管家系统  

- github：[housekeeper](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/housekeeper)  
- gitee：[housekeeper](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/housekeeper)

meta_hand  K230手势渲染工程

- gitHub：  [meta_hand](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/meta_hand) 
- gitee: [meta_hand](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/meta_hand)

meta_human  K230虚拟数字人  

- github:[meta_human](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/meta_human)  
- gitee:[meta_human](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/meta_human)

multimodal_chat_robot  K230多模态聊天机器人  

- github:[multimodal_chat_robot](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/multimodal_chat_robot)  
- gitee:[multimodal_chat_robot](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc/multimodal_chat_robot)

## 4.3 编译及运行程序

**本章节基于[kendryte/k230_sdk: Kendryte K230 SDK (github.com)](https://github.com/kendryte/k230_sdk/tree/main)或[k230_sdk: Kendryte K230 SDK (Gitee.com)](https://gitee.com/kendryte/k230_sdk/tree/main)的最新版本源码实现。**

### 4.3.1. 自编译镜像上板流程

- 按照[kendryte/k230_sdk: Kendryte K230 SDK (github.com)](https://github.com/kendryte/k230_sdk/tree/main)或[k230_sdk: Kendryte K230 SDK (Gitee.com)](https://gitee.com/kendryte/k230_sdk/tree/main)构建docker容器，编译上板镜像；

  ```
  # 下载docker编译镜像
  docker pull ghcr.io/kendryte/k230_sdk
  # 可以使用以下命令确认docker镜像是否拉取成功
  docker images | grep ghcr.io/kendryte/k230_sdk
  # 下载sdk源码
  git clone https://github.com/kendryte/k230_sdk.git
  cd k230_sdk
  # 下载工具链Linux和RT-Smart toolchain, buildroot package, AI package等
  make prepare_sourcecode
  # 创建docker容器，$(pwd):$(pwd)表示系统当前目录映射到docker容器内部的相同目录下，将系统下的工具链目录映射到docker容器内部的/opt/toolchain目录下
  docker run -u root -it -v $(pwd):$(pwd) -v $(pwd)/toolchain:/opt/toolchain -w $(pwd) ghcr.io/kendryte/k230_sdk /bin/bash
  make CONF=k230_canmv_defconfig
  ```

  

- 请您耐心等待镜像编译成功后，在k230_sdk根目录/output/k230_canmv_defconfig/images中下载编译好的镜像，并将其烧录到SD卡中，烧录步骤参考[镜像烧录](https://www.kendryte.com/k230_canmv/dev/zh/CanMV-K230快速入门指南.html#id5)：

  ```
  k230_canmv_defconfig/images
   ├── big-core
   ├── little-core
   ├── sysimage-sdcard.img    # SD卡启动镜像
   └── sysimage-sdcard.img.gz # SD卡启动镜像压缩包
  ```

  

- 在docker内部进入k230_sdk根目录，执行下述命令，编译fancy poc部分：

  ```
  cd src/reference/fancy_poc
  # 如果build_app.sh权限不足，执行chmod +x build_app.sh
  ./build_app.sh
  ```

  

- 在src/reference/fancy_poc/k230_bin中，选择对应poc编译的文件，包括大核上运行的elf和小核上运行的可执行文件；

- 如果需要拷贝的文件超过开发板可用大小，需要进行重新分区操作；

  ***注：***

  1.sharefs是大小核共用目录，通过对大小核各自/sharefs目录的访问，提供了大核访问小核文件系统的功能。在实际使用中，通常会将大核的可执行程序存放在/sharefs目录下，大核通过sharefs功能执行这些程序，方便大核上应用程序的开发和调试；参考：[K230大小核通讯Sharefs使用简介](https://www.kendryte.com/k230/dev/zh/02_applications/tutorials/K230_大小核通讯_sharefs用法介绍.html)。

  2.为了保证系统空间，最后一个disk的空间大小可能不足以存放所有文件；您可以使用下述命令修改最后一个分区大小；参考：[K230 SDK常见问题解答](https://www.kendryte.com/k230/dev/zh/03_other/K230_SDK常见问题解答_C.html#linux) 问题9。

  ```
  umount /sharefs/
  parted   -l /dev/mmcblk1
  # 31.3GB大小请参考上一条命令输出的 Disk /dev/mmcblk1
  parted  -a minimal  /dev/mmcblk1  resizepart 4  31.3GB
  mkfs.ext2 /dev/mmcblk1p4
  mount /dev/mmcblk1p4 /sharefs
  ```

  

- 分区结束后，重启开发板，在小核sharefs下新建目录test_poc，选择读卡器拷贝或者scp拷贝，因传输较慢不推荐使用tftp拷贝；

- 选择您感兴趣的POC，阅读[k230_sdk/src/reference/fancy_poc at main · kendryte/k230_sdk (github.com)](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc)下不同POC子目录的文档，按照文档说明下载POC对应的文件，结合上面编译出来的elf和可执行文件，完成上板操作；

### 4.3.2. 免编译镜像上板流程

- 选择[嘉楠开发者社区](https://www.kendryte.com/resource)->资料下载->K230->Images提供的镜像烧录，k230_sdk版本和nncase版本对应关系如下链接：

  [**K230 SDK nncase版本对应关系 — K230 文档 (canaan-creative.com**](https://www.kendryte.com/k230/dev/zh/03_other/K230_SDK_nncase版本对应关系.html)

  镜像烧录请参考[镜像烧录](https://www.kendryte.com/k230_canmv/dev/zh/CanMV-K230快速入门指南.html#id5)。

- 按照[kendryte/k230_sdk: Kendryte K230 SDK (github.com)](https://github.com/kendryte/k230_sdk/tree/main)或[k230_sdk: Kendryte K230 SDK (Gitee.com)](https://gitee.com/kendryte/k230_sdk/tree/main)构建docker容器；

  ```
  # 下载docker编译镜像
  docker pull ghcr.io/kendryte/k230_sdk
  # 可以使用以下命令确认docker镜像是否拉取成功
  docker images | grep ghcr.io/kendryte/k230_sdk
  # 下载sdk源码
  git clone https://github.com/kendryte/k230_sdk.git
  cd k230_sdk
  # 下载工具链Linux和RT-Smart toolchain, buildroot package, AI package等
  make prepare_sourcecode
  # 创建docker容器，$(pwd):$(pwd)表示系统当前目录映射到docker容器内部的相同目录下，将系统下的工具链目录映射到docker容器内部的/opt/toolchain目录下
  docker run -u root -it -v $(pwd):$(pwd) -v $(pwd)/toolchain:/opt/toolchain -w $(pwd) ghcr.io/kendryte/k230_sdk /bin/bash
  make mpp
  make CONF=k230_canmv_defconfig prepare_memory；
  ```

  

  mpp编译相对于镜像编译耗时要少很多；

- 在docker内部进入k230_sdk根目录，执行下述命令，编译fancy poc部分：

  ```
  cd src/reference/fancy_poc
  # 如果build_app.sh权限不足，执行chmod +x build_app.sh
  ./build_app.sh
  ```

  

- 在src/reference/fancy_poc/k230_bin中，选择对应poc编译的文件，包括大核上运行的elf和小核上运行的可执行文件；

- 如果需要拷贝的文件超过开发板可用大小，需要进行重新分区操作；

  ***注：***

  1.sharefs是大小核共用目录，通过对大小核各自/sharefs目录的访问，提供了大核访问小核文件系统的功能。在实际使用中，通常会将大核的可执行程序存放在/sharefs目录下，大核通过sharefs功能执行这些程序，方便大核上应用程序的开发和调试；参考：[K230大小核通讯Sharefs使用简介](https://www.kendryte.com/k230/dev/zh/02_applications/tutorials/K230_大小核通讯_sharefs用法介绍.html)。

  2.为了保证系统空间，最后一个disk的空间大小可能不足以存放所有文件；您可以使用下述命令修改最后一个分区大小；参考：[K230 SDK常见问题解答](https://www.kendryte.com/k230/dev/zh/03_other/K230_SDK常见问题解答_C.html#linux) 问题9。

  ```
  umount /sharefs/
  parted   -l /dev/mmcblk1
  # 31.3GB大小请参考上一条命令输出的 Disk /dev/mmcblk1
  parted  -a minimal  /dev/mmcblk1  resizepart 4  31.3GB
  mkfs.ext2 /dev/mmcblk1p4
  mount /dev/mmcblk1p4 /sharefs
  ```

  

- 分区结束后，重启开发板，在小核sharefs下新建目录test_poc，选择读卡器拷贝或者scp拷贝，因传输较慢不推荐使用tftp拷贝；

- 选择您感兴趣的POC，阅读[k230_sdk/src/reference/fancy_poc at main · kendryte/k230_sdk (github.com)](https://github.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc)或[src/reference/fancy_poc · kendryte/k230_sdk - 码云 - 开源中国 (gitee.com)](https://gitee.com/kendryte/k230_sdk/tree/main/src/reference/fancy_poc)下不同POC子目录的文档，按照文档说明下载POC对应的文件，结合上面编译出来的elf和可执行文件，完成上板操作；

> **＠You**：
>
> AI Demo章节和Fancy POC章节旨在展示K230在AI领域的强大性能和广泛应用场景。虽然我们提供了相关源代码供用户参考，但这些源码多是基于特定Demo或POC任务场景的实现。
>
> 对于希望深入了解K230人工智能开发流程的用户，建议学习[第5章](https://www.kendryte.com/ai_docs/zh/main/fast_learn)和[第6章](https://www.kendryte.com/ai_docs/zh/main/K230_Fancy_POC概述.html#teach_ai)。在这两章中，我们详细讲解了K230的多媒体应用、AI推理流程以及基于K230的人工智能开发流程，从代码层面全面解析了K230的AI开发知识。