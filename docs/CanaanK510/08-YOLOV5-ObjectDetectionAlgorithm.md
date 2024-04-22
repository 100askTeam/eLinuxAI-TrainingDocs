---
sidebar_position: 1
---
# 1.YOLOV5目标检测算法

​	 YOLOV5目标检测算法是YOLO算法的第五次迭代，YOLO全称为You Only Look Once(你只需看一次)，YOLO在2015年提出将物体检测作为回归问题求解，论文地址:[https://arxiv.org/pdf/1506.02640.](https://arxiv.org/pdf/1506.02640.pdf)[pdf](https://arxiv.org/pdf/1506.02640.pdf)。

​	这里介绍该论文的引言部分，简单了解YOLO思想：YOLO算法主要来自于人类生活中的日常行为，**当人脸瞥一眼图像就立刻知道该图像中的内容**，知道该图像中所突出的物体以及物体与图像中的其他内容的相互作用，人类的视觉就是如此的发达且快速精准，这是十分符合我们实际的应用中遇到各种场景的。

​	例如：在自动驾驶中车辆在行驶过程中我们很少用意识思维，即经过思考后才做出的决定，而是应该下意识就应该做出的反应。这种快速且准确的物体检测算法才能满足计算机以及嵌入式设备在没有专用的传感器的情况下驾驶汽车，并且可以让辅助设备向人类传达实时的场景信息，有望设计出通用的且反应灵敏的机器人系统。

![image-20231012145950075](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012145950075.png)

YOLOV5是2020年Ultralytics在GitHub上发布的单阶段目标检测算法，源码地址：https://github.com/ultralytics/yolov5。该算法是YOLO算法（卷积神经网络）革命性的迭代，该算法在YOLOv4的基础上添加了一些新的改进思路，使其速度与精度都得到了极大的性能提升。该目标检测算法是基于Pytorch深度学习框架上搭建的，所以具有易用、可附加功能和高性能的特性。

![image-20231012145959744](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012145959744.png)

### 8.1 部署yolov5源码

①获取源码：git clone https://github.com/ultralytics/yolov5

这里推荐直接下载源码压缩包：https://github.com/ultralytics/yolov5/archive/refs/tags/v6.0.tar.gz

②下载完成后，在Ubuntu中解压yolov5-6.0.tar.gz源码压缩包：`tar –xzvf yolov5-6.0.tar.gz`

解压完成后获取如下目录：

![image-20231012150038899](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150038899.png)

③下载模型文件：https://github.com/ultralytics/yolov5/releases/download/v6.0/yolov5s.pt

④传入Ubuntu中的yolov5-6.0目录下

![image-20231012150057889](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150057889.png)



测试YOLOV5-6.0：

```shell
python detect.py
```

![image-20231012150131428](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150131428.png)

### 8.2 修改模型文件并导出模型

接下来我们会修改模型文件，导出模型用于K510的端侧部署，进入model目录下修改`yolo.py`

![image-20231012150217301](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150217301.png)



![image-20231101150423012](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231101150423012.png)

修改完成后导出yolov5s.pt模型文件为ONNX格式，输入：

```shell
python export.py --weights yolov5s.pt --include onnx --dynamic
```

将官方的yolov5s的pytorch模型导出为动态输入的onnx模型文件。

![image-20231012150326647](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150326647.png)



由于之前我们导出模型文件为动态输入的，我们需要固定输入尺寸，所以需要简化模型：

```shell
python -m onnxsim yolov5s.onnx yolov5s-sim.onnx --input-shape 1,3,320,320
```

![image-20231012150426374](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150426374.png)

在yolov5-6.0目录下可以查看简化后生成的yolov5s-sim.onnx 模型文件

![image-20231012150438152](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150438152.png)

**Pytorch模型与ONNX模型**

model.pt模型文件是**pytorch**框架中用于保存和加载权重和网络结构的一种格式。

![image-20231012150543515](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150543515.png)

**ONNX**（英语：Open Neural Network Exchange）是一种针对机器学习所设计的**开放式的文件格式**，用于存储训练好的模型。它使得不同的人工智能框架（如Pytorch、MXNet）可以采用相同格式存储模型数据并交互。 ONNX的规范及代码主要由[微软](https://zh.wikipedia.org/wiki/微软)，[亚马逊](https://zh.wikipedia.org/wiki/亞馬遜公司)，[Facebook](https://zh.wikipedia.org/wiki/Facebook)和[IBM](https://zh.wikipedia.org/wiki/IBM)等公司共同开发，以开放源代码的方式托管在[Github](https://zh.wikipedia.org/wiki/Github)上。

![image-20231012150600065](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150600065.png)



**查看ONNX模型**

将生成的onnx模型上传至netron网站并查看模型结构：https://netron.app/

![image-20231012150642906](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012150642906.png)

