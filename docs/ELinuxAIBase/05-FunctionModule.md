---
sidebar_position: 11
---
#  11.功能模块

### 3.1 推理结果分析

#### 3.1.1 解码预测结果

模型解码预测结果是指将神经网络模型输出的预测结果进行解析和转换，以得到最终的预测结果。

具体来说，模型解码预测结果包括以下步骤：

1. **获取预测结果**：神经网络模型在推理过程中会输出预测结果，这些结果通常以概率或得分的形式表示。
2. **解码分类预测**：对于分类任务，神经网络模型会输出每个类别的概率。我们需要将这些概率解码为具体的类别标签。通常，解码的方法是将概率最高的类别作为预测结果。
3. **解码位置信息**：对于回归任务，神经网络模型会输出预测的位置信息，如边界框的坐标、尺寸等。我们需要将这些位置信息解码为具体的数值。



下面我们以基于锚框的yolo算法为例，我们来看其模型的输入和输出内容。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240117163536142.png)

​	模型的输入节点，接收的tensor为[1,3,640,640]表示[batchsize，channel，height，weight]，即批次大小为1，也就是一次读1张图像；channel为3表示通道数，3通道彩色图像；高度和宽度则是单张图像的大小320*320像素。

​	模型的输出节点，输出的tensor为[1,25200,85]，其中1表示批次大小为1，每次输出一张图像的数据；25200表示有25k的锚框数量；85表示数据集有80个类/4个框坐标/1个类别置信度。我们来看这个85中的数据集有80个类/4个框坐标/1个类别置信度。由于yolov5使用的coco数据集，其中的图片的类别数是80个类。4个框坐标表示：中心坐标x，中心坐标y,宽度w，高度y。1个类别置信度表示：所有锚框对应的类别的检测概率值。



#### 3.1.2 非极大值抑制

**非极大值抑制**（NMS）是一种在目标检测中常用的后处理技术。它的主要目的是去除冗余的检测框，保留最优的检测结果。

在目标检测中，通常会使用滑动窗口或类似的方法来生成候选框，然后对这些候选框进行分类和定位精度的评估。但是，由于这种方法会产生大量的候选框，其中很多可能是重叠的，因此需要进行后处理来去除冗余和低质量的候选框，以得到最终的目标检测结果。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/graphic4-1705370295354-3.jpg)

NMS的基本思想是保留分类得分最高的候选框，并将其与周围候选框进行比较，去除与它重叠面积超过阈值的候选框。这个过程不断重复，直到所有候选框都被处理完。NMS可以有效地去除冗余和低质量的候选框，提高目标检测的准确率和效率。它通常被应用于目标检测的最后一步，用于生成最终的目标检测结果。

在NMS中，需要设定一个阈值来决定哪些候选框需要被去除。这个阈值的选择需要根据具体的应用场景和数据集来确定。如果阈值设置得过高，可能会导致漏检；如果阈值设置得过低，可能会导致误检。因此，选择合适的阈值是NMS的关键。

​	非极大值抑制NMS是一种在目标检测中常用的后处理技术，可以有效地去除冗余和低质量的候选框，提高目标检测的准确率和效率。常见的NMS算法有：最基本的贪心式NMS算法，改进的NMS算法，有Soft-NMS1，Matrix NMS2，Adaptive NMS3，DIoU-NMS4，IoU-guided NMS5等。

​	在开始学习NMS之前我们需要了解并集交叉点(Intersection Over Union) 或简称 **IOU**。通常用于量化真实值 BBox（边界框）和预测 BBox 之间重叠百分比的方法。由于目前很多目标检测算法都是基于锚框来进行预测的，也就是将图像分成多个网格，可以是密集的网格或者在感兴趣区域内的规则网格。每个网格的中心点是放置锚框的位置。锚框就是我们预先定义好的框，我们就可以将图像划分为一个个网格，基于每个网格放锚框，进行预测。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240116115213146.png)

现在我们就需要考虑IOU的问题就是考虑真实框和预测框重叠的百分比，其数学公式为:
$$
IOU= \frac{Target \cap Prediction}{Target \cup Prediction}
$$
其中交集与并集的区域可如下图所示：

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240116141331061.png)

真实框和预测框的交集区域是蓝色部分，并集区域是紫色部分，IOU的值可以通过将蓝色区域除以紫色区域得到。IOU就可以衡量真实框和预测框之间的相似性。它的值域再[0,1]，其中0表示没有重叠，1表示全部重叠。

​	下面我们使用C++来实现一个简单IOU的计算，我们计算两个Box的交并比，假设A框的左下角的坐标为(10,10)，右上角坐标为(100,100)。B框的左下角的坐标为(30,30)，右上角坐标为(150,150)。那么就可以计算出对应交集框的坐标值。A框和B框在坐标轴下的表示，如下图所示：

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240116164453695.png)
下面展示C++程序源码：

