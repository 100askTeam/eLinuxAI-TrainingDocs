---
sidebar_position: 4
---
# 训练自定义模型部署

### 11.1 嵌入式AI模型部署流程

嵌入式AI模型部署流程如下图所示：

![image-20231012151818473](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151818473.png)

### 11.2 yolov5训练自定义数据集

**1.准备数据集**

您可以通过相机设备准备图像数据集，如下所示：

![image-20231012151902159](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151902159.png)

**2.数据预处理（可选）**

 **数据集成**是将来自多个不同源的数据通过一定的思维逻辑或物理逻辑集成到一个统一的数据集合中。

**数据转换**是将数据从一种表示形式变为另一种表现形式的过程。即将数据类型转换/数据语义转换数据粒度转换等。

**数据清洗**是对一些没有用的数据进行处理的过程。很多数据集存在数据缺失、数据格式错误、错误数据或重复数据的情况，如果要使数据分析更加准确，就需要对这些没有用的数据进行处理。

**数据降维**是一种维度缩减技术，指在某些限定条件下，降低随机变量个数，得到一组“不相关”主变量的过程。对数据进行降维一方面可以节省计算机的储存空间，另一方面可以剔除数据中的噪声并提高机器学习算法的性能。有时用于神经系统科学是信息量最大的维度它找到数据集的低维表示信息尽可能的保留原始数据。

![image-20231012151955190](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012151955190.png)

**3.数据标注**

我们需要使用到开源的标注软件labelImg，仓库地址：https://github.com/HumanSignal/labelImg

①Windows端下载地址：https://github.com/tzutalin/labelImg/files/2638199/windows_v1.8.1.zip

②Ubuntu端使用方法：

  1.pip3 install labelImg -i https://pypi.tuna.tsinghua.edu.cn/simple/

  2.labelImg

> 注意需要额外安装两个库：
>
> ​	sudo apt-get install libxcb-xinerama0
>
> ​	sudo apt-get install libxcb-cursor0

![image-20231012152019088](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152019088.png)

打开labelImg软件后，进行图像标注操作。如下所示：

打开数据集文件夹：

![image-20231012152048093](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152048093.png)

修改存放label标签的文件夹：

![image-20231012152100020](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152100020.png)

修改标签格式为YOLO格式：

![image-20231012152225585](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152225585.png)

绘制一个新的框：

![image-20231012152239475](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152239475.png)

绘制完成后添加标签：

![image-20231012152255901](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152255901.png)

绘制后效果图：

![image-20231012152304116](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152304116.png)

绘制后，点击Save保存标签值到我们刚刚选择的保存目录中。

![image-20231012152318632](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152318632.png)

点击Next可以选择下一张图片继续标注

![image-20231012152328547](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152328547.png)

![image-20231012152342285](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152342285.png)

标注完成后会得到如下标签值数据集：

![image-20231012152400594](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152400594.png)

classes.txt文件中包含标注的标签名

![image-20231012152418935](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152418935.png)



**4.拆分数据集**

在模型训练中，需要有训练集和验证集。可以简单理解为网络使用训练集去训练，训练出来的网络使用验证集验证。在总数据集中**训练集**通常应占**80%**，**验证集**应占**20%**。所以将我们标注的数据集按比例进行分配。



创建训练文件夹train，文件夹中存放图像images和对应的labels。

创建验证文件夹val，文件夹中存放图像images和对应的labels。

![image-20231012152533579](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152533579.png)

训练数据集

![image-20231012152543303](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152543303.png)

验证数据集

![image-20231012152640822](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152640822.png)

在yolov5源码目录下新建数据集文件夹100ask_datasets，存放训练数据集合验证数据集。

![image-20231012152704559](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152704559.png)

**注意**：数据集文件夹需要放在未修改模型文件的yolov5-6.0项目目录下。



**6.创建数据集配置文件**

新建数据集配置文件，该文件包含训练数据集路径、验证数据集路径、类别数、标签值。

![image-20231012152740199](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152740199.png)

进入models目录下，拷贝yolov5s.yaml文件，粘贴并models目录下重命名为100ask_yolov5s.yaml

![image-20231012152757376](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152757376.png)

**7.修改模型配置文件**

**注意：**

修改100ask_yolov5s.yaml中类别的数目为自己训练模型的类别的数目。

![image-20231012152816187](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152816187.png)

假设我这里的数据集只有1个类别，就修改为1。如果您的类别为3或者更多，就修改为3或者更多。



**8.修改训练程序train.py**

打开yolov5-6.0项目文件夹中的train.py，修改数据配置文件路径，如下图红框所示中的内容：

![image-20231012152836002](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152836002.png)

修改后如下所示： 

```python
parser.add_argument('--cfg', type=str, default='models/100ask_yolov5s.yaml', help='model.yaml path')
parser.add_argument('--data', type=str, default=ROOT / 'data/100ask-data.yaml', help='dataset.yaml path')
```



