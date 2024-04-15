---
sidebar_position: 6
---
# 深度学习框架Pytorch入门

### 3.1 深度学习框架简介

**什么是深度学习框架？**

在深度学习初始阶段，每个深度学习研究者都需要写大量的重复代码。为了提高工作效率，这些研究者就将这些代码写成了一个框架放到网上让所有研究者一起使用。接着，网上就出现了不同的框架。随着时间的推移，最为好用的几个框架被大量的人使用从而流行了起来。

深度学习框架是一种界面、库或工具，它使我们在无需深入了解底层算法的细节的情况下，能够更容易、更快速地构建深度学习模型。深度学习框架利用预先构建和优化好的组件集合定义模型，为模型的实现提供了一种清晰而简洁的方法。深度学习框图如下所示：

![image-20231023120738079](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023120738079.png)



下面举两个例子来解释深度学习框架。

例子1：深度学习框架就是库，目前市面上有很多不同牌子的库，库里面就一套积木。这套积木里面包含很多组件，如：模型、算法等。也就是说这些积木已经把底层的数学公式帮你实现了，你无需从零开始实现数学公式的复杂运算，只需要关心怎么设计积木搭建城建符合你数据集的积木。目前就有很多牌子的积木，如Pytorch、TensorFlow、Caffe等。

这套积木里面包含：预定义模型、反向传播算法、梯度下降等预先定义的函数，供开发者可以自由搭建成符合自己数据集的神经网络。

![image-20231012143132845](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143132845.png)

例子2：假设数据集就是食材，我们需要对食材进行加工，需要用到锅、铲子、刀等厨具。这里我们就需要去选择不同品牌的厨具，当然我们厨具里面有很多工具，你只需要自己搭配厨具使用，不需要从头开始磨刀/炼钢（不需要从零开始实现数学公式）。假设你要做的菜是糖醋排骨，那么不同牌子提供的厨具套装里面，都可以实现你这道菜，那可以使用Pytorch牌厨具套装做成，你也可以使用TensorFlow牌厨具套装做成。

![image-20231012143148580](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143148580.png)

**为什么要使用深度学习框架？**

因为使用深度学习框架可以降低入门的门槛，你可以不用从复杂的神经网络开始编写代码，也不需要去手动实现梯度下降、前向传播、反向传播等，你可以依据预先定义好的模型的基础上增加自己的模型、搭建自己的网络层、选择自己需要的分类器。简而言之，使用深度学习框架这个库就是加快搭建神经网络的速度，直接使用其预先定义好的API，即可实现自己的神经网络模型的搭建。

![image-20231012143200229](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143200229.png)

深度学习框架对比

![image-20231229160605428](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231229160605428.png)

### 3.2 深度学习框架-pytorch

由于Pytorch的生态建设较好同时底层细节较好，下面主要使用Pytorch来对深度学习框架进行讲解快速入门程序。打开Pytorch网址：https://pytorch.org/
![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143439270.png)

打开官方Pytorch快速入门的链接：https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html

![image-20231012143450574](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143450574.png)

### 3.3 求解服饰图像多分类问题

#### 3.3.1 多分类问题介绍

快速入门程序是求解多分类问题，从网上下载的FashionMNIST数据集，该数据集包含黑白图像有：

t-shirt（T恤），trouser（牛仔裤），pullover（套衫），dress（裙子），coat（外套），sandal（凉鞋），shirt（衬衫），sneaker（运动鞋），bag（包），ankle boot（短靴）。

多分类问题目的是：建立一个模型可以实现下面图像的分类。

![image-20231012143536029](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143536029.png)

#### 3.3.2 程序流程框图

程序流程图如下所示：

![image-20231101154919969](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231101154919969.png)

#### 3.3.3 程序源码解析

程序源码解析：

**1.引入pytorch包**

