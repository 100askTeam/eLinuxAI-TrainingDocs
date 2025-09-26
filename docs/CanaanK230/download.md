---
sidebar_position: 2
---
# 开发板资料下载

DshanPI-CanMV开发板配套的软件、源码、原理图、芯片手册、工具包等，都可访问以下资料获取。

DshanPI-K230_BTB_EVB评估板链接: https://pan.baidu.com/s/1jU1_09tT0NnJ4LlUip2a2w?pwd=4tvy 提取码: 4tvy

CANMV_V2开发板资料获取链接: https://pan.baidu.com/s/11X-iiLop80RiqobQ0zgdAQ?pwd=root 提取码: root 

CANMV_V1开发板资料获取链接：https://pan.baidu.com/s/1VBd0n3FKO0bj8yHOWk4HEw?pwd=ov5d 提取码：ov5d 

> 注意：获取资料后请一定阅读下面的文档了解资料中包含那些内容。



资料包组成：

```
01_学习手册
02_开发工具
03_开发板系统固件
04_MicroPython例程源码
05_开发板原理图
06_芯片手册
07_核心板封装库
08_底板参考工程
09_多媒体应用示例源码
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
01_MicroPython固件
02_RT-smart+Linux双系统固件
03_Linux系统固件
```

- 01_MicroPython固件：包含MicroPython系统固件，适用于小白和零基础开发者
- 02_RT-smart+Linux双系统固件：包含RT-smart+Linux双系统固件，适用于有一定基础的开发者
- 03_Linux系统固件：包含Linux系统固件，适用于具备一定的开发能力的开发者



## 4.MicroPython例程源码

```
01_入门实验/  
	01_helloworld/ 
	02_RTC设置时间/  
	03_ADC电压测量/  
	04_timer软定时器/  
	05_pin引脚控制/  
	06_UART串口通信/  
	07_thread线程/  
	08_wdt看门狗/
	09_PWM/
	10_Touch
02_摄像头实验/ 
	01_摄像头抓图/  
	02_摄像头实时预览/
	03_绘制实验/
	04_洪水填充区域
03_特征检测/  
	01_边缘检测/  
	02_直线检测/ 
    03_圆形检测/
	04_矩形检测/  
	05_快速线性回归/
05_颜色处理/  
	01_单色跟踪/  
	02_多色跟踪/  
	04_机器人巡线/  
06_条形码处理/  
	01_条形码检测/  
	02_二维码识别/  
	03_AprilTag检测/  
	04_AprilTag姿态检测/
07_AI视觉实验/  
	01_人形处理/  
		01-1_人形检测/  
		01-2_人体关键点检测/  
		01-3_跌倒检测/
	02_人脸处理/ 
    	02-1_人脸检测/  
    	02-2_人脸轮廓检测/  
    	02-3_3D人脸网格/  
    	02-4_人脸注视方向检测/  
    	02-5_人脸解析/  
    	02-6_人脸姿态估计/  
    	02-7_人脸识别/
	03_手部处理/  
		03-1_手掌检测/  
		03-2_手势识别/  
		03-3_手掌关键点检测/  
		03-4_手掌关键点分类/  
		03-5_动态手势识别贴图/  
		03-6_手势区域裁剪/  
		03-7_石头剪刀布模拟器/  
		03-8_拼图游戏/
	04_车牌处理/  
		04-1_车牌检测/  
		04-2_车牌识别/
	05_OCR文字/  
		05-1_OCR文字检测/  
		05-2_OCR文字识别/
	06_YOLOV8/
    	06-1_目标检测/  
    	06-2_目标分割/
	07_实时跟踪/  
	08_自学习/
07_多媒体应用/
	01_录制MP4视频/
	02_播放MP4视频/
	03_录制音频/
	04_播放音频
08_网络应用/
	01-有线网络
09_AICube示例/
	01_图像分类/  
	02_多标签分类/  
	03_目标检测/  
	04_OCR文字检测/  
	05_语义分割/  
	06_自学习分类/
```

上述例程为验证测试通过的MicroPython程序。



## 5.开发板原理图

该文件夹中保存有以下内容：

```
K230-Core-Open_SCH_V1.pdf
DshanPIxCanMV_SCH_V1.pdf
```

- K230-Core-Open_SCH_V1.pdf：K230核心板硬件原理图
- DshanPI_CanMV_V2.0底板硬件图：K230底板硬件原理图
- DshanPI_CanMV_V2.0底板位号图:K230底板硬件位号图


## 6.芯片手册

该文件夹中保存有以下内容：

```
K230_datasheet.pdf
```

- K230_datasheet.pdf：K230芯片的数据手册。



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





## 9.RTSmart+Linux双系统资料

```
01_SDK源码
02_多媒体应用RT-smart示例源码
```

- 01_SDK源码：RTSmart+Linux双系统 SDK
- 02_多媒体应用RT-smart示例源码：多媒体应用源码