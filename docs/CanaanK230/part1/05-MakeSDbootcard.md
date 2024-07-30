---
sidebar_position: 5
---
# 制作SD卡镜像

硬件要求：

- DshanPI-CanMV开发板
- microSD卡（建议最小8G）
- Type-c数据线 

软件要求：

- DshanPI-CanMV开发板SD卡镜像
- SD卡格式化工具：[SD Memory Card Formatter](https://www.sdcard.org/downloads/formatter_4/eula_windows/)
- SD卡刷机工具：[ETCHER](https://www.balena.io/etcher)

开始前请下载DongshanPI-Vision开发板SD卡镜像，并记住它在计算机中保存的位置。

## 1.格式化microSD卡

将您的SD卡使用读卡器通过USB口插入您的PC电脑，使用SD卡格式化工具[SD Memory Card Formatter在新窗口打开](https://www.sdcard.org/downloads/formatter_4/eula_windows/)格式化您的SD卡。点击下图中红框位置，开始格式化内存卡。

![image-20230721165711205](http://photos.100ask.net/canaan-docs/image-20230721165711205.png)

点击完成后会弹出下图所示的提示框，该提示警告我们格式化将清空卡中的所有数据，询问我们是否继续，这里点击`是`

![image-20230721165954580](http://photos.100ask.net/canaan-docs/image-20230721165954580.png)

等待格式化完成后，会弹出以下对话框，提示我们格式化后的文件系统为`FAT32`以及内存大小可用空间，点击确定即可完成SD卡的格式化。

![image-20230721170207480](http://photos.100ask.net/canaan-docs/image-20230721170207480.png)



## 2.使用Etcher烧录镜像

 使用Etcher将DongshanPI-Vision开发板SD卡镜像写入您的microSD卡。

 下载[Etcher](https://www.balena.io/etcher)烧写工具并安装它。启动Etcher应用程序，启动后界面如下图所示：

![image-20230721170709568](http://photos.100ask.net/canaan-docs/image-20230721170709568.png)

点击`Flash from file`，如下图所示，点击下图红框处。

![image-20230721170746679](http://photos.100ask.net/canaan-docs/image-20230721170746679.png)

此时会弹出文件资源管理器，选择您刚刚下载的DongshanPI-Vision开发板SD卡镜像。

![image-20240724141908669](${images}/image-20240724141908669.png)

选择完成后会，显示下面的界面，点击下图中红框处`Select target`，选择要写入的目标microSD卡。

![image-20230721172244447](http://photos.100ask.net/canaan-docs/image-20230721172244447.png)

点击完成后会弹出选择目标，此时选择您通过读卡器插入电脑中的microSD卡。

![image-20230721172220680](http://photos.100ask.net/canaan-docs/image-20230721172220680.png)

选择完成后，会显示以下界面，点击`Flash`后即可开始烧写。

![image-20230721172614694](http://photos.100ask.net/canaan-docs/image-20230721172614694.png)

如下图所示等待烧写完成即可。

![image-20230721172653819](http://photos.100ask.net/canaan-docs/image-20230721172653819.png)

使用Etcher烧写完成后，Windows可能会不知道如何读取您的microSD卡，会弹出如下图所示警告，点击`取消`后拔出microSD卡即可。

![image-20230721172939202](http://photos.100ask.net/canaan-docs/image-20230721172939202.png)

## 3.启动SD卡系统

 将下图中的拨码开关的boot0拨为OFF和boot1拨为OFF，使开发板进入SD卡启动模式。将SD卡插入开发板的卡槽中，步骤如下图所示：

![image-20240729192113280](${images}/image-20240729192113280.png)



使用一条Type-C线连接开发板端和电脑端，用于给开发板进行供电和使用串口登录开发板控制台。

![image-20240729192136327](${images}/image-20240729192136327.png)

使用串口软件查看串口控制台，成功启动后会进入开发板控制台。