```python
import torch  #引入pytorch包，该包中包含tensor（多维矩阵）的数据结构以及对应的数学运算
from torch import nn #引入pytorch中的nn包，该包预先定义网络层，例如卷积层、池化层、激活函数及损失函数等。
from torch.utils.data import DataLoader #该包主要用于加载数据集和对数据集进行划分。
from torchvision import datasets #该包主要用于引入数据集模块，该模块中包预定义有常见的数据集，同时可用于构建自定义的数据集。
from torchvision.transforms import ToTensor #该包主要用于将PIL图像或者numpy中N维数组类型的对象 转换为 tensor ，并且支持缩放对应值。
```

**2.下载训练数据集**

```python
# Download training data from open datasets.下载训练数据集
training_data = datasets.FashionMNIST(
	root=“data”,	#数据集存放路径，当前目录下的data文件夹下
	train=True,		#表示该数据集为训练数据集
	download=True,	#是否需要网络下载
	transform=ToTensor(), #将下载的数据集快速切换为pytorch可使用的tensor(多维矩阵)
)
```

![image-20231012143801588](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143801588.png)

**3.下载测试数据集**

```python
# Download test data from open datasets.
test_data = datasets.FashionMNIST(
	root="data",	#数据集存放路径，当前目录下的data文件夹下
	train=False,	#表示该数据集为测试数据集
	download=True,	 #是否需要网络下载
	transform=ToTensor(),	#将下载的数据集快速切换为pytorch可使用的tensor(多维矩阵)
)
```

![image-20231012143903090](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012143903090.png)

**4.加载数据集**

```python
batch_size = 64 #设置批次大小（批次：每次读取的数量）
# Create data loaders.
train_dataloader = DataLoader(training_data, batch_size=batch_size) #加载训练集
test_dataloader = DataLoader(test_data, batch_size=batch_size) #加载测试集
#每次以迭代器的方式返回一批64个数据和标签。

for X, y in test_dataloader:
	print(f"Shape of X [N, C, H, W]: {X.shape}") #X为转换后的tensor数据
	print(f"Shape of y: {y.shape} {y.dtype}") # y为标签， y.dtype表示数据元素的数据类型

	break
```

X [N, C, H, W]: batchsize，channel，height，weight。batchsize是我们设置的批次大小64，也就是一次取64张图像；channel为1表示通道数，灰度图为1，彩色图为3；高度和宽度则是单张图像的大小28*28像素。

5.指定加载设备

```python
# Get cpu, gpu or mps device for training.
device = (
    “cuda”
    if torch.cuda.is_available()	#判断系统是否支持CUDA
    else “mps”
    if torch.backends.mps.is_available()	#判断系统是否支持MPS
    else "cpu"
    )
print(f"Using {device} device")

```

 **CUDA** 是 NVIDIA 发明的一种并行计算平台和编程模型。它通过利用图形处理器 (GPU) 的处理能力，可大幅提升计算性能。

多进程服务(**MPS**)是另一种二进制兼容的实现CUDA应用程序编程接口，透明地支持协作式多进程CUDA应用程序

**6.定义模型**

