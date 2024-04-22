---
sidebar_position: 2
---
# 2.nncase进行模型转换

![image-20231012151211305](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151211305.png)

我们现在已经将模型从pytorch格式转换为onnx格式，现在我们需要将模型继续转换为nncase格式的模型文件。



所以我们需要使用到nncase中Compiler部分，将ONNX模型转换为DongshanPI-Vision开发板（K510芯片）中使用的kmodel文件。



我们已经提前在Ubuntu中提供好了模型转换程序，程序位于`/home/ubuntu/yolov5s-modelTransformation`下`gen_yolov5s_320_with_sigmoid_bf16_with_preprocess_output_nhwc.py`

①将刚刚生成的onnx拷贝到当前目录下，如下图所示：

![image-20231012151226736](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151226736.png)

②执行该程序转换模型：

```shell
python gen_yolov5s_320_with_sigmoid_bf16_with_preprocess_output_nhwc.py --target k510  --dump_dir ./tmp --onnx ./yolov5s-sim.onnx --kmodel ./yolov5s-sim.kmodel
```

![image-20231012151238188](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151238188.png)

阅读nncase开发手册，了解模型转换程序gen_yolov5s_320_with_sigmoid_bf16_with_preprocess_output_nhwc.py

对比提供的API与实际的模型转换程序。打开文档网址：https://canaan-docs.100ask.net/Application/AIApplicationDevelopment-Canaan/05-nncase_Developer_Guides.html

![image-20231012151254481](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151254481.png)

**模型转换程序**

![image-20231012151309507](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151309507.png)