```c++
#include <iostream>
#include <algorithm>
using namespace std;

// 定义一个矩形框的结构体，包含左上角和右下角的坐标，以及置信度
struct Bbox {
    int x1;
    int y1;
    int x2;
    int y2;
    float score;
};

// 计算两个矩形框的IOU
float iou(const Bbox& a, const Bbox& b) {
    // 计算两个矩形框的交集的左上角和右下角的坐标
    int inter_x1 = max(a.x1, b.x1);
    int inter_y1 = max(a.y1, b.y1);
    int inter_x2 = min(a.x2, b.x2);
    int inter_y2 = min(a.y2, b.y2);
    // 判断是否有交集，如果没有，返回0
    if (inter_x1 >= inter_x2 || inter_y1 >= inter_y2) {
        return 0;
    }
    // 计算交集的面积
    int inter_area = (inter_x2 - inter_x1) * (inter_y2 - inter_y1);
    // 计算两个矩形框的面积
    int area_a = (a.x2 - a.x1) * (a.y2 - a.y1);
    int area_b = (b.x2 - b.x1) * (b.y2 - b.y1);
    // 计算并集的面积
    int union_area = area_a + area_b - inter_area;
    // 计算IOU
    return inter_area * 1.0 / union_area;
}

//主函数
int main() {
    // 创建两个矩形框
    Bbox a = {10, 10, 100, 100, 0.9};
    Bbox b = {30, 30, 150, 150, 0.8};
    // 计算IOU
    float iou_value = iou(a, b);
    // 输出结果
    cout << "IOU = " << iou_value << endl;
    return 0;
}
```

> 将矩阵A和矩阵B的参数传入iou函数中计算交并比，在iouh函数中分别计算交集的面积和并集的面积，最后计算IOU的值并返回。



