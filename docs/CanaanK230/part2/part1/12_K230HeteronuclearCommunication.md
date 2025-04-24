---
sidebar_position: 12
---
# K230 异核通信 Demo使用指南

Demo 主要实现 K230 异构核间通讯，包含 IPCMSG , DataFIFO 两种方式，其中 IPCMSG 主要用于发送控制类消息；DataFIFO 主要应用于大量数据交互（例如编码数据）通信。

## 1. IPCMSG Demo

IPCMSG 是 K230 大小核在用户态进行通讯的组件，主要用于发送控制类消息。该模块包括服务添加删除，消息创建删除，断开连接，发送消息等功能。支持三种消息发送方式，发送异步消息，发送同步消息，以及发送不需要对方回复的消息。其中同步消息支持超时机制，用户调用 API 时可自定义设置超时时间。需要得到回复的消息，在发出 60 秒之后才收到回复消息的话，该回复消息会被丢弃。本 Demo 主要展现小核发送三种消息给大核，大核接收到消息后，根据消息类型进行处理和返回结果，Demo代码主要实现：

1. 大小核建立通讯 ,即建立 2 个 IPCMSG 通讯服务 Test1 和 Test2（log 中对应 id 号3 和 4），每一个 IPCMSG 服务对应一个接收线程
2. 小核创建 2 个线程分别使用不同通信服务来发送同步/异步消息，其中异步信息分别为仅发送消息不设置回调函数，和发送消息并设有回调函数
3. 大核接收到信息之后，会根据消息类型进行处理回复
4. 小核收到回复消息后，唤醒线程打印接收到回复消息

操作步骤如下：

1、大核执行：`/sharefs/app/sample_receiver.elf`



2、小核进入 /mnt，然后执行：`./sample_sender`



3、可按“q”键 、回车键退出 Demo

- 小核 log：

  ```shell
  [root@canaan /mnt ]#./sample_sender
  -----Connect: 1
  -----Connect: 0
  Run...
  id:3 send sync: module:1 cmd:03000001 time use:10.895ms
  receive sync resp: modle:1, cmd:03000001, have done., return:0
  sendasync modle:2 cmd:03000001
  receive async resp: modle:2, cmd:03000001, have done., return:0
  sendonly modle:2 cmd:03000001
  Run...
  id:3 send sync: module:1 cmd:03000002 time use:4.120ms
  receive sync resp: modle:1, cmd:03000002, have done., return:0
  sendasync modle:2 cmd:03000002
  id:4 send sync: module:1 cmd:04000003 time use:0.301ms
  ```

- 大核 log：

  ```shell
  receive sync resp: modle:1, cmd:04000003, done., return:0
  receive async resp: modle:2, cmd:03000002, have done., return:0
  sendonly modle:2 cmd:03000002
  sendasync modle:2 cmd:04000003
  receive async resp: modle:2, cmd:04000003, done., return:0
  sendonly modle:2 cmd:04000003
  id:3 send sync: module:1 cmd:03000004 time use:3.857ms
  receive sync resp: modle:1, cmd:03000004, have done., return:0
  sendasync modle:2 cmd:03000004
  receive async resp: modle:2, cmd:03000004, have done., return:0
  id:4 send sync: module:1 cmd:04000005 time use:1.111ms
  receive sync resp: modle:1, cmd:04000005, done., return:0
  ```

- 对应的大核 log：

  ```shell
  msh /sharefs/app>sample_receiver.elf
  msh /sharefs/app>
  Press q to quit
  start receive msg from 3
  start receive msg from 4
  receive msg from 3: sync 0, len: 16
  receive msg from 3: async 0, len: 16
  receive msg from 3: only 0, len: 16
  receive msg from 3: sync 1, len: 16
  receive msg from 4: sync 2, len: 16
  receive msg from 3: async 1, len: 16
  receive msg from 4: async 2, len: 16
  receive msg from 3: only 1, len: 16
  receive msg from 3: sync 3, len: 16
  receive msg from 4: only 2, len: 16
  receive msg from 3: async 3, len: 16
  receive msg from 4: sync 4, len: 16
  ```

## 2.DataFIFO Demo

DataFIFO 是 K230 大小核在用户态进行大量数据交互（例如编码数据）时，使用的核间通讯组件。内部主要使用共享内存来完成数据的交互，数据传递的是指针，不会拷贝数据的内容，数据的收发通知依靠线程轮询来实现，本 Demo 主要实现：

1. 大小核分别建立 2 个 DataFIFO，1 路读通道，1 路写通道，并建立连接
2. 大核往 DataFIFO buf 按如下代码规则写数据，其中 g_s32Index 随着每次循环+1，小核去读取 snprintf(buf, BLOCK_LEN, "%d", g_s32Index)
3. 小核往发送 DataFIFO buf 按如下代码规则写数据，其中 g_s32Index 随着每次循环+1，大核读取 snprintf(buf, BLOCK_LEN, "%d", g_s32Index)



操作步骤如下：

1、大核执行：`/sharefs/app/sample_writer.elf`，此时 log 会打印 2 个物理地址

```shell
msh />/sharefs/app/sample_writer.elf
PhyAddr: 10000000
PhyAddr: 10003000
datafifo_init finish
press any key to start. 
```



2、小核进入/mnt，然后执行：`./sample_reader 0x10000000 0x10003000`，0x10000000 是读地址， 0x10003000 是写地址，地址与大核 log 的物理地址一致

