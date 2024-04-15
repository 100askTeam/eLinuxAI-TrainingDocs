---
sidebar_position: 11
---
# 数据层-数据采集

### 1.1 视频数据采集-V4L2

#### 1.1.1 数据采集流程

可以参考这些文件：

* mjpg-streamer\mjpg-streamer-experimental\plugins\input_control\input_uvc.c
* video2lcd\video\v4l2.c

Video for Linux two(Video4Linux2)简称V4L2，是V4L的改进版。V4L2支持三种方式来采集图像：内存映射方式(mmap)、直接读取方式(read)和用户指针。内存映射的方式采集速度较快，一般用于连续视频数据的采集，实际工作中的应用概率更高；直接读取的方式相对速度慢一些，所以常用于静态图片数据的采集；用户指针使用较少，如有兴趣可自行研究。

#### 1.1.2 buffer的管理

使用摄像头时，核心是"获得数据"。所以先讲如何获取数据，即如何得到buffer。

摄像头采集数据时，是一帧又一帧地连续采集。所以需要申请若干个buffer，驱动程序把数据放入buffer，APP从buffer得到数据。这些buffer可以使用链表来管理。

驱动程序周而复始地做如下事情：

* 从硬件采集到数据
* 把"空闲链表"取出buffer，把数据存入buffer
* 把含有数据的buffer放入"完成链表"

APP也会周而复始地做如下事情：

* 监测"完成链表"，等待它含有buffer
* 从"完成链表"中取出buffer
* 处理数据
* 把buffer放入"空闲链表"

链表操作示意图如下：

