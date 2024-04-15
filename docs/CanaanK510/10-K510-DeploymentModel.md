---
sidebar_position: 3
---
# K510端侧部署模型

### 10.1 DongshanPI-vision开发板操作

①转换完成后将生成的yolov5s-sim.kmodel文件拷贝到开发端执行。

②将文件拷贝到`/app/ai/kmodel/kmodel_release/object_detect/yolov5s_320/`目录下存放，如下所示：

```
cp yolov5s-sim.kmodel /app/ai/kmodel/kmodel_release/object_detect/yolov5s_320/
```

![image-20231012151351152](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151351152.png)

③在/app/ai/shell 目录下修改object_detect.sh脚本文件：

```
 vi object_detect.sh
```

修改脚本文件中的执行程序内容：

```
cd ../exe && ./object_detect ../kmodel/kmodel_release/object_detect/yolov5s_320/yolov5s-sim.kmodel 320 240 320 0.5 0.45 ./video_object_detect_320.conf 1 0 None
```

![image-20231012151407329](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151407329.png)

④修改完成后执行object_detect.sh脚本

```
./object_detect.sh
```



### 10.2 脚本文件讲解

①运行AI显示任务时需要优先保证屏幕显示正常，即调整显示相关的QoS为高优先级。

```
devmem 0x970E00fc 32 0x0fffff00
devmem 0x970E0100 32 0x000000ff
devmem 0x970E00f4 32 0x00550000
```

上述是通过devmem直接去读写寄存器的值。

![image-20231016182416187](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231016182416187.png)

②进入可执行程序路径。

```
cd ../exe
```

③执行目标检测应用并传入对应参数。

```
./object_detect ../kmodel/kmodel_release/object_detect/yolov5s_320/yolov5s_320_sigmoid_bf16_with_preprocess_output_nhwc.kmodel 320 240 320 0.5 0.45 ./video_object_detect_320.conf 1 0 None
```

| AI应用参数介绍：                                             |
| ------------------------------------------------------------ |
| 参数1：模型路径（kmodel）                                    |
| 参数2：模型尺寸（320）                                       |
| 参数3：视频宽度（240）                                       |
| 参数4：视频高度（320）                                       |
| 参数5：检测对象阈值（0.5）用于区分对象还是非对象object，检测框中是否含有目标。 |
| 参数6：非极大值抑制（0.45）用于找出最佳的预测框。            |
| 参数7：摄像头描述文件（ video_object_detect_320.conf ）      |
| 参数8：图像输入格式（1） 其中1表示RGB，0表示BGR              |
| 参数9：是否启用时间计数（0）                                 |
| 参数10：中间图像文件夹路径（None）                           |