```shell
[root@canaan /mnt ]#./sample_reader 0x10000000 0x10003000
datafifo_init finish
press any key to start. 
```



3、此时大核和小核串口中断按提示输入任何按键，开启 DataFIFO 数据传输

- 小核 log：

  ```shell
  receive:********0********
  receive:********1********
  receive:********2********
  Input q to exit:
  send: ========0========
  send: ========1========
  receive:********3********
  release 0x3fcf7070e0
  release 0x3fcf7074e0
  send: ========2========
  receive:********4********
  receive:********5********
  ```



- 大核 log：

  ```shell
  send: ********0********
  Input q to exit:
  send: ********1********
  send: ********2********
  release 0x1000000e0
  release 0x1000004e0
  release 0x1000008e0
  send: ********3********
  receive:========0========
  receive:========1========
  release 0x100000ce0
  send: ********4********
  send: ********5********
  receive:========2========
  ```



3、可按“q”键回车后，再按任意按键释放资源，并退出 Demo 执行。



## 3.MAPI Demo

MAPI（Media Application Programming Interface） 是对 MPI(Media Process Platform Programming Interface) 接口和功能模块做了提炼和抽象，简化繁琐的多媒体处理平台库调用流程，支持应用软件快速开发输入音视频捕获、H264/H265/JPEG/ 音频编码，音视频解码输出等多媒体功能。同时 MAPI 支持跨 OS 调用，即 K230 的大小核上均可调用相同的 API 来实现需要的应用场景（MAPI 实现的功能可查看 GitHub 接口文档 ：[K230 SDK_Docs_MAPI](https://github.com/kendryte/k230_docs/blob/main/zh/01_software/board/cdk/K230_系统控制_MAPI参考.md) ）。以下 Demo 展示了 MAPI 的使用方式，其中大核作为服务端通过 MPP 操作硬件设备，小核作为设备端向大核发送操作请求。



### 3.1 MAPI 视频编码

sample_venc Demo 小核通过调用 MAPI 编码接口，将大核 Camera 采集的图像进行编码，并保存成文件。Demo 最大支持 3 通道输出，支持 H264、H265，JPGE 编码，但暂不支持同时 3 通道编码不同的格式，其主要参数说明：

| **参数说明** | **可选参数值** | **参数说明**                                                 |
| ------------ | -------------- | ------------------------------------------------------------ |
| -s           | 3              | sensor 型号，默认使用 3                                      |
| -n           | 1，2，3        | 输出通道数，比如设置为 3，则 3 个通道同时编码输出            |
| -t           | 0，1，2        | 0：h264 type，1：h265 type，2：jpeg type                     |
| -o           | NA             | 指定编码生成的文件目录，然后根据不同的编码类型，会在小核指定的输出目录下 生成不同的码流文件，对于h264类型，会生成形如 stream_chn0.264 文件，其中 0 代表 0 通道；对于h265类型，会生成形如 stream_chn0.265 文件，同样 0 代表0 通道；对于 jpeg 类型，会生成形如 chn0_0.jpg 的 jpg 图片，代表 0 通道第 0 张图片， 默认会生成 10 张 jpg 图片 |



操作步骤如下：

1、在大核侧启动核间通信进程，进入 /sharefs/app，执行 `./sample_sys_init.elf`



2、在小核侧 /mnt 目录下，执行 `./sample_venc -s 3 -n 3 -t 0 -o /sharefs`，3 通道同时进行 H264 编码，且在 /sharefs下生成不同分辨率的编码文件：

- 一路：分辨率 1280*720，生成文件：/sharefs/stream_chn0.264
- 二路：分辨率 960*640，生成文件：/sharefs/stream_chn1.264
- 三路：分辨率 640*480，生成文件：/sharefs/stream_chn2.264



3、执行一段时间后按【ctrl+c】退出 Demo 执行



4、将生成的编码文件通过 `scp` 命令拷贝到上位机，再下载到本地 PC 播放，例如使用 ffplay 工具进行播放



### 3.2 MAPI 视频解码

MAPI 视频解码

Demo 主要展示将小核的编码文件通过 MAPI 接口给大核解码并通过 LCD 屏幕显示，其操作步骤：

1. 在大核侧启动核间通信进程，进入 /sharefs/app，执行 `./sample_sys_init.elf`
2. 在小核侧 /mnt 目录下，执行 `./sample_vdec -i /sharefs/test_resource/canaan.264`，将编码文件通过 MAPI 传递给大核解码并播放



MAPI 音频编码

Demo 主要展示小核通过调用 MAPI 接口，将大核采集音频数据并进行编码，并保存成文件。其操作步骤如下：

1. 上位机执行播放音频操作，默认音频文件是 /home/user/hellocannan.wav，也可以【文件上传】按钮手动上传音频文件，执行播放音频命令：`audio_aplay /home/user/hellocannan.wav`
2. 在大核侧启动核间通信进程，进入 /sharefs/app，执行 `./sample_sys_init.elf`
3. 在小核侧 /mnt 目录下，执行 `./sample_audio -type 0 -filename /sharefs/test.g711a`（采样率44100，16bit）进行采集编码
4. 按键盘“q”回车退出 Demo 执行
5. 将编码生成的 test.g711a 通过 `scp` 命令拷贝到上位机，再下载到本地 PC 播放
6. 本地PC采用采用音视频软件分析，其中参数设置如下，然后播放该录制的音频：
   - 【编码】：A-Law
   - 【字节序】：默认尾端（endianness）
   - 【声道】：2 声道（立体声）
   - 【采样率】：44100