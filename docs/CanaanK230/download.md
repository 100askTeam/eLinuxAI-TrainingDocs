---
sidebar_position: 2
---
# 开发板资料下载

DshanPI-CanMV开发板配套的软件、源码、原理图、芯片手册、工具包等，都可访问以下资料获取。

资料获取链接：https://pan.baidu.com/s/1VBd0n3FKO0bj8yHOWk4HEw?pwd=ov5d 提取码：ov5d 

> 注意：获取资料后请一定阅读下面的文档了解资料中包含那些内容。



资料包组成：

```
01_学习手册
02_开发工具
03_开发板系统固件
04_开发板原理图
05_芯片手册
06_K230配套SDK
07_核心板封装库
08_底板参考工程
09_音视频测试资源文件
```



## 1.学习手册

该文件夹中保存有学习站点的链接。

DshanPI-CanMV开发板配套的文档都保存在：https://eai.100ask.net/CanaanK230/Userdoc



## 2.开发工具

该文件夹中保存有以下内容：

```
【Windows】VMwareWorkstation安装包
【Windows】USB串口驱动
【Windows】TF卡烧录工具
【Windows】SD卡格式化工具
【Windows】MobaXterm(串口工具 ssh工具合集)
【Windows】K230烧录驱动zadig-2.8
【Windows】K230烧录工具
【Vmware】原始的Ubuntu20.04
【VMware】搭建好所有环境的Ubuntu20.04
```

- 【Windows】VMwareWorkstation安装包：虚拟化软件，可安装此软件包运行虚拟机
- 【Windows】USB串口驱动：可用于安装电脑的串口驱动
- 【Windows】TF卡烧录工具：用于烧写系统固件至TF卡
- 【Windows】SD卡格式化工具：用于格式化内存卡
- 【Windows】MobaXterm(串口工具 ssh工具合集)：用于访问开发板的串口
- 【Windows】K230烧录驱动zadig-2.8：用于安装开发板的烧录驱动
- 【Windows】K230烧录工具：可用于将系统烧录至开发板的EMMC中。
- 【Vmware】原始的Ubuntu20.04：可使用Vmware软件打开，启动后为Ubuntu20.04的最小系统
- 【VMware】搭建好所有环境的Ubuntu20.04：可使用Vmware软件打开，启动后为安装好K230 SDK环境的Ubuntu20.04。

> 注意：
>
> - Ubuntu的用户名和密码均为： ubuntu
> - 如果使用搭建好所有环境的Ubuntu，请启动后重新获取最近的源码。



## 3.开发板系统固件

该文件夹中保存有以下内容：

```
loader-canmv-dongshanpi.bin
DshanPI-CanMV-512MB_V1.1.zip
DshanPI-CanMV-1GB_V1.1.zip
```

- loader-canmv-dongshanpi.bin：用于开发板烧录EMMC系统，引导固件烧录。
- DshanPI-CanMV-512MB_V1.1.zip：开发板系统固件：可用于512MB内存的硬件。
- DshanPI-CanMV-1GB_V1.1.zip：开发板系统固件：可用于1GB内存的硬件。



## 4.开发板原理图

该文件夹中保存有以下内容：

```
K230-Core-Open_SCH_V1.pdf
DshanPIxCanMV_SCH_V1.pdf
```

- K230-Core-Open_SCH_V1.pdf：K230核心板硬件原理图
- DshanPIxCanMV_SCH_V1.pdf：K230底板硬件原理图



## 5.芯片手册

该文件夹中保存有以下内容：

```
K230_datasheet.pdf
```

- K230_datasheet.pdf：K230芯片的数据手册。



## 6.K230配套SDK

> 注意：获取SDK建议使用Git方式获取最新版本！！！

该文件夹中保存有以下内容：

```
磁盘镜像工具安装包genimage-16
k230_sdk.tar.gz
```

- 磁盘镜像工具安装包genimage-16：搭建SDK环境时需要用到的软件包
- k230_sdk.tar.gz：K230开发板的SDK源码。



## 7.核心板封装库

该文件夹中保存有以下内容：

```
K230_Mainboard_V10.PcbLib
```

- K230_Mainboard_V10.PcbLib：如果您想基于K230 核心板设计自己硬件，可直接将核心板封装库导入。



## 8.底板参考工程

该文件夹中保存有以下内容：

```
DshanPIxCanMV_BaseBoard_V1.zip
```

- DshanPIxCanMV_BaseBoard_V1.zip：开发板的硬件工程源文件，如果您想使用K230核心板设计自己的产品，可将此工程作为您的设计参考。