​	下面我们使用YOLOV5目标检测算法中的[开源NMS示例](https://github.com/developer0hye/Modern-Cpp-NMS)来讲解NMS。前面我们学习了IOU交并比，nms就是在其基础上，按照预测的置信度分数对矩形框进行排序，然后依次选择最高置信度的矩形框，并删除与它重叠度超过一定阈值的其他矩形框。这样可以有效地减少重复或冗余的预测框，提高检测的效率和精度。我们需要定义提前好nms阈值，用于判断是否要删除一个矩形框的标准，一般在0.3到0.5之间。如果一个矩形框与已经选择的最高置信度的矩形框的iou大于阈值，那么它就被认为是多余的，需要被删除。

下面展示nms核心代码：

```c++
#include "nms.hpp"
#include <algorithm>

float iou(const std::vector<float>& boxA, const std::vector<float>& boxB)
{
    // The format of box is [top_left_x, top_left_y, bottom_right_x, bottom_right_y]
    const float eps = 1e-6;
    float iou = 0.f;
    float areaA = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]);
    float areaB = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1]);
    float x1 = std::max(boxA[0], boxB[0]);
    float y1 = std::max(boxA[1], boxB[1]);
    float x2 = std::min(boxA[2], boxB[2]);
    float y2 = std::min(boxA[3], boxB[3]);
    float w = std::max(0.f, x2 - x1);
    float h = std::max(0.f, y2 - y1);
    float inter = w * h;
    iou = inter / (areaA + areaB - inter + eps);
    return iou;
}

void nms(std::vector<std::vector<float>>& boxes, const float iou_threshold)
{
    // The format of boxes is [[top_left_x, top_left_y, bottom_right_x, bottom_right_y, score, class_id], ...]
    //“分数+class_id”排序是为了确保将具有相同class_id的框分组在一起，并按分数排序
    std::sort(boxes.begin(), boxes.end(), [](const std::vector<float>& boxA, const std::vector<float>& boxB) { return boxA[4] + boxA[5] > boxB[4] + boxB[5];});
    for (int i = 0; i < boxes.size(); ++i)
    {
        if (boxes[i][4] == 0.f)
        {
            continue;
        }
        for (int j = i + 1; j < boxes.size(); ++j)
        {
            if (boxes[i][5] != boxes[j][5])
            {
                break;
            }
            if (iou(boxes[i], boxes[j]) > iou_threshold)
            {
                boxes[j][4] = 0.f;
            }
        }
    }
    std::erase_if(boxes, [](const std::vector<float>& box) { return box[4] == 0.f; });
}
```

> 运行全部代码需要额外安装fmt库，输入：sudo apt install libfmt-dev

​	在Modern-Cpp-NMS目录下新建build目录存放编译文件，使用cmake编译程序，如下所示：

```shell
ubuntu@ubuntu2004:~/Modern-Cpp-NMS$ mkdir build
ubuntu@ubuntu2004:~/Modern-Cpp-NMS$ cd build/
ubuntu@ubuntu2004:~/Modern-Cpp-NMS/build$ cmake ..
-- The CXX compiler identification is GNU 9.4.0
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /home/ubuntu/work/Modern-Cpp-NMS/build
ubuntu@ubuntu2004:~/Modern-Cpp-NMS/build$ make
[ 33%] Building CXX object CMakeFiles/example.dir/example.cpp.o
[ 66%] Building CXX object CMakeFiles/example.dir/nms.cpp.o
[100%] Linking CXX executable example
[100%] Built target example
```

运行完成后我们可以在`build`目录下看到`example`可执行程序，执行可执行程序会在当前目录下生成`boxes_nms.txt`文本文件。

```shell
ubuntu@ubuntu2004:~/Modern-Cpp-NMS/build$ ls
boxes.txt  CMakeCache.txt  CMakeFiles  cmake_install.cmake  example  Makefile
ubuntu@ubuntu2004:~/Modern-Cpp-NMS/build$ ./example 
ubuntu@ubuntu2004:~/Modern-Cpp-NMS/build$ ls
boxes_nms.txt  CMakeCache.txt  cmake_install.cmake  Makefile
boxes.txt      CMakeFiles      example、
```

我们可以对比`boxes.txt`和`boxes_nms.txt`两个文件可以发现我们通过nms已经减少了预测框。将`boxes_nms.txt`文件拷贝到`Modern-Cpp-NMS`目录下，我们使用绘图程序查看`plot.py`经过nms前后的图像。

```shell
ubuntu@ubuntu2004:~/work/Modern-Cpp-NMS/build$ cp boxes_nms.txt ../
ubuntu@ubuntu2004:~/work/Modern-Cpp-NMS/build$ cd ../
ubuntu@ubuntu2004:~/work/Modern-Cpp-NMS$ ls
boxes_nms.txt  CMakeLists.txt  img_with_boxes.jpg      nms.cpp  README.md
boxes.txt      example.cpp     img_with_boxes_nms.jpg  nms.hpp
build          img.jpg         LICENSE                 plot.py
ubuntu@ubuntu2004:~/work/Modern-Cpp-NMS$ python plot.py 
```

执行完成后会自动弹出两个窗口显示经过nms前后的图像，如下图所示：

![image-20240116194429752](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20240116194429752.png)

经过NMS之后的图像，可以看到目标周围只有一个或少数几个边界框，而不是大量的重叠框。左图是NMS之前的图像，右图是NMS之后的图像，可以看到NMS有效地减少了冗余的边界框，提高了检测的效果。

### 3.2 DRM显示

​	在视觉AI任务中，我们获得了目标检测框，一般我们还需要将检测框展示出来给用户看到检测结果，那么我们想在显示屏上进行显示，就需要了解DMR显示框架，怎么将检测框和摄像头获取到的图像叠加显示在显示屏上。

​	DRM（Direct Rendering Manager）是Linux主流的图形显示框架，它支持多图层合成，为用户图层提供统一的API（libdrm），来访问GPU，实现统一管理。在DRM显示框架中，KMS（Kernel Mode Setting）负责相关参数的设置（包括分辨率、刷新率、电源状态等）和显示画面的切换（显示buffer的切换，多图层的合成方式，以及每个图层的显示位置）。具体来说，DRM显示框架可以处理底层硬件和软件的交互，通过提供通用的API接口，使得软件架构更为统一，方便管理和维护。此外，DRM框架还可以支持多种显示硬件，包括液晶显示器、投影仪等。

DRM显示流程涉及到以下几个步骤：

- 打开DRM设备文件：DRM框架成功加载后，会创建一个设备文件/dev/dri/cardX，上层用户应用可以通过该文件节点，获取显卡的各种操作。

- 获取显卡资源句柄：通过drmModeGetResources函数，获取显卡的资源句柄，进而进行显卡资源的操作，如获取CRTC、Encoder、Connector等对象的信息。

- 分配和映射显示缓冲区：通过drmModeAddFB2函数，分配一个显示缓冲区（Framebuffer），并将其映射到用户空间，用于存储图像数据。

- 设置显示模式：通过drmModeSetCrtc函数，设置显示控制器（CRTC）的显示模式，如分辨率、刷新率、时序等，以及关联显示缓冲区和输出转换器（Encoder）。
- 设置输出连接器：通过drmModeSetConnector函数，设置输出连接器（Connector）的状态，如连接或断开，以及关联输出转换器（Encoder）。

- 绘制图像：通过drmModeMapDumb函数，将显示缓冲区映射到用户空间，然后通过memcpy或其他方式，将图像数据拷贝到显示缓冲区中。

- 切换显示缓冲区：通过drmModePageFlip函数，切换显示缓冲区，使得绘制的图像能够显示在屏幕上，同时注册一个回调函数，用于接收切换完成的通知。

- 等待垂直消影区：通过drmWaitVBlank函数，等待垂直消影区（VBLANK）的到来，这是显示器件软件和硬件的同步机制，通常基于硬件的VSYNC信号来实现。

- 释放显示缓冲区：通过drmModeRmFB函数，释放显示缓冲区，回收内存资源。