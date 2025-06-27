---
sidebar_position: 2
---
# DshanPI-CanMV_V2 快速启动

## 硬件要求

### 盒子里包括的内容

当您购买了一套全新的DshanPI-CanMV_V2套件时，包装盒内会有：

1. DshanPI-CanMV开发板
2. 一根Type-C数据线

### 盒子中不包含的内容

您还需要额外的：

1. MIPI显示屏
2. 一个MIPI摄像头

> 注意：使用时还需要一台正常工作且能连接互联网的PC电脑。

## 连接摄像头

要使用摄像头获取图像数据，如果您只单独购买了DshanPI-CanMV开发板，可能还需另外购买摄像头。下面图片是将摄像头连接到DshanPI-CanMV开发板的指南。

![image-20250329141742541](${images}/image-20250329141742541.png)

## 连接显示屏

要使用显示屏显示摄像头获取的图像，如果您只单独购买了DshanPI-CanMV开发板，可能还需另外购买MIPI显示屏。下面是将MIPI显示屏连接到DshanPI-CanMV开发板的指南。

![image-20250329142149402](${images}/image-20250329142149402.png)

## 开发板首次启动

 通过Type-C线将板连接到PC电脑，您可以使用DshanPI-CanMV盒子中的的Type-C线。连接指南如下所示：

![image-20250627093612460](${images}/image-20250627093612460.png)

> 注意：需要将拨码开关调整为Boot0为ON,Boot1为OFF；并将电源开关拨向Type-C线方向。

### 第一次启动

一旦开发板套件通电后，等待系统启动后可以在文件资源管理器中看到`CanMV`设备，在设备管理器看到USB串行设备。

![image-20250329144710055](${images}/image-20250329144710055.png)



### 下载并安装IDE开发工具

​	进入嘉楠开发者社区下载IDE开发工具：[嘉楠开发者社区下载中心](https://developer.canaan-creative.com/zh/resource?selected=0-2-1)

![image-20250329145733348](${images}/image-20250329145733348.png)

> 如果`CANMV IDE K230 for windows `工具更新了版本，请下载最新的版本！

​	下载完成后会获得`exe`安装包，可双击安装包后，安装至电脑中。安装完成后可打开IDE工具`CanMV IDE K230`，打开IDE后会进入如下界面。

![image-20250329150817380](${images}/image-20250329150817380.png)

点击上图中红框位置的连接开发板按钮。连接完成后，可以看到运行程序按钮变成绿色。

![image-20250329150943785](${images}/image-20250329150943785.png)

可点击串行终端看到设备管理器中USB串行设备的输出，可以点击上图中的绿色按钮，可运行默认的打印程序，如下所示：

![image-20250329151709053](${images}/image-20250329151709053.png)

后续可在此IDE下进行MicroPython编程。



官方例程讲解教程：https://developer.canaan-creative.com/k230_canmv/zh/main/zh/example/index.html



## [拓展]访问开发板的串口

硬件要求：

- USB转UART串口模块
- Type-C转双串口模块

软件注意事项：

- MicroPython系统（默认）：UART0
- RT-smart系统：UART0
- Linux系统：UART0
- Rt-smart+Linux双系统：UART0(Linux小核)，UART3(Rt-smart大核)



### 使用Type-C访问串口

将Type-C数据线接入Type-C双串口模块，杜邦线端接入USB转串口模块。连接成功后，USB转串口模块需要接入电脑，使用电脑访问串口模块，波特率为115200。

> 注意：
>
> - Type-C双串口模块的RX需要连接USB转串口模块的TX。
> - Type-C双串口模块的TX需要连接USB转串口模块的RX。
> - Type-C双串口模块的GND需要连接USB转串口模块的GND。

![image-20250627100241144](${images}/image-20250627100241144.png)

> - MicroPython系统：只有UART0作为系统串口输出。
> - RT-smart系统：只有UART0作为系统串口输出。
> - Linux系统：只有UART0作为系统串口输出。
> - Rt-smart+Linux双系统：UART0作为Linux小核系统输出，UART3作为Rt-smart大核系统输出。

### 使用拓展排针访问串口

在拓展排针上，硬件也将UART0和UART3引到了拓展排针上，即您可以使用USB转UART串口使用杜邦线连接拓展排针上的串口进行访问，可以查看硬件原理图中拓展排针部分，可知UART0和UART3的位置：

![image-20250627102544058](${images}/image-20250627102544058.png)

下面展示如何通过拓展排针访问UART0:

![image-20250627104141126](${images}/image-20250627104141126.png)

实际连接图如下所示：
![image-20250627104829720](${images}/image-20250627104829720.png)

> - MicroPython系统：只有UART0作为系统串口输出。
> - RT-smart系统：只有UART0作为系统串口输出。
> - Linux系统：只有UART0作为系统串口输出。
> - Rt-smart+Linux双系统：UART0作为Linux小核系统输出，UART3作为Rt-smart大核系统输出。

下面展示如何通过拓展排针访问UART3:

![image-20250627104348893](${images}/image-20250627104348893.png)

实际连接图如下所示：

![image-20250627144635760](${images}/image-20250627144635760.png)

> - MicroPython系统：只有UART0作为系统串口输出。
> - RT-smart系统：只有UART0作为系统串口输出。
> - Linux系统：只有UART0作为系统串口输出。
> - Rt-smart+Linux双系统：UART0作为Linux小核系统输出，UART3作为Rt-smart大核系统输出。
