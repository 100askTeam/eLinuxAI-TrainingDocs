---
sidebar_position: 7
---
# 7.模型及部署

### 5.1 模型

我们有了网络结构，那么这里就需要继续引入一个概念 **模型** 。

什么是模型？在人工智能中，**模型**本质就是一个**函数**。而这个函数是通过我们大量的数据给到机器中，机器通过不断的迭代找出一个满足我们提供的数据的函数，可以根据这个函数去预测新数据所对应的结果。通过上面介绍的几种基本的算法，就是在数据的基础上创建机器学习的**模型**的过程。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012141452664.png)

模型=参数+架构+算法。

参数是什么？在上文我们已经提及，我们在神经网络中从输入层传输到隐含层的权重、偏置都算是参数，这就是模型中可训练的参数。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012141519081.png)

架构是什么？创建了两个不同架构的神经网络，相同的数据集使用不同的架构也会产生不同的预测函数，所以架构也构成模型的重要组成。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012141530725.png)

算法是什么？我们创建的模型里存储的目标函数，那么怎么去求解该目标函数的方法就称为算法。就例如在解决机器学习过程中的损失函数的求解就有：最小二乘法、牛顿法、阻尼牛顿法等。激活函数的选择：Sigmoid函数、双曲正切激活函数、ReLU激活函数等。这些就是需要选择符合你数据集的的算法。

![image=](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012141946623.png)

### 5.2 模型的部署

模型的部署分为云端部署和边缘部署。

**云端部署**主要是在中心服务器中训练的引擎库，**边缘部署**是在主机设备中进行数据的处理和模型推理，生成模型后打包进SDK包中，编译后集成到嵌入式设备里。

在前几年的时候，嵌入式设备只能利用CPU执行简单的AI任务或者将数据发送到云端服务器，使用云端服务器接收到申请后，将数据使用服务器端的模型进行推理，推理结果返回给嵌入式设备进行进一步处理。

随着芯片技术的发展，嵌入式设备的算力增加使得可以将模型部署到嵌入式设备中，不需要将数据发送到云端来运行模型；嵌入式设备采集数据，直接运行模型进行推理，再将推理结果返回用作某项任务的一部分。采集的数据也可暂时存储到设备中，后者发送到云端进行存储。

**嵌入式AI中数据的采集和分析推理都在本地**，可以降低数据传输的成本和保证数据的安全以及推理决策的实时性。所以为了保证实时性我们的模型需要在指定设备中推理运行。