创建pytorch模型，为了定义一个模型，创建一个从[nn.Module](https://pytorch.org/docs/stable/generated/torch.nn.Module.html)继承的类，在NeuralNetwork类中使用__init__函数定义了网络层，使用forward函数定义指定数据如何通过网络。

```python
# Define model
class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10)
        )
    #参数传播方向：前向传播
    def forward(self, x): 
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits
model = NeuralNetwork().to(device)
print(model)

```

nn.Flatten()：将连续的维度范围展平为张量。

nn.Sequential：有序容器，神经网络模块将按照在传入构造器的顺序依次被添加到计算图中执行，同时以神经网络模块为元素的有序字典也可以作为传入参数。

![image-20231229171212035](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231229171212035.png)

**6.1 Linear层研究**

Linear是线性层；ReLU是激活函数。Linear的函数定义为：

```python
torch.nn.Linear(
	in_features, #每次输入的样本大小 
	out_features, #每次输出的样本大小
	bias=True, #如果设置为False，该层附加偏置。默认值:True 
	device=None, 
	dtype=None
)
```

Linear线性层是将输入执行一次线性变换，函数定义为：

$$
y=xA^T+b
$$
其中x为输入，A^T 为权重，A^T为A的转置矩阵，b为偏置.

```python
import torch
from torch import nn
model = nn.Linear(2,1) #输入特征数为2，输出特征数为1
print(model)
input = torch.Tensor([[100,200],[300,400]]) #输入一个2×2的矩阵
print(input)
print(input.size())
output = model(input)
print(output)
print(output.size())
for param in model.parameters():
print(param)
```

该段程序的运行结果：

```
Linear(in_features=2, out_features=1, bias=True)
tensor([[100., 200.],    [300., 400.]])
torch.Size([2, 2])
tensor([[47.2638],    [99.8806]], grad_fn=<AddmmBackward0>)
torch.Size([2, 1])
Parameter containing:
tensor([[0.0527, 0.2103]], requires_grad=True)
Parameter containing:
tensor([-0.0788], requires_grad=True)
```

其中model是通过torch.nn创建的**线性层模块**，input是通过torch.Tensor创建的2×2矩阵， output是input矩阵通过线性层后的**结果矩阵**。

由打印信息可知，创建的model函数输入特征数为2，输出特征数为1。偏置设置为True，即使用偏置值。输入矩阵input为[(100&200@300&400)]，输出矩阵output为[(47.2638@99.8806)]，权重矩阵A为[8(0.0527&0.2103)]，偏置值为-[0.0788]



Linear层数学推导：

![image-20231229171308398](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231229171308398.png)

其中b原本为-[0.0788]，由于广播机制，变换为b=[(-0.0788@-0.0788)]

最后计算的y值为[(47.2512@99.8512)],与程序计算出来的[(47.2638@99.8806)]

是存在一定的误差，这就是计算机利用二进制表示小数，在进行矩阵运算时，尾数存储时会出现舍入的情况，类似于我们小时候学习的四舍五入，舍入的情况会导致二进制的保存值大于真实值或小于真实值，这就会导致计算机在计算浮点数产生误差的原因。 



**7.损失函数和优化器**

为了训练模型，还需要增加一个**损失函数**和一个**优化器对象**，优化器对象可以保存当前状态，并根据计算出的梯度更新参数。损失函数使用**交叉熵损失函数**，优化器使用的是torch.optim.SGD**随机梯度下降**。

```python
loss_fn = nn.CrossEntropyLoss() #损失函数使用交叉熵损失函数
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3) #神经网络优化器，主要是为了优化我们的神经网络，使他在我们的训练过程中快起来，节省神经网络训练的时间。
```

交叉熵损失函数是用来衡量目标值和预测值之间的**差距**，在深度学习中常用于解决**多分类问题**。

![image-20231019114932698](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019114932698.png)

随机梯度下降用于在**反向传播**中**更新**模型中的梯度值。梯度值如图中红色箭头所示。



torch.optim.SGD()是**随机梯度下降函数**，传入的参数为：保存有**权重**和**偏置**的参数量model.parameters(), 学习率lr。梯度下降一般分为**批量梯度下降**和**随机梯度下降**，其中批量梯度下降是在更新参数时使用**所有样本**来更新梯度，随机梯度是在求解梯度时没有使用全部的样本，而是仅随机选取**一个样本**来求解梯度。

批量梯度下降：

![image-20231012145026967](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012145026967.png)

随机梯度下降：

![image-20231012145048678](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012145048678.png)

> **如何理解上述两个公式：**
>
> 1.批量梯度下降：每次都要计算所有实际样本与预测样本的误差值。
>
> 2.随机梯度下降：每次随机选取一个实际样本与预测样本计算误差值。

![image-20231019115408021](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019115408021.png)

**8.定义训练函数**

在训练循环中，模型对训练的数据集进行预测，使用反向传播预测误差并更新模型的参数，同时根据测试数据集检查模型的性能确保训练的方向正确。

```python
def train(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset) #数据集的长度
    model.train() #设置模型为训练模式
    for batch, (X, y) in enumerate(dataloader):
        X, y = X.to(device), y.to(device) #指定数据加载到指定设备中
        # Compute prediction error
        pred = model(X) #利用模型求解预测值
        loss = loss_fn(pred, y) #求解预测值和真实值的损失函数
        # Backpropagation
        loss.backward() #反向传播计算当前梯度
        optimizer.step() #根据梯度更新网络参数
        optimizer.zero_grad() #梯度清零
        if batch % 100 == 0:
            # loss.item()是提取损失值的高精度值， (batch + 1) * len(X) 是计算当前训练的数据位置
            loss, current = loss.item(), (batch + 1) * len(X)
            print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")
```

**9.定义测试函数**

测试函数中不去反向计算梯度，只使用模型去求解预测损失值，并且计算其模型损失值和精度。

```python
def test(dataloader, model, loss_fn):
    size = len(dataloader.dataset) #数据集的长度
    num_batches = len(dataloader)  #批次大小
    model.eval() #设置模型为测试模式
    test_loss, correct = 0, 0 
    with torch.no_grad(): #不计算反向梯度
        for X, y in dataloader:
            X, y = X.to(device), y.to(device) #指定数据加载到指定设备中
            pred = model(X) #利用模型求解预测值
            test_loss += loss_fn(pred, y).item()  #计算模型损失
            correct += (pred.argmax(1) == y).type(torch.float).sum().item() #计算模型精度
    test_loss /= num_batches
    correct /= size
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")
```

**10.训练模型**

我们设置的迭代次数为5次，每调用训练模型的函数一次，就调用测试模型函数去测试模型的精度和损失值。当迭代完成五次后，保存迭代后的模型文件为‘model.pth’

```python
epochs = 5 #设置迭代次数
for t in range(epochs):
    print(f“Epoch {t+1}\n-------------------------------”)
    train(train_dataloader, model, loss_fn, optimizer) #调用训练模型函数
    test(test_dataloader, model, loss_fn) #调用测试模型函数
print("Done!")
```

通过上述运行结果可以发现在不断的迭代后，精度在不断提升，损失在不断下降。这说明外面对模型的优化方式是可行的。

```python
torch.save(model.state_dict(), “model.pth”)  #保存模型，保存为当前目录中的model.pth
print("Saved PyTorch Model State to model.pth")
```

**模型训练过程示意图**

![image-20231012145706903](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012145706903.png)

**11.Pytorch使用训练好的模型进行测试**

加载刚刚训练完成的模型文件，将模型设置为测试模式，使用模型加载测试集中的图像，返回的结果与真实值比较，查看是否一致。

```python
model = NeuralNetwork().to(device)
model.load_state_dict(torch.load("model.pth"))
classes = [
    “T-shirt/top”,
    “Trouser”,
    “Pullover”,
    “Dress”,
    “Coat”,
    “Sandal”,
    “Shirt”,
    “Sneaker”,
    “Bag”,
    “Ankle boot”,
]
model.eval() #设置模型为测试模式
x, y = test_data[0][0], test_data[0][1] #设置测试数据和标签值
with torch.no_grad():
    x = x.to(device) #指定数据加载到指定设备中
    pred = model(x) # #利用模型求解预测值
    predicted, actual = classes[pred[0].argmax(0)], classes[y] #查看预测值和真实值
    print(f'Predicted: "{predicted}", Actual: "{actual}"')
```

Pytorch训练测试模型完整流程示意图

![image-20231012145922650](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012145922650.png)