**9.执行训练程序train.py**

在终端输入：

```shell
python train.py  
```

输入完成后，等待训练完成。默认会迭代300次，如果您的电脑配置过低，请修改迭代次数。

![image-20231012152920257](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152920257.png)

**FAQ:**

1.RuntimeError: result type Float can't be cast to the desired output type long int

![image-20231103102409933](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231103102409933.png)

原因：原因是新版本的torch无法自动执行此数据类型转换，旧版本torch可以。

解决办法：

 修改yolov5-6.0/utils/loss.py文件的173行，在yolov5项目目录下执行

```shell
vi utils/loss.py +173
```

将原来的代码修改为：

```python
gain = torch.ones(7, device=targets.device).long()
```

**FAQ：**

2.home/ubuntu/.local/lib/python3.8/site-packages/torch/functional.py:504: UserWarning: torch.meshgrid: in an upcoming release, it will be required to pass the indexing argument. 

![image-20231103105111883](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231103105111883.png)

原因：文件中用到了torch.meshgrid函数，而该函数严格调用需要显示地传递“indexing”参数

解决办法：

 修改/home/ubuntu/.local/lib/python3.8/site-packages/torch/functional.py 文件的504行

```
vi /home/ubuntu/.local/lib/python3.8/site-packages/torch/functional.py +504
```

将原来的代码修改为：

```
 return _VF.meshgrid(tensors, **kwargs, indexing = 'ij') # type: ignore[attr-defined]
```



训练所需的时间与你设置的迭代epoch值有关

![image-20231012152935042](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012152935042.png)

等待训练完成后，会在yolov5-6.0项目runs/train/exp*目录下，看到对应的训练结果。

![image-20231012153123740](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153123740.png)

我们可以在weight目录下，看到最好的模型文件和最后训练的模型文件。

![image-20231012153133233](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153133233.png)



**8.验证模型**

修改val.py程序中的数据集配置文件和模型文件

![image-20231012153146764](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153146764.png)

修改结果为：

![image-20231012153209267](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153209267.png)

修改完成后，在yolov5-6.0项目目录终端下执行 ：

```
python val.py
```

![image-20231012153220312](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153220312.png)

![image-20231012153227516](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153227516.png)



**9.使用新模型预测图像**

在yolov5-6.0项目目录中，进入data目录下，新建100ask-images文件夹，用于存放测试图片，如下图所示：

![image-20231012153311470](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153311470.png)

修改yolov5-6.0项目目录中detect.py程序中的模型路径和测试图像路径

![image-20231012153320057](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153320057.png)

修改结果为：

![image-20231012153332849](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153332849.png)

修改完成后，在yolov5-6.0项目目录终端下执行 ：python detect.py

![image-20231012153343118](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153343118.png)

执行完成后，我们可以在runs/detect/exp*目录下查看，测试后的图片。

![image-20231012153407354](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153407354.png)



**10.使用修改模型文件后的yolov5项目导出模型**

将我们训练出来的best.pt，放入使用修改模型后的yolov5源码目录下。

![image-20231012153419199](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153419199.png)

修改export.py程序中的数据集描述文件路径和模型路径：

![image-20231012153549597](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153549597.png)

修改结果为：

![image-20231012153601242](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153601242.png)

注意：将数据集描述文件拷贝到该项目中的data目录下。

导出动态模型，在终端输入：

```
python export.py --include onnx --dynamic
```

![image-20231012153618611](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153618611.png)

导出新模型文件为ONNX格式：

![image-20231012153629159](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153629159.png)



固定模型的输入尺寸，在yolov5-6.0项目终端输入：

```
python -m onnxsim best.onnx best-sim.onnx --input-shape 1,3,320,320
```

![image-20231012153659361](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153659361.png)

简化完成后，我们可以在yolov5-6.0目录下看到生成的best-sim.onnx的文件。



**11.查看新模型**

使用netron查看模型文件

![image-20231012153727085](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153727085.png)





**12.转换新模型为kmodel**

将模型文件传入yolov5s模型文件转换文件夹，使用

`gen_yolov5s_320_with_sigmoid_bf16_with_preprocess_output_nhwc.py`程序进行模型转换：

![image-20231012153750935](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153750935.png)

yolov5s模型文件转换文件夹，如下所示：

![image-20231012153800580](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153800580.png)

在终端输入：

```shell
python gen_yolov5s_320_with_sigmoid_bf16_with_preprocess_output_nhwc.py --target k510  --dump_dir ./tmp --onnx ./best-sim.onnx --kmodel ./best-sim.kmodel
```

![image-20231012153813460](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153813460.png)

转换完成后，我们可以在当前模型转换目录下看到生成的`best-sim.kmodel`的文件。

### 11.3 获取并编译AI应用程序

**获取AI应用程序**