![image-20230617171816630](http://photos.100ask.net/eLinuxAI-TrainingDocs/05_buffers-1700192997818-3.png)

#### 1.1.2 完整的使用流程

参考mjpg-streamer和video2lcd，总结了摄像头的使用流程，如下：

* open：打开设备节点/dev/videoX
* ioctl VIDIOC_QUERYCAP：Query Capbility，查询能力，比如
  * 确认它是否是"捕获设备"，因为有些节点是输出设备
  * 确认它是否支持mmap操作，还是仅支持read/write操作
* ioctl VIDIOC_ENUM_FMT：枚举它支持的格式
* ioctl VIDIOC_S_FMT：在上面枚举出来的格式里，选择一个来设置格式
* ioctl VIDIOC_REQBUFS：申请buffer，APP可以申请很多个buffer，但是驱动程序不一定能申请到
* ioctl VIDIOC_QUERYBUF和mmap：查询buffer信息、映射
  * 如果申请到了N个buffer，这个ioctl就应该执行N次
  * 执行mmap后，APP就可以直接读写这些buffer
* ioctl VIDIOC_QBUF：把buffer放入"空闲链表"
  * 如果申请到了N个buffer，这个ioctl就应该执行N次
* ioctl VIDIOC_STREAMON：启动摄像头
* 这里是一个循环：使用poll/select监测buffer，然后从"完成链表"中取出buffer，处理后再放入"空闲链表"
  * poll/select
  * ioctl VIDIOC_DQBUF：从"完成链表"中取出buffer
  * 处理：前面使用mmap映射了每个buffer的地址，处理时就可以直接使用地址来访问buffer
  * ioclt VIDIOC_QBUF：把buffer放入"空闲链表"
* ioctl VIDIOC_STREAMOFF：停止摄像头





### 1.2 控制流程

使用摄像头时，我们可以调整很多参数，比如：

* 对于视频流本身：
  * 设置格式：比如V4L2_PIX_FMT_YUYV、V4L2_PIX_FMT_MJPEG、V4L2_PIX_FMT_RGB565
  * 设置分辨率：1024*768等

* 对于控制部分：
  * 调节亮度
  * 调节对比度
  * 调节色度

#### 1.2.1 APP接口

就APP而言，对于这些参数有3套接口：查询或枚举(Query/Enum)、获得(Get)、设置(Set)。

##### 1.2.1.1 数据格式

以设置数据格式为例，可以先枚举：

##### 1.2.1.1 数据格式

以设置数据格式为例，可以先枚举：

```c
struct v4l2_fmtdesc fmtdesc;
fmtdesc.index = 0;  // 比如从0开始
fmtdesc.type  = V4L2_BUF_TYPE_VIDEO_CAPTURE;  // 指定type为"捕获"
ioctl(vd->fd, VIDIOC_ENUM_FMT, &fmtdesc);

#if 0
/*
 *	F O R M A T   E N U M E R A T I O N
 */
struct v4l2_fmtdesc {
	__u32		    index;             /* Format number      */
	__u32		    type;              /* enum v4l2_buf_type */
	__u32               flags;
	__u8		    description[32];   /* Description string */
	__u32		    pixelformat;       /* Format fourcc      */
	__u32		    reserved[4];
};
#endif
```

还可以获得当前的格式：

```c
struct v4l2_format currentFormat;
memset(&currentFormat, 0, sizeof(struct v4l2_format));
currentFormat.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
ioctl(vd->fd, VIDIOC_G_FMT, &currentFormat);

#if 0
struct v4l2_format {
	__u32	 type;
	union {
		struct v4l2_pix_format		pix;     /* V4L2_BUF_TYPE_VIDEO_CAPTURE */
		struct v4l2_pix_format_mplane	pix_mp;  /* V4L2_BUF_TYPE_VIDEO_CAPTURE_MPLANE */
		struct v4l2_window		win;     /* V4L2_BUF_TYPE_VIDEO_OVERLAY */
		struct v4l2_vbi_format		vbi;     /* V4L2_BUF_TYPE_VBI_CAPTURE */
		struct v4l2_sliced_vbi_format	sliced;  /* V4L2_BUF_TYPE_SLICED_VBI_CAPTURE */
		struct v4l2_sdr_format		sdr;     /* V4L2_BUF_TYPE_SDR_CAPTURE */
		__u8	raw_data[200];                   /* user-defined */
	} fmt;
};

/*
 *	V I D E O   I M A G E   F O R M A T
 */
struct v4l2_pix_format {v4l2_format
	__u32         		width;
	__u32			height;
	__u32			pixelformat;
	__u32			field;		/* enum v4l2_field */
	__u32            	bytesperline;	/* for padding, zero if unused */
	__u32          		sizeimage;
	__u32			colorspace;	/* enum v4l2_colorspace */
	__u32			priv;		/* private data, depends on pixelformat */
	__u32			flags;		/* format flags (V4L2_PIX_FMT_FLAG_*) */
	__u32			ycbcr_enc;	/* enum v4l2_ycbcr_encoding */
	__u32			quantization;	/* enum v4l2_quantization */
	__u32			xfer_func;	/* enum v4l2_xfer_func */
};
#endif
```

也可以设置当前的格式：

```c
struct v4l2_format fmt;
memset(&fmt, 0, sizeof(struct v4l2_format));
fmt.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
fmt.fmt.pix.width = 1024;
fmt.fmt.pix.height = 768;
fmt.fmt.pix.pixelformat = V4L2_PIX_FMT_MJPEG;
fmt.fmt.pix.field = V4L2_FIELD_ANY;
int ret = ioctl(vd->fd, VIDIOC_S_FMT, &fmt);
```



##### 1.2.1.2 选择输入源

可以获得当期输入源、设置当前输入源：

```c
int value;
ioctl(h->fd,VIDIOC_G_INPUT,&value);  // 读到的value从0开始, 0表示第1个input源

int value = 0;  // 0表示第1个input源
ioctl(h->fd,VIDIOC_S_INPUT,&value)
```

##### 1.2.1.3 其他参数

如果每一参数都提供一系列的ioctl cmd，那使用起来很不方便。

对于这些参数，APP使用对应ID来选中它，然后使用VIDIOC_QUERYCTRL、VIDIOC_G_CTRL、VIDIOC_S_CTRL来操作它。

不同参数的ID值不同。

以亮度Brightness为例，有如下调用方法:

* 查询：

```c
struct v4l2_queryctrl   qctrl;
memset(&qctrl, 0, sizeof(qctrl));
qctrl.id = V4L2_CID_BRIGHTNESS; // V4L2_CID_BASE+0;
ioctl(fd, VIDIOC_QUERYCTRL, &qctrl);

/*  Used in the VIDIOC_QUERYCTRL ioctl for querying controls */
struct v4l2_queryctrl {
	__u32		     id;
	__u32		     type;	/* enum v4l2_ctrl_type */
	__u8		     name[32];	/* Whatever */
	__s32		     minimum;	/* Note signedness */
	__s32		     maximum;
	__s32		     step;
	__s32		     default_value;
	__u32                flags;
	__u32		     reserved[2];
};

```

* 获得当前值

```c
struct v4l2_control c;
c.id = V4L2_CID_BRIGHTNESS; // V4L2_CID_BASE+0;
ioctl(h->fd, VIDIOC_G_CTRL, &c);


/*
 *	C O N T R O L S
 */
struct v4l2_control {
	__u32		     id;
	__s32		     value;
};
```

* 设置

```c
struct v4l2_control c;
c.id = V4L2_CID_BRIGHTNESS; // V4L2_CID_BASE+0;
c.value = 99;
ioctl(h->fd, VIDIOC_S_CTRL, &c);
```



#### 1.2.2 理解接口

##### 1.2.2.1 概念

以USB摄像头为例，它的内部结构如下：

![image-20230725082453370](http://photos.100ask.net/eLinuxAI-TrainingDocs/07_uvc_topology.png)

一个USB摄像头必定有一个VideoControl接口，用于控制。有0个或多个VideoStreaming接口，用于传输视频。

在VideoControl内部，有多个Unit或Terminal，上一个Unit或Terminal的数据，流向下一个Unit或Terminal，多个Unit或Terminal组成一个完整的UVC功能设备。

* 只有一个输出引脚
  ![image-20230725083717206](http://photos.100ask.net/eLinuxAI-TrainingDocs/11_unit_example.png)

* 可以Fan-out，不能Fan-in
  ![image-20230725084117149](http://photos.100ask.net/eLinuxAI-TrainingDocs/12_fanout_fanin.png)

* Terminal：位于边界，用于联通外界。有：IT(Input Terminal)、OT(Output Terminal)、CT(Camera Terminal)。模型如下，有一个输出引脚：

  ![image-20230725082942680](http://photos.100ask.net/eLinuxAI-TrainingDocs/08_itot.png)

* Unit：位于VideoControl内部，用来进行各种控制

  * SU：Selector Unit(选择单元)，从多路输入中选择一路，比如设备支持多种输入源，可以通过SU进行选择切换。模型如下
    ![image-20230725083123895](http://photos.100ask.net/eLinuxAI-TrainingDocs/09_su.png)
  * PU：Porocessing Unit(处理单元)，用于调整亮度、对比度、色度等，有如下控制功能：
    * User Controls
      * Brightness 背光
      * Hue 色度
      * Saturation 饱和度
      * Sharpness 锐度
      * Gamma 伽马
      * Digital Multiplier (Zoom) 数字放大
    * Auto Controls
      * White Balance Temperature 白平衡色温
      * White Balance Component 白平衡组件
      * Backlight Compensation 背光补偿
      * Contrast 对比度
    * Other
      * Gain 增益
      * Power Line Frequency 电源线频率
      * Analog Video Standard 模拟视频标准
      * Analog Video Lock Status 模拟视频锁状态
    * 模型如下
      ![image-20230725083301071](http://photos.100ask.net/eLinuxAI-TrainingDocs/10_pu.png)
  * EU：Encoding Unit(编码单元)，对采集所得的数据进行个性化处理的功能。编码单元控制编码器的属性，该编码器对通过它流式传输的视频进行编码。它具有如下功能：
    ![image-20230725084636672](http://photos.100ask.net/eLinuxAI-TrainingDocs/13_eu_functions.png)
  * 模型如下
    ![image-20230725084743426](http://photos.100ask.net/eLinuxAI-TrainingDocs/14_eu.png)

* XU：Extension Unit(扩展单元)，厂家可以在XU上提供自定义的操作，模型如下：
  ![image-20230725084952604](http://photos.100ask.net/eLinuxAI-TrainingDocs/15_xu.png)



##### 1.2.2.2 操作方法

我们使用ioctl操作设备节点"/dev/video0"时，不同的ioctl操作的可能是VideoControl接口，或者VideoStreaming接口。

跟视频流相关的操作，比如：VIDIOC_ENUM_FMT、VIDIOC_G_FMT、VIDIOC_S_FMT、VIDIOC_STREAMON、VIDIOC_STREAMOFF，是操作VideoStreaming接口。



其他ioctl，大多都是操作VideoControl接口。

从底层驱动和硬件角度看，要操作VideoControl接口，需要指明：

* entity：你要操作哪个Terminal或Unit，比如PU
* Control Selector：你要操作entity里面的哪个控制项？比如亮度PU_BRIGHTNESS_CONTROL
* 控制项里哪些位：比如CT(Camera Terminal)里的CT_PANTILT_RELATIVE_CONTROL控制项对应32位的数据，其中前16位对应PAN控制(左右转动)，后16位对应TILE控制(上下转动)

但是APP不关注这些细节，使用一个ID来指定entity、Control Selector、哪些位：

```c
/*
 *	C O N T R O L S
 */
struct v4l2_control {
	__u32		     id;
	__s32		     value;
};
```

驱动程序里，会解析APP传入的ID，找到entity、Control Selector、那些位。



但是有了上述知识后，我们才能看懂mjpg-streamer的如下代码：

* XU：使用比较老的UVC驱动时，需要APP传入厂家的XU信息；新驱动里可以解析出XU信息，无需APP传入
  ![image-20230725091551391](http://photos.100ask.net/eLinuxAI-TrainingDocs/16_logitech_xu.png)

* mapping：无论新老UVC驱动，都需要提供更细化的mapping信息

  ![image-20230725092210341](http://photos.100ask.net/eLinuxAI-TrainingDocs/17_logitech_mapping.png)

* 代码

* 如下
  ![image-20230725092349892](http://photos.100ask.net/eLinuxAI-TrainingDocs/18_add_control_mapping.png)



### 1.3 编写APP

参考：mjpg-streamer，https://github.com/jacksonliam/mjpg-streamer

#### 1.3.1 列出帧细节

调用ioctl VIDIOC_ENUM_FMT可以枚举摄像头支持的格式，但是无法获得更多细节（比如支持哪些分辨率），

调用ioctl VIDIOC_G_FMT可以获得"当前的格式"，包括分辨率等细节，但是无法获得其他格式的细节。

需要结合VIDIOC_ENUM_FMT、VIDIOC_ENUM_FRAMESIZES这2个ioctl来获得这些细节：

* VIDIOC_ENUM_FMT：枚举格式
* VIDIOC_ENUM_FRAMESIZES：枚举指定格式的帧大小(即分辨率)

示例代码如下：

```c
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <linux/types.h>          /* for videodev2.h */
#include <linux/videodev2.h>

/* ./video_test </dev/video0> */

int main(int argc, char **argv)
{
    int fd;
    struct v4l2_fmtdesc fmtdesc;
    struct v4l2_frmsizeenum fsenum;
    int fmt_index = 0;
    int frame_index = 0;

    if (argc != 2)
    {
        printf("Usage: %s </dev/videoX>, print format detail for video device\n", argv[0]);
        return -1;
    }

    /* open */
    fd = open(argv[1], O_RDWR);
    if (fd < 0)
    {
        printf("can not open %s\n", argv[1]);
        return -1;
    }

    while (1)
    {
        /* 枚举格式 */
        fmtdesc.index = fmt_index;  // 比如从0开始
        fmtdesc.type  = V4L2_BUF_TYPE_VIDEO_CAPTURE;  // 指定type为"捕获"
        if (0 != ioctl(fd, VIDIOC_ENUM_FMT, &fmtdesc))
            break;

        frame_index = 0;
        while (1)
        {
            /* 枚举这种格式所支持的帧大小 */
            memset(&fsenum, 0, sizeof(struct v4l2_frmsizeenum));
            fsenum.pixel_format = fmtdesc.pixelformat;
            fsenum.index = frame_index;

            if (ioctl(fd, VIDIOC_ENUM_FRAMESIZES, &fsenum) == 0)
            {
                printf("format %s,%d, framesize %d: %d x %d\n", fmtdesc.description, fmtdesc.pixelformat, frame_index, fsenum.discrete.width, fsenum.discrete.height);
            }
            else
            {
                break;
            }

            frame_index++;
        }

        fmt_index++;
    }

    return 0;
}
```

#### 1.3.2 获取数据

根据《1.2 完整的使用流程》来编写程序，步骤如下：

* 打开设备
* ioctl VIDIOC_QUERYCAP：Query Capbility，查询能力
* 枚举格式、设置格式
* ioctl VIDIOC_REQBUFS：申请buffer
* ioctl VIDIOC_QUERYBUF和mmap：查询buffer信息、映射
* ioctl VIDIOC_QBUF：把buffer放入"空闲链表"
* ioctl VIDIOC_STREAMON：启动摄像头
* 这里是一个循环：使用poll/select监测buffer，然后从"完成链表"中取出buffer，处理后再放入"空闲链表"
  * poll/select
  * ioctl VIDIOC_DQBUF：从"完成链表"中取出buffer
  * 处理：前面使用mmap映射了每个buffer的地址，把这个buffer的数据存为文件
  * ioclt VIDIOC_QBUF：把buffer放入"空闲链表"
* ioctl VIDIOC_STREAMOFF：停止摄像头

![image-20230726162003001](http://photos.100ask.net/eLinuxAI-TrainingDocs/19_get_data.png)





#### 1.3.3 控制亮度

![image-20230726170548040](http://photos.100ask.net/eLinuxAI-TrainingDocs/20_brightness.png)

## 2. 数据层-数据预处理

​	我们从摄像头采集到图像数据后，需要对图像进行格式的转换或图像的缩放等就需要操作图像，在图像处理领域，OpenCV库提供了很多常用的图像预处理方法，用于准备图像数据以用于计算机视觉和深度学习任务。

### 1.1 OpenCV计算机视觉库

​	OpenCV(开源计算机视觉库)是一个基于Apache2.0许可（开源）的计算机视觉和机器学习软件库。OpenCV旨在为计算机视觉应用提供一个公共基础设施，并加速机器感知在商业产品中的应用。

​	OpenCV库拥有超过2500种优化算法，包括一套全面的经典和最先进的计算机视觉和机器学习算法。这些算法可用于检测和识别人脸、识别物体、对视频中的人类动作进行分类、跟踪相机运动、跟踪运动物体、提取物体的3D模型、从立体相机产生3D点云、将图像拼接在一起以产生整个场景的高分辨率图像、从图像数据库中找到相似的图像、从使用闪光灯拍摄的图像中去除红眼、跟随眼球运动、识别风景并建立标记以用增强现实覆盖等。

​	它轻量级而且高效——由一系列 C 函数和少量 [C++](https://baike.baidu.com/item/C%2B%2B/99272?fromModule=lemma_inlink) 类构成，同时提供了Python、[Ruby](https://baike.baidu.com/item/Ruby/11419?fromModule=lemma_inlink)、[MATLAB](https://baike.baidu.com/item/MATLAB/263035?fromModule=lemma_inlink)等语言的接口，实现了[图像处理](https://baike.baidu.com/item/图像处理/294902?fromModule=lemma_inlink)和计算机视觉方面的很多通用算法。它拥有C++、Python、Java和MATLAB接口，支持Windows、Linux、[安卓](https://opencv.org/opencv//android/)和Mac OS。OpenCV主要倾向于实时视觉应用，并在可用时利用MMX和SSE指令。功能齐全的[CUDA](https://opencv.org/opencv//cuda/)和[OpenCL](https://opencv.org/opencv//opencl/)现在正在积极开发接口。有500多种算法和大约10倍多的函数组成或支持这些算法。OpenCV是用C++原生编写的，它有一个模板化的接口，可以与STL容器无缝协作。

​	OpenCV官方网站：[https://opencv.org/](https://opencv.org/)

​	OpenCV开源代码仓库：[https://github.com/opencv/opencv](https://github.com/opencv/opencv)

​	OpenCV官方文档站点：[https://docs.opencv.org/](https://docs.opencv.org/)

### 1.2 OpenCV入门

#### 1.2.1 OpenCV开发环境搭建

​	在开始学习OpenCV时都会遇到一个问题，那就是如何搭建OpenCV的C++和Python开发环境，那么我们就给大家准备好了一个Ubuntu虚拟机，可以统一大家的环境，让大家学习可以快速把环境搭建起来。如果您想直接查看OpenCV官方文档安装可访问：[https://opencv.org/get-started/](https://opencv.org/get-started/)

​	下面我们展示如何在虚拟机中安装OpenCV的C++版本，打开终端命令行，输入

```shell
sudo apt install libopencv-dev -y
```

等待安装完成即可。

​	如果你是使用我们准备在资料光盘`2_DongshanPI-Vision_配套工具/【VMware】Ubuntu-20.04虚拟机系统镜像-AI应用开发`中的虚拟机镜像已经默认安装好了python版的OpenCV，可直接使用。如果您使用自己的虚拟机可输入

```shell
pip3 install opencv-python
```

> 注意：执行后会使用pip安装opencv，需要您提前安装好pip!

#### 1.2.2 第一个OpenCV开发程序

​	本章节在Linux中使用一个简单的OpenCV演示程序，通过读取图像数据的过程来讲解OpenCV中常见用的几个函数。

**python 版本：**

新建python程序文件hello-opencv.py，程序文件内容为：

```python
#导入opencv模块
import cv2 as cv

#读取当前目录图像，支持 bmp、jpg、png、tiff 等常用格式
img = cv.imread("test.jpg")

#创建一个hello-opencv窗口用于显示图像
cv.namedWindow("hello-opencv")

#在hello-opencv窗口中展示输入图像
cv.imshow("hello-opencv",img)

#将RGB彩色图像转化为灰度图
img_gray = cv.cvtColor(img,cv.COLOR_RGB2GRAY)

#创建一个Img_gray窗口用于显示图像
cv.namedWindow("Img_gray")

#在Img_gray窗口中展示输入图像
cv.imshow("Img_gray",img_gray)

#将灰度图像在当前目录下保存为jpg文件
cv.imwrite("test_gray.jpg",img_gray)

#创建的窗口持续显示，直至按下键盘中任意键
cv.waitKey(0) 

#释放窗口
cv.destroyAllWindows();
```

**C++版本：**

新建c++程序文件hello-opencv.cpp，程序文件内容为：

```c++
#include<opencv2/opencv.hpp> //包含opencv库

int main()
{
    std::string image_path = "/home/ubuntu/work/hello-opencv-c++/test.jpg"; //获得图片路径
    //读取当前目录图像，支持 bmp、jpg、png、tiff 等常用格式
    cv::Mat img = cv::imread(image_path);
    
    //创建一个hello-opencv窗口用于显示图像
    cv::namedWindow("hello-opencv");
    
    //在hello-opencv窗口中展示输入图像
    cv::imshow("hello-opencv", img);
    
    //创建Mat对象，用于存储灰度图像
    cv::Mat img_gray;
    
    //将RGB彩色图像转化为灰度图
    cv::cvtColor(img,img_gray,cv::COLOR_RGB2GRAY);
    
    //创建一个Img_gray窗口用于显示图像
    cv::namedWindow("Img_gray");
    
    //在Img_gray窗口中展示输入图像
    cv::imshow("Img_gray",img_gray);
    
    //将灰度图像在当前目录下保存为jpg文件
    cv::imwrite("test_gray.jpg",img_gray);
    
    //创建的窗口持续显示，直至按下键盘中任意键
    cv::waitKey(0);
    
    //释放窗口
    cv::destroyAllWindows();
    return 0;
}
```

编写完成程序后，我们需要将将测试图像`test.jpg`放在对应文件夹中，那么下面我们来看一下两个程序分别如何运行。

**python程序编译运行：**

打开终端界面，输入

```python
python hello-opencv.py
```

**C++程序编译运行：**

新建一个CMakeLists.txt文件，填入以下内容

```
cmake_minimum_required(VERSION 2.8)
project( hello-opencv )
find_package( OpenCV REQUIRED )
include_directories( ${OpenCV_INCLUDE_DIRS} )
add_executable( hello-opencv hello-opencv.cpp )
target_link_libraries( hello-opencv ${OpenCV_LIBS} )
```

打开终端界面，新建一个build目录，存放编译后的缓存和可执行程序：

```
mkdir build
```

新建完成后，进入build目录后，使用cmake生成编译规则

```
cd build/
cmake..
```

生成完成编译规则即可开始编译程序

```
make
```

编译完成后可以看到build目录下会生成`hello-opencv`可执行文件，如下所示，执行可执行文件。

```
./hello-opencv
```





上述代码运行完成后会弹出两个窗口显示图像。分别是输入图像的hello-opencv窗口和图像经过灰度化处理的Img_gray窗口，如下所示：

![image-20231212105301905](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231212105301905.png)

如果您想结束两个窗口，可以按下任意键结束这两个窗口。我们可以看到程序运行完成之后，可以在当前目录下看到灰度图像文件`test_gray.jpg`。如下所示：

![image-20231212112828696](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231212112828696.png)

​	下面我们简单介绍每个函数的作用：

- imread：从图像文件中读取图像数据并返回图像数据，返回的图像数据存储为Mat对象。输入参数为：图像文件路径
- namedWindow：创建一个窗口，传入窗口的名称。输入参数为：窗口名称
- imshow:可以在窗口中显示图像，该窗口和图像原始的大小自适应。输入参数为：窗口名称、输入图像
- cvtColor：将输入图像从一个色彩空间转化为另一个色彩空间。输入参数为：输入图像、转化格式
- imwrite：保存图像并写入指定的文件中，输入参数为：文件路径、输入图像
- waitKey：用于等待用户按键输入的一个函数，给定的时间内等待用户按键触发，如果用户没有按下键，就继续等待。设置waitKey(0)，则表示程序会无限制的等待用户的按键时间。
- destroyAllWindows：该函数用于删除窗口的，（）里不指定任何参数，则删除所有窗口，删除特定的窗口，往（）输入特定的窗口值。

#### 1.2.3 读取摄像头并保存图像

OpenCV提供了操作视频的接口类VideoCapture,VideoCapture类可以从文件或者摄像设备中读取视频。VideoCapture提供了常用的三种构造函数：

```
VideoCapture::VideoCapture()

VideoCapture::VideoCapture(int device)

VideoCapture::VideoCapture(const string& filename);
```

说明：

- 第一个是默认无参构造函数

- 第二个中参数device指定要打开的摄像头设备

- 第三个构造函数中filename 是指要打开的视频文件路径以及名称；

VideoCapture类还提供了read方法并且使用了重载运算符>> 获取视频的每一帧。

​	本章节介绍在虚拟机Ubuntu端的Linux系统中，使用OpenCV访问USB摄像头获取图像数据，并实时显示摄像头数据，按下`t`拍照。

```c++
#include <opencv2/opencv.hpp>
using namespace cv;
using namespace std;
 
int main()
{
	//读取视频或摄像头
	VideoCapture capture;
	
    //capture.open("/dev/video0");
    capture.open(0);

    if (!capture.isOpened())//判断摄像头是否可以正常打开
        return -1;
    cout<<"open video0 success!!"<<endl;
    
    int cap_width = capture.get(CAP_PROP_FRAME_WIDTH);//获取摄像头参数-宽度 
    int cap_height = capture.get(CAP_PROP_FRAME_HEIGHT);//获得摄像头参数-高度
    cout<<"capture width:"<<cap_width<<"capture height:"<<cap_height<<endl;
    
    capture.set(CAP_PROP_FRAME_WIDTH, cap_width); //设置摄像头获得图像的宽度
    capture.set(CAP_PROP_FRAME_HEIGHT, cap_height); //设置摄像头获得图像的高度
    capture.set(CAP_PROP_FOURCC, VideoWriter::fourcc('M', 'J', 'P', 'G'));//视频的编码格式

    namedWindow("capture"); //创建capture窗口
    string Path = "./take_pictures"; //设置照片保存路径
    string Imgname;

    int i = 0;
	while (true)
	{
		Mat frame;
		int ret = capture.read(frame);//读取摄像头资源存入frame对象中
        if (!ret)
            return 0;

        if ('t' == waitKey(20)) //如果按下`t`键，就进入拍照
        {
            Imgname = Path + to_string(i)+".jpg"; //图像路径
            i++;
            imwrite(Imgname, frame);//将frame图像存在Imgname图像路径中
            cout << Imgname << endl;
        }
		imshow("capture", frame);
	}
    capture.release();//释放摄像头资源
    cv::destroyAllWindows();//释放窗口
	return 0;
}
```

执行程序后，会弹出capture窗口，该窗口就会实时预览USB摄像头数据

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231218193633189.png)

按下`t`即可对图像进行拍照，拍照后的图像文件会保存在当前路径。

![image-20231218194200942](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231218194200942.png)

#### 1.2.4 Mat数据结构

​	本章节重点介绍Mat数据结构，我们上一小节已经通过imread读取了一张图像，并存储在Mat数据类型中。OpenCV对于Mat数据类型介绍：[Mat - 基本图像容器](https://docs.opencv.org/4.8.0/de/d7a/tutorial_table_of_content_core.html)。

​	我们先来从官方文档中来看，Mat对象的用途：

- 图像容器类（可以存储图像）
- 通用的矩阵类（可以创建和操作多维矩阵）

那么为什么又可以存储图像又可以存储矩阵呢？我们从官方文档来看。我们通过电子设备从现实世界获得的数字图像，那么我们通过设备记录下来的就是每个点的数值构成的图像。如下所示：

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/MatBasicImageForComputer-1702374941737-5.jpg)

也就说相机记录的数据集是像上图所示的数据，也就是像矩阵一样的数据，记录每个像素点中的数据，而Mat保存的图像数据就是保存图像中各个通道的像素值，即Mat将图像数据按行按列的顺序进行存放数据矩阵。如下图所示：

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231212180206015.png)

​	Mat数据类型的结构分为两部分：信息头和指向像素数据的矩阵指针。

信息头包括数字图像的矩阵尺寸（row、cols）、存储方法、存储地址。

指向存储所有像素值的矩阵的指针。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231213142235194.png)

我们就可以发现，如果我们去改变图像中的像素值时，通常改变的数据量是很大的，我们需要对图像像素数据的矩阵中的每一个值进行修改。因此，如果我们需要在程序中传递图像并拷贝时会产生很大的内存开销，因为我们知道我们在进行图像处理的时候需要在很多函数中传递图像，所以需要用到信息头，让每个传递的Mat对象都有自己的信息头，但使用矩阵指针指向同一个地址从而共享一个图像矩阵，这样传递时只会拷贝信息头和矩阵指针，而不是拷贝图像像素指针。



下面使用官方示例代码来学习Mat对象。

```c++
    Mat A;                                 // 只创建信息头部分
    A = imread("test.jpg"); // 这里为矩阵开辟内存
	/*Mat的成员属性data：uchar类型的指针，指向Mat数据矩阵的首地址*/
    float* A_ptr = (float*)A.data;  
    imshow("A",A);
    Mat B(A);                                 // 使用拷贝构造函数
	float* B_ptr = (float*)B.data;
    imshow("B",B);
    
	Mat C;
	C = A;                                    // 赋值运算符
	float* C_ptr = (float*)C.data;
	cout<<"Mat A 矩阵指针:"<<A_ptr<<endl;
	cout<<"Mat B 矩阵指针:"<<B_ptr<<endl;
	cout<<"Mat C 矩阵指针:"<<C_ptr<<endl;
```

我们在初始化Mat对象时，只是创建了信息头，只是申请了一小块内存用于存放矩阵尺寸、存储方法、存储地址等数据。直到使用imread函数读取图像文件后，会为矩阵开辟内存，将图像文件以矩阵数据的方式存放在开辟的内存中。通过打印Mat对象A/B/C的矩阵指针（指向图像矩阵数据的指针），可以发现我们使用拷贝构造函数或者赋值运算符只是新建了一个信息头，信息头指向的图像矩阵数据是一样的，这就说明了传递图像可以减少内存的开销，但是因为是A/B/C都共享一个图像矩阵，那么任何一个对象进行图像数据的修改都会影响到其他对象。

如果你在读取图像时只想获取其中其他对象中的部分图像，可以创建一个信息头引用部分数据。

```c++
    Mat D (A, Rect(10, 10, 100, 100) ); // using a rectangle
	float* D_ptr = (float*)D.data;
    imshow("D",D);
    cout<<"Mat D 矩阵指针:"<<D_ptr<<endl;
```

其中Rect函数为矩形类，可以在绘制一个矩形框。函数用法：Rect(int x, int y, int width, int height)，其中第一个参数为绘制矩阵的x坐标，第二个参数为绘制矩阵的y坐标，第三个参数为绘制矩阵的宽度，第三个参数为绘制矩阵的高度。例如：

Rect(10, 10, 100, 100)

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231214164353116.png)

通过上图我们可以看到黄色矩形为Rect函数创建出来的矩形，前两个参数xy确定矩阵的位置(绿色点)，通过宽高确定矩形绘制的大小。通过在Mat对象调用该函数可以去创建一个感兴趣区域(ROI)，即提取图片某一区域的图像。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231214170824529.png)

```c++
    Mat E = A(Range::all(), Range(1,30)); // using row and column boundaries
	float* E_ptr = (float*)E.data;
    imshow("E",E);
    cout<<"Mat E 矩阵指针:"<<E_ptr<<endl;
```

Range对象可以用来表示矩阵的多个连续的行或者多个连续的列，其中`Range::all(), Range(1,30)`，可以提取图像矩阵中第一列到30列（不包括30列）。提取的结果如下所示：

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231214172332824.png)

​	那么一个图像数据矩阵属于那么多的Mat的对象，那么谁来最后负责清理呢？是最后一个使用它的对象，通过引用计数器来实现，无论谁来拷贝Mat对象的信息头，都会增加矩阵的引用次数，反之当一个信息头被释放之后，这个引用计数器就减一，当数值为0时，图像矩阵就会被清理。

​	如果你某些情况需要拷贝图像矩阵本身，而不是信息头和矩阵指针的时候，也就是想使用一个信息图像矩阵存储拷贝过来的图像矩阵，此时就可以使用函数`clone()`和`copyTo()`。

```c++
    Mat F = A.clone();
    float* F_ptr = (float*)F.data;
    cout<<"Mat F 矩阵指针:"<<F_ptr<<endl;
    imshow("F",F);
    
    Mat G;
    A.copyTo(G);
    float* G_ptr = (float*)G.data;
    cout<<"Mat G 矩阵指针:"<<G_ptr<<endl;
    imshow("G",G);
```

我们可以从打印信息看到，通过函数`clone()`和`copyTo()`拷贝的图像矩阵会使用新的矩阵指针指向新的内存空间。那么此时我们去改变F对象或者G对象就不会影响原来A对象信息头指向的图像数据矩阵。



总结：

- OpenCV函数中输出图像的内存分配是自动完成的（如果不特别指定的话）。
- 使用OpenCV的C++接口时不需要考虑内存释放问题。
- 赋值运算符和拷贝构造函数（ *ctor* ）只拷贝信息头。
- 使用函数 [clone()](http://opencv.itseez.com/modules/core/doc/basic_structures.html#mat-clone) 或者 [copyTo()](http://opencv.itseez.com/modules/core/doc/basic_structures.html#mat-copyto) 来拷贝一副图像的矩阵。

#### 1.2.5 Mat图像通道和位深

​	上一小节我们讨论了Mat对象可以作为通用矩阵类和图像容器，那么使用Mat对象去存储图像时，容器中的元素存储的是像素值，在OpenCV中有专门的数据格式来描述这些像素值参数，例如通道数、整型、字符类型等。例如：

```c++
Mat Img(640, 640, CV_8UC3);
```

​	上述代码，我们创建了一个Mat对象作为图像容器，存储的是图像高（行row）640，图像宽（列col）640，存储的数据类型是CV_8UC3。

这里的数据类型CV_8UC3的数据格式为：基本数据类型+通道数。

```
CV_8UC3数据格式：
CV_:数据前缀
8：比特数
U：数据类型
C3：通道数
```

位深表示每个值由多少位来存储，是一个精度问题，一般图片是8bit（位）的，则深度是8。

 **比特数(bit_depth)：** 图像中像素点在内存空间所占的内存大小。参数有8bits、16bites、32bites、64bites。

| 数据类型 | 说明                    |
| -------- | ----------------------- |
| S        | signed int 有符号整型   |
| U        | unsigned int 无符号整型 |
| F        | float 单精度浮点型      |

通道表示每个点能存放多少个数，类似于RGB彩色图中的每个像素点有三个值，即三通道的。

| 通道 | 说明                             |
| ---- | -------------------------------- |
| 1    | 灰度图像（单通道图像）           |
| 2    | 双通道图像                       |
| 3    | RGB图像（3通道图像）             |
| 4    | 带Alph通道的RGB图像（4通道图像） |

这里的CV_8UC3就表示：每个像素8bit（位）的unsigned int （无符号整型）数据存储RGB(3通道)的像素值。

下面我们来看看常见的数据格式：

| 数据格式 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| CV_8UC1  | 每个像素8bit（位）的unsigned int （无符号整型）数据存储单通道的像素值。 |
| CV_8UC2  | 每个像素8bit（位）的unsigned int （无符号整型）数据存储双通道的像素值。 |
| CV_8UC3  | 每个像素8bit（位）的unsigned int （无符号整型）数据存储三通道的像素值。 |

#### 1.2.6 图像通道操作

​	我们端设备上获取图像通常都是3通道的RGB图像，但对于OpenCV默认使用BGR而非RGB格式来表示图像的颜色通道。这是因为在OpenCV的早期开发阶段，BGR格式在相机制造厂商和软件提供商之间比较受欢迎。

​	对于多通道的图像我们在图像处理操作中可能会将图像分段存储，这需要涉及到通道的分离和合并。例如我们需要将图像拆分不同的通道，并对每个通道进行填充以达到模型输入对应尺寸。那么下面我们来介绍通道处理中的通道合并和通道分离。

​	**通道分离函数-split函数**

```c++
void cv::split(InputArray m, OutputArrayOfArrays mv);
```

参数说明：

- InputArray m ：为需要进行分离的多通道数据，一般填入Mat对象。
- OutputArrayOfArrays mv ：为函数输出的数组，一般填入Vector容器。

示例程序：

```c++
cv::split(Mat Img,Vecotr<Mat> Ori);
```

​	**通道合并函数-merge**

```c++
void cv::merge(const vector& mv, OutputArray dst );
```

​	参数说明：

- const vector& mv：图像矩阵向量Vector容器。
- OutputArray dst：输出图像Mat对象。

示例程序：

```c++
cv::merge(Vecotr<Mat> Ori, Mat dstImg );
```



下面通过摄像头获取到图像后，将图像进行拆分后再进行合并，学习通道分离和合并函数，如下所示：

```c++
#include<opencv2/opencv.hpp> //包含opencv库

using namespace cv;
using namespace std;
int main()
{
    Mat img = imread("test.jpg");
    Mat res;
    resize(img, res, Size(640, 480));

    vector<Mat> ori_img;
    split(res,ori_img);

    cout<<"OpenCV Version:"<<CV_VERSION<<endl;
    //读取视频或摄像头
	VideoCapture capture;

    capture.open("/dev/video0");
    //capture.open(0);

    if (!capture.isOpened())
        return -1;
    cout<<"open video0 success!!"<<endl;

    int cap_width = capture.get(CAP_PROP_FRAME_WIDTH);
    int cap_height = capture.get(CAP_PROP_FRAME_HEIGHT);
    cout<<"capture width:"<<cap_width<<"capture height:"<<cap_height<<endl;
    
    capture.set(CAP_PROP_FRAME_WIDTH, cap_width);
    capture.set(CAP_PROP_FRAME_HEIGHT, cap_height);
    capture.set(CAP_PROP_FOURCC, VideoWriter::fourcc('M', 'J', 'P', 'G'));

    namedWindow("capture");

	while (true)
	{
		Mat frame;
		capture >> frame;
        if (frame.empty())
            return 0;
        imshow("capture", frame);
        
        vector<Mat> ori_cam;
        split(frame,ori_cam);
        imshow("blue channel",ori_cam[0]);
        //imshow("green channel",ori_cam[1]);
        //imshow("red channel",ori_cam[2]);
        
        ori_cam.erase(ori_cam.begin() + 1);
        ori_cam.insert(ori_cam.begin() + 1,ori_img[1]);

        Mat dstFrame;
        merge(ori_cam,dstFrame);
        imshow("dstFrame",dstFrame);
        
        if ('q' == waitKey(10)) {			//'q'退出
            break;
        }
	}

    //释放窗口
    cv::destroyAllWindows();

    capture.release();
	return 0;
}
```

本程序先将本地图片分为三个颜色通道，并存入Vector容器。然后读取摄像头数据，也分为三个通道，再用本地图片的G通道替换摄像头数据的G通道，最后显示出来。程序的具体流程如下所示：

- 读取本地图像并修改分辨率
- 使用split函数拆分原图像的通道数据存放到Vector容器
- 读取视频或摄像头并设置摄像头参数
- 读取摄像头数据并将图像数据拆分通道数据存放在Vector容器
- 删除视频通道数据Vector容器中的G通道数据并将本地图像中的G通道数据填入Vector容器中
- 使用merge函数函数融合Vector容器中的数据并显示出来。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240118193521005.png)

#### 1.2.7 图像处理常用函数-几何变换

OpenCV 几何变换是指对图像进行一些基本的空间变换，如缩放、平移、旋转、仿射和透视等。这些变换可以用矩阵运算来表示，OpenCV 提供了一些函数来方便地实现这些变换。例如：

- `cv::resize` 可以对图像进行缩放，可以指定输出图像的尺寸或者缩放比例，以及插值方法。
- `cv::warpAffine` 可以对图像进行仿射变换，需要指定一个 2×3 的变换矩阵，以及输出图像的大小。
- `cv::getRotationMatrix2D` 可以生成一个旋转变换矩阵，需要指定旋转中心、旋转角度和缩放比例。
- `cv::flip`可以实现图像的水平或垂直方向的翻转。

下面我们通过一个程序来讲解OpenCV如何实现图像的几何变换，如下所示：

```c++
#include <opencv2/opencv.hpp>
using namespace cv;
int main()
{
    Mat img = imread("test.jpg"); // 读取图像
    imshow("Original", img); // 显示原图
    
    //缩放
    Mat res;
    resize(img, res, Size(300, 300)); // 将图像缩放到 300x300
    imshow("Resized", res); // 显示缩放后的图像

    //旋转
    // 创建仿射变换矩阵
    Mat M_rev = getRotationMatrix2D(Point2f(img.cols/2, img.rows/2), 45, 0.8);
    // 应用仿射变换
    Mat rev_dst;
    warpAffine(img, rev_dst, M_rev, img.size());
    imshow("Affine", rev_dst);

    //平移
    // 获取图像的高度和宽度
    int rows = img.rows;
    int cols = img.cols;

    // 生成平移矩阵
    Mat M_ts = getRotationMatrix2D(Point2f(0, 0), 0, 1);
    M_ts.at<double>(0, 2) = 50; // x轴偏移量
    M_ts.at<double>(1, 2) = 100; // y轴偏移量

    // 应用平移变换
    Mat ts_dst;
    warpAffine(img, ts_dst, M_ts, cv::Size(cols, rows));

    //展示将图像沿x轴移动50像素，沿y轴移动100像素
    imshow("Translate", ts_dst);


    //翻转
    Mat flip_dst;

    // 水平翻转
    flip(img, flip_dst, 1);
    imshow("flip", flip_dst);

    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭窗口
    return 0;
}

```

程序运行后分别会展示原始图像/缩放图像/旋转图像/平移图像/翻转图像。如下图所示：

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240118193854748.png)

下面我们分别来看程序中的缩放/旋转/平移/翻转是如何实现的。通过程序来看图像的缩放是通过resize函数实现的，它是OpenCV中的一个函数，用于对图像进行缩放或调整大小。它可以根据给定的宽度和高度，或者根据给定的缩放因子，来改变图像的尺寸。它还可以根据不同的插值方法，来保证图像的质量和效果。cv::resize的函数原型如下：

```c++
void cv::resize(InputArray src, OutputArray dst, Size dsize, double fx = 0, double fy = 0, int interpolation = INTER_LINEAR)
```

参数说明：

- src：输入图像，可以是任意类型和通道数的Mat对象
- dst：输出图像，与输入图像有相同的类型，但大小由dsize参数指定，或者由fx和fy参数计算
- dsize：输出图像的大小，如果为零，则根据fx和fy参数的值来确定
- fx：水平方向的缩放因子，如果为零，则根据dsize参数的值来确定
- fy：垂直方向的缩放因子，如果为零，则根据dsize参数的值来确定
- interpolation：插值方法，常用的有以下几种：
  - INTER_NEAREST：最近邻插值，速度最快，但效果最差
  - INTER_LINEAR：双线性插值，速度较快，效果较好，是默认的插值方法
  - INTER_AREA：区域插值，适用于图像缩小，可以避免波纹现象
  - INTER_CUBIC：双三次插值，适用于图像放大，效果最好，但速度最慢
  - INTER_LANCZOS4：Lanczos插值，一种高级的插值方法，可以产生更好的图像质量，但速度更慢

我们经过了一个resize函数可以将原图缩小成300×300像素大小的图像，resize函数不仅可以缩小图像，也可以放大图像，只要指定合适的dsize参数或者fx和fy参数。resize函数可以根据不同的插值方法，来保证图像的质量和效果，例如，如果你想放大图像，你可以使用INTER_CUBIC或者INTER_LANCZOS4来得到更好的结果。resize函数可以处理任意类型和通道数的图像，例如，你可以对彩色图像、灰度图像、二值图像等进行缩放或调整大小。

​	对于旋转和平移都可以通过仿射变换来实现，那么 我们先来看什么是仿射变换？仿射变换是指在几何中，对一个向量空间进行一次线性变换并接上一个平移，变换为另一个向量空间。简单来说，就是“线性变换”+“平移”。仿射变换保持了直线的平行性和比例，但不一定保持角度和距离。

仿射变换可以用矩阵和向量来表示，例如：
$$
vec {y}=Avec {x}+vec {b}
$$
其中，A是一个线性变换矩阵，vecb是一个平移向量，vecx和vecy是变换前后的向量。

总的来说就是使用原来的图像矩阵乘一个矩阵，从而实现图像的旋转和缩放。具体可以参考OpenCV官方文档：[仿射变换 — OpenCV 2.3.2 documentation](https://www.opencv.org.cn/opencvdoc/2.3.2/html/doc/tutorials/imgproc/imgtrans/warp_affine/warp_affine.html)

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240118152845662.png)



`getRotationMatrix2D`是用于生成一个2x3的仿射变换矩阵，该矩阵可以用于对图像进行旋转和缩放操作。该函数的语法如下：

```cpp
Mat cv::getRotationMatrix2D(Point2f center, double angle, double scale)
```

参数说明：

- center：旋转的中心点，可以是图像的中心或任意点
- angle：旋转的角度，单位为度，正值表示逆时针旋转，负值表示顺时针旋转
- scale：缩放的比例，大于1表示放大，小于1表示缩小，等于1表示不变



`warpAffine`是OpenCV中的一个函数，用于对图像进行仿射变换。仿射变换是一种图像的几何变换，它可以对图像进行旋转、缩放、平移、翻转、错切等操作，但必须保持图像的平行性。warpAffine函数的语法如下：

```cpp
void cv::warpAffine(InputArray src, OutputArray dst, InputArray M, Size dsize, int flags = INTER_LINEAR, int borderMode = BORDER_CONSTANT, const Scalar & borderValue = Scalar())
```

参数说明：

- src：输入图像，可以是任意类型和通道数的Mat对象
- dst：输出图像，与输入图像有相同的类型，但大小由dsize参数指定
- M：2x3的变换矩阵，可以用cv::getAffineTransform或cv::getRotationMatrix2D来生成，或者自己构造一个数组
- dsize：输出图像的大小，如果为零，则根据src的大小和M的值计算
- flags：插值方法，常用的有cv::INTER_LINEAR（双线性插值）和cv::INTER_NEAREST（最近邻插值）
- borderMode：边界处理方式，常用的有cv::BORDER_CONSTANT（用常数填充）和cv::BORDER_REPLICATE（用边界像素复制）
- borderValue：当borderMode为cv::BORDER_CONSTANT时，用于填充的常数值，默认为0

​	对于图像旋转，我们用getRotationMatrix2D函数，以图像中心点（由Point2f创建）为旋转中心，创建一个逆时针旋转45度，缩放比例为0.7的仿射矩阵。然后，我们用warpAffine函数，把这个矩阵和输入图像一起传入，得到变换后的输出图像。

​	对于图像平移，我们通过改变变换矩阵的x轴和y轴分量，实现了图像的平移，而不改变其旋转和缩放。图像的平移是通过调整变换矩阵在x轴和y轴上的偏移来完成的，不涉及旋转和缩放的变化。为了平移图像，我们只需修改变换矩阵的x轴和y轴偏移，不用改变其旋转和缩放。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240118162002185.png)



对于图像翻转就可以通过cv::flip()方法，它可以用来翻转二维数组的。这个函数可以根据不同的参数，在垂直、水平或者两个轴上翻转图像。语法如下：

```c++
cv::flip(src, dst, flipCode)
```

参数说明：

- src: 输入数组，可以是图像或者矩阵。
- dst: 输出数组，和src的大小和类型相同。
- flipCode: 一个标志，指定如何翻转数组；0表示沿着x轴翻转，正值（例如，1）表示沿着y轴翻转。负值（例如，-1）表示沿着两个轴翻转。

返回值：

- 它返回一个翻转后的图像数组。

我们使用flip函数主要传入输入图像，输出图像以及沿着x轴或者y轴翻转，执行完成后即可得到输出图像。



本节主要介绍OpenCV的几何变换方法，让大家感受opencv的开发流程，学习图像变换的基础操作。opencv提供了多种几何变换方法，包括图像的翻转、平移、旋转、仿射和透视变换。图像的几何变换就是将一组图像数据经过某种数学运算，映射成另外一组图像数据的操作，其关键是确定空间映射关系，一般用变换矩阵来表示。opencv提供了cv2.warpAffine和cv2.warpPerspective两个函数来实现几何变换，前者用于仿射变换，后者用于透视变换，它们都需要指定变换矩阵、输出图像大小和插值方法。插值方法是指在图像缩放或旋转时，如何填充或删去一些像素值，opencv提供了多种插值方法，如最近邻插值、双线性插值、双三次插值、区域插值等，它们对图像的质量和速度有不同的影响。