①在Ubuntu家目录下输入：

```
git clone https://e.coding.net/weidongshan/dongsahnpi-vision/100ask_base-aiApplication-demo.git
```

②获取完成后，可以在家目录下，看到名为`100ask_base-aiApplication-demo`的文件夹。进入`100ask_base-aiApplication-demo`文件夹下可以看到里面存放有对应的代码。

```shell
ubuntu@ubuntu2004:~$ cd 100ask_base-aiApplication-demo
ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo$ ls
```

![image-20231012153858369](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153858369.png)

③下载对应交叉编译工具链：https://dongshanpi.cowtransfer.com/s/55562905c0e245

并将其放在100ask_base-aiApplication-demo目录下。

![image-20231012153911138](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012153911138.png)

④解压交叉编译工具链：

```shell
 tar -xzvf riscv64-buildroot-linux-gnu_sdk-buildroot.tar.gz 
```



**编译AI应用程序**

①进入AI应用源码目录：

```shell
ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo$ cd code/
```

②激活环境变量：

```shell
ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo/code$ source build.sh
```

③配置完成后，在终端输入make，开始编译应用程序。

```shell
ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo/code$ make
```

④安装应用程序到tmp目录下：

```shell
ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo/code$ make install
```



### 1.1.4 修改目标检测应用源码

进入yolov5应用源码文件夹：

```shell
ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo/code$ cd object_detect
```

进入文件夹后可以看到如下图中的文件，修改红框中`object_detect.h`文件

![image-20231012154059751](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154059751.png)

修改类别数CLASS_NUM为您自定义训练集中所使用的类别数。需要和您定义的模型描述文件100ask_yolov5s.yaml对应。

![image-20231012154109522](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154109522.png)

修改标签值为您自定义数据集中的标签值，需要和您自定义数据集描述文件100ask-data.yaml中的class names对应。

![image-20231012154117893](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154117893.png)

修改先验框Anchor为您自定义训练集中所使用的参数。需要和您定义的模型描述文件100ask_yolov5s.yaml对应。

![image-20231012154127470](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154127470.png)

重新编译AI应用：

```shell
ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo/code/object_detect$ make clean

ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo/code/object_detect$ make

ubuntu@ubuntu2004:~/100ask_base-aiApplication-demo/code/object_detect$ make install
```

进入tmp/app/ai/exe目录下即可找到编译新生成的yolov5目标检测应用`object_detect`。

![image-20231012154157970](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154157970.png)



### 11.5 开发板运行验证

拷贝生成的模型文件`best.kmodel`和`object_detect`可执行程序到开发板端运行。

![image-20231012154220532](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154220532.png)

这里我使用TF卡的形式也可以使用ssh，拷贝文件到开发板中。

下图中有展示TF卡槽位置：

![image-20231012154246555](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154246555.png)

开始前，请连接摄像头和屏幕。

如下图所示：

![image-20231012154256224](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154256224.png)



开发板运行验证：

①将模型文件拷贝到/app/ai/kmodel/kmodel_release/object_detect/yolov5s_320/目录下：

```shell
[root@canaan ~/sd/p1 ]$ cp best-sim.kmodel /app/ai/kmodel/kmodel_release/object_detect/yolov5s_320/
```

②将object_detect 重命名并拷贝到/app/ai/exe/文件夹下

```shell
[root@canaan ~/sd/p1 ]$ mv object_detect object_detect_100ask
[root@canaan ~/sd/p1 ]$ ls
System Volume Information object_detect_100ask
best-sim.kmodel
[root@canaan ~/sd/p1 ]$ cp object_detect_100ask /app/ai/exe/
```

④将模型文件拷贝到`/app/ai/kmodel/kmodel_release/object_detect/yolov5s_320/`目录下：

```shell
[root@canaan ~/sd/p1 ]$ cp best-sim.kmodel /app/ai/kmodel/kmodel_release/object_detect/yolov5s_320/
```

⑤进入/app/ai/shell/目录下

```shell
[root@canaan ~/sd/p1 ]$ cd /app/ai/shell/
```

⑥修改目标检测应用脚本object_detect.sh

```shell
[root@canaan /app/ai/shell ]$ vi object_detect.sh
```

修改内容为：

![image-20231012154520733](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012154520733.png)

注释原来的执行程序，新增下面的执行程序命令：

```shell
cd ../exe && ./object_detect_100ask ../kmodel/kmodel_release/object_detect/yolov5s_320/best-sim.kmodel 320 240 320 0.5 0.45 ./video_object_detect_320.conf 1 0 None
```

运行新的目标检测应用程序和新模型。

⑦执行脚本验证：

```shell
[root@canaan /app/ai/shell ]$ ./object_detect.sh
```

![image-20231012155036676](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012155036676.png)

验证结果从上图可以看到，这就证明我们自定义训练出来开的模型文件已经成功部署到开发板端。