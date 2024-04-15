---
sidebar_position: 5
---
# 深度学习及神经网络

### 2.1 深度学习

**深度学习**是通过预先处理**大量**的标记数据，找到其**内在规律**和**表示层次**。**典型的深度学习模型就是神经网络**，神经网络中最基本的组成是神经元模型。

在生物神经网络中，每个神经元与与其他神经元相连，神经元之间的联系通过外部的**激励信号**做变化，每个神经元有可以接受多个激励信号从而呈现兴奋和抑制的状态，所以人脑在处理各种信息的结果是由各个**神经元**状态决定的。如下图所示，一个神经元接受到的外部电信号，可以呈现出兴奋和抑制两种状态。

![image-20231012110338954](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012110338954.png)

#### 2.1.1 人工神经元

**人工神经元**是根据生物神经元**模拟**出来的模型，在这个模型中，神经元可以接受n个从其他神经元传递过来的输入信号，输入信号通过带权重ω连接到神经元，将神经元的总输入值与阈值θ 进行比较，最后通过**激活函数**处理**输出**

![image-20231012110517556](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012110517556.png)

其中x_i为输入信号， ω_i为神经元连接权重， ∑为输入的总信号和， θ为阈值， y为激活函数。如果要使下一个神经元接受到信号，则接收到的各个信号一定要大于某一个阈值θ才能输出信号 ，该阈值有神经元本身决定。

#### 2.1.2 激活函数

**激活函数**（Activation Function）是一种在人工神经网络中的函数，旨在帮助网络学习数据中的复杂模式。

在神经元中，输入的input经过一系列加权求和后作用于另一个函数，这个函数就是这里的**激活函数**。

下图中为一个神经单元，该单元先不考虑阈值，展示一个神经元可以使用不同的激活函数来实现不同的任务。

![image-20231012110552325](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012110552325.png)

疑问：为什么这里的神经元阈值消失了？

答：神经网络中的**阈值函数**，一般也可称为**激活函数**。

可以先理解为把阈值和激活函数捆绑在一起称为一个函数。



神经网络中的激活函数就是为了增加非线性，激活函数选择了一个阈值，即当大于某个值就被激活，小于等于则输出0。其实这么做也符合人类直觉，对于脑细胞而言，应该也是存在某个阈值，该细胞就会被激活，或者变得敏感。

下面以一个阶跃函数为例，这个函数可以理解为：当输入没有超过阈值点时，所有的输出都为0。当输入大于阈值点是，就输出为5。

![image-20231023143953375](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023143953375.png)





下面展示一个简单的激活函数，该激活函数称为Sigmoid函数，它能够把输入的连续实值变换为0和1之间的输出，特别的，如果是非常大的负数，那么输出就是0；如果是非常大的正数，输出就是1。

![image-20231023144012470](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023144012470.png)

可以从上图看到， Sigmoid激活函数可以将输入的所有实数压缩在[0,1]范围内。所以Sigmoid函数也可以理解为压缩激活函数。



下面假设一个神经元使用Sigmoid激活函数的示意图。

![image-20231023144034488](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023144034488.png)

神经元计算过程为：

1.输入数据x_1 、x_2 、…、x_n进行求和操作，得到net值。

2.将net值传输Sigmoid激活函数，计算得到y值。

3.将y值作为神经元的输出。

#### 2.1.3 实现人工神经元模型

我们已经学习了一个拥有sigmod激活函数的神经元的结构及组成，那么下面我们编写一个python程序，使用numpy库实现一个神经元模型。该模型结构如下所示，该神经元接受10个输入信号x，权重w，偏置b。



![image-20231129184518390](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231129184518390.png)

程序流程图

![image-20231130121039631](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231130121039631.png)

python代码实现：

```python
import numpy as np #导入numpy库

def sigmoid(x):
  return 1 / (1 + np.exp(-x)) #实现sigmod函数公式

class Neuron:
  def __init__(self, weights, bias):
    self.weights = weights #各输入的权重值
    self.bias = bias #偏置值

  def forward(self, inputs):
    # 对输入进行加权求和，并增加偏置
    total = np.dot(self.weights, inputs) + self.bias
    return sigmoid(total) #返回sigmod激活函数输出的结果

x = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) #输入数据
weights = np.array([0.9, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.1, 0]) #权重参数
bias = 2 #偏置值
n = Neuron(weights, bias) #传入权重和偏置值

print(n.forward(x)) #打印神经元模型输出结果
```



### 2.2 感知机

#### 2.2.1 感知机模型

**感知机**（Perceptron）是一种简单的二元线性分类器，简单的来说就是可以将两个简单的样本进行分类。它和我们提到的神经元模型类似，也是由两层神经元组成，感知机也是通过输入层接受外界信号或其他神经元传递的信号，传递给输出层，输出层就是我们一开始介绍的M-P神经元（人工神经元）。

如下图所示，下图为一个接受两个输入信号的，输出一个信号的感知机。

![image-20231012111008179](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012111008179.png)

感知机和人工神经元一样可以接受多个输入信号，输出一个信号。但是对于感知机来说，输出的信号只会是0或1。

感知机与含Sigmoid激活函数的神经元不同的是，感知机使用的激活函数是符号（sign）函数，如下所示：

![image-20231023144107289](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023144107289.png)

如果对于接受两个输入信号的，输出一个信号的感知机来说，激活函数可以为：

![image-20231023144125069](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023144125069.png)

其中ω_1， ω_2为权重值； x_1， x_1为输入信号；b为偏置值；f(x)为输出信号。

> **注意：**增加偏置这个参数，可以提高神经网络的拟合能力，提升模型的精度，网络的自由度更大。

#### 2.2.2 鸢尾花二分类问题

​	二分类问题可能是应用最广泛的机器学习问题，它指的是所有数据的标签就只有两种，正面或者负面。

现在我们使用感知机算法来处理一个经典的鸢尾花分类问题，在一个鸢尾花数据集中有两种鸢尾花，分别是山鸢尾和变色鸢尾，如下图所示：

![Iris-Dataset-Classification](http://photos.100ask.net/eLinuxAI-TrainingDocs/Iris-Dataset-Classification.png)

那么现在准备山鸢尾和变色鸢尾的数据集，数据集中保存了两种鸢尾花的Sepal(萼片)长度/宽度和Petal(花瓣)长度宽度。下面以萼片长度为横坐标X，花瓣长度为纵坐标Y，绘制两种鸢尾花数据样本在坐标系中的表示，如图所示：

![image-20231227185330209](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231227185330209.png)

上图中红色样本代表山鸢尾样本，蓝色样本代表变色鸢尾样本。那么现在我就想找到一条直线可以划分红色样本点（负样本）和蓝色样本点（正样本），这就是一个二分类问题。

#### 2.2.3 实现感知机模型

假设直线函数为y=ωx+b，现在我们要找到合适的ω和b值，获得可以将正负样本完全区分开来的直线函数。我们通过感知机模型找到模型中的权重和偏置值从而找到该直线函数的ω和b值。下面我们设计python程序实现感知机模型，程序框图如下所示：

![image-20231201181955009](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231201181955009.png)



python程序代码：

1.导入依赖库，如numpy、pandas、matplotlib等；

2.使用pandas库读取鸢尾花数据集 ；

3.获得数据集中获得萼片长度和花瓣长度作为输入数据X。

4.以萼片长度为x横坐标，花瓣长度为y纵坐标，在坐标系上绘制鸢尾花数据集样本点。

![image-20231227185435322](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231227185435322.png)

5.获得鸢尾花数据集中的类别名，将类别名为山鸢尾设置为-1，将类别名为变色鸢尾设置为1。

6.创建感知机模型传入学习率和迭代次数。

7.拟合感知机模型，获得权重和偏置。

8.绘制迭代过程中分类错误的变化。

![image-20231204154300466](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231204154300466.png)

9.在坐标系中绘制分类直线函数。

![image-20231204154312747](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231204154312747.png)

在开始代码解析前我们需要先对权重更新和偏置更新进行说明，下面为权重和偏置的更新公式。
$$
权重更新公式：w=w + \alpha (y^i-h_\theta(x^i))x_j^i\\
偏置更新公式：b = b + \alpha(y^i-h_\theta(x^i))
$$
假设我们分类目标分别是正类（1）和负类（0），假设我们使用感知机进行分类时，假设原来的某点的正确类别是正类，y=1，算法将它判断为负类，即y=0，如下图所示：

![image-20231228150211153](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231228150211153.png)

可以看到上图中的蓝色样本点分类错误了，以这个蓝色点为例我们就可以知道，该点的：
$$
x_1w_1+x_2w_2+b<0
$$
感知机输出的值为0，所以才会将蓝色点分为负类(0)，蓝色点正确的类别是正类(1)，那么我们进行更新应该是将权重和偏置增加使得其感知机输出的值大于0才能正确分类。所以我们就有
$$
w=w + \alpha (y^i-h_\theta(x^i))x_j^i\\
$$
更新后的权重，使得像原来的分类错误的负值向正值走。



下面我们来详细解析感知机解决鸢尾花二分类代码。

```python
# 导入依赖库
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt

# 创建感知机对象
class Perceptron(object):
    #启动学习速率和迭代次数。
    def __init__(self, Learn_Rate=0.5, Iterations=10):
        self.learn_rate = Learn_Rate #学习率
        self.Iterations = Iterations #迭代次数
        self.errors = []
        self.weights = np.zeros(1 + x.shape[1]) #初始化偏置和权重 [0,0,0]
    
    # 确定模型训练的拟合方法。
    def fit(self, x, y):
        self.weights = np.zeros(1 + x.shape[1]) #获得初始化权重
        for i in range(self.Iterations): #循环迭代
            error = 0
            #xi:输入参数
            #target:真实值
            #zip(x, y)将可迭代的对象作为参数，将对象中对应的元素打包成一个个元组，然后返回由这些元组组成的对象，这样做的好处是节约了不少的内存。
            for xi, target in zip(x, y):
                loss =  (target - self.predict(xi)) # 计算差值=(真实值-预测值)
                self.weights[1:] += self.learn_rate * loss * xi #更新权重
                self.weights[0] += self.learn_rate * loss #更新偏置
                error += int(self.learn_rate * loss != 0) #记录分类错误数
            self.errors.append(error) #向error列表末尾添加元素
            print("echo:{},error:{}".format(i,error))
        return self.weights[1:],self.weights[0]
    
    # 网络输入法，用于将给定的矩阵输入及其相应的权重相加
    def net_input(self, x):
        return np.dot(x, self.weights[1:]) + self.weights[0]
    
    # 预测数据输入分类的预测方法
    def predict(self, x):
        return np.where(self.net_input(x) >= 0.0, 1, 0) #相当于感知机的激活函数

# 数据检索和准备
print("Loading dataset...")
y = pd.read_csv("./iris.data", header=None) #读取鸢尾花数据集 
#数据集变量：萼片长度、萼片宽度、花瓣长度、花瓣宽度、类别名
x = y.iloc[0:100, [0, 2]].values #获得萼片长度和花瓣长度
plt.scatter(x[:50, 0], x[:50, 1], color='red',label ="Iris-setosa") #绘制山鸢尾样本点
plt.scatter(x[50:100, 0], x[50:100, 1], color='blue', label = "Iris-versicolor") #绘制变色鸢尾样本点
plt.xlabel('sepal_length') #增加x轴标签
plt.ylabel('petal_length') #增加y轴标签
plt.legend() #给图像加图例,将样本点和直线的标签值增加到图像中
print("Load dataset Succeed!!!")
plt.show() #显示所有打开的图形,即打开一个窗口显示图片

y = y.iloc[0:100, 4].values #获得鸢尾花的类别名
y = np.where(y == 'Iris-setosa', 0, 1) #当y等于Iris-setosa成立时where方法返回-1，当条件不成立时where返回1

# 模型训练和评估
Classifier = Perceptron(Learn_Rate=0.01, Iterations=10) #创建感知机模型传入学习率和迭代次数
print("Start fitting network...")
w,b = Classifier.fit(x, y) #拟合模型
print("fitting network succeed!!!")
print("weights:{},b:{}".format(w,b))
plt.plot(range(1, len(Classifier.errors) + 1), Classifier.errors, marker='o') #绘制迭代过程中分类错误数变化
plt.xlabel('Epochs')
plt.ylabel('Number of misclassifications')
plt.show()

#绘制分类直线函数
plt.scatter(x[:50, 0], x[:50, 1], color='red',label ="Iris-setosa") #绘制山鸢尾样本点
plt.scatter(x[50:100, 0], x[50:100, 1], color='blue', label = "Iris-versicolor") #绘制变色鸢尾样本点
plt.plot(x[:, 0], (w[0]*x[:, 0] + b)/(-w[1]),color='green') #绘制分类直线  w0*x0+w1*x1+b=0 => x1=(w0*x0+b)/(w1)
plt.xlabel('sepal_length') #增加x轴标签
plt.ylabel('sepal_width') #增加y轴标签
plt.legend()
plt.show()
```

### 2.3 多层神经网络

#### 2.3.1 XOR问题

在学习多层神经网络前，我们为什么要学习多层神经网络？

![image-20231023145310199](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023145310199.png)

单层单节点神经网络可以去拟合一条直线y=ax+b，可分别求解线性回归问题和二分类线性可分问题。

如果求解的问题，不能通过一条直线就去解决，那么单层单节点神经网络就不适用了。例如经典的XOR问题：

假设需要对下面红蓝样本点进行分类，红蓝样本数据的分布如下所示：

![image-20231204170522146](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231204170522146.png)

通过观察上图可以发现，我们无法通过如上一小节一样建立感知机模型，绘制一条直线将上图中的红蓝样本数据进行分类。由于无论分类直线位于哪个位置，都无法解决此种分类问题。如下所示：

![image-20231204170538567](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231204170538567.png)

那么我们该如何解决这种XOR问题（异或问题）？我们需要引入拟合能力更强的多层神经网络，去解决一些非线性的问题，可以使用多层感知机来解决此类问题（组合多个简单函数，从而实现更复杂的任务）。

下面展示建立怎么样的多层感知机模型，我们先将红蓝样本以坐标系中象限的方式划分红蓝样本：

![image-20231204173113639](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231204173113639.png)

我们可以发现红色样本点在第1象限和第3象限中，蓝色样本点在第2象限和第4象限中，那么可知红色样本的x值和y值相乘结果为正，蓝色样本的x值和y值相乘结果为负。那么我们可以设计如下多层感知机模型。

![image-20231204173949243](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231204173949243.png)

绿色的感知机分类器，主要是判断样本是位于y轴的正区间还是负区间。

紫色的感知机分类器，主要是判断样本是位于x轴的正区间还是负区间。

从上面这两个感知机分类器中获得分类器结果后，对比两个结果是否一致，一致为正样本，不一致为负样本。



将预测结果为正的类，分类为正样本；将预测结果为负的类，分类为负样本。

![image-20231204174357795](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231204174357795.png)

通过上图可以看到，红色样本点2和3的结果都是正，蓝色样本点1和4的结果都是负。那么就可以说明我们使用多层神经网络就可以解决XOR问题。

#### 2.3.2 多层网络组成

多层神经网络是含中间层的人工神经网络。那么什么是中间层呢？下面以一个两层输入层，一个输出层的神经网络展示：

![image-20231023145328096](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023145328096.png)

如上图所示，在输入层和输出层有一个中间层网络，下面分别介绍各个在这个网络结构中的作用：

输入层：将数据输入到网络中，不做处理直接输入隐含层。

隐含层（隐层）：对输入层输出的数据进行求和操作，并使用激活函数对输入总数据进行操作。

输出层：将隐含层输出的数据进行求和操作，求和后直接输出。

> 注意：在多层神经网络中，输出层可以包含激活函数也可以不包含激活函数。



常见的多层神经网络下图所示，每层神经元与下一层完全相连，神经元之间不允许同层相连，也不允许跨层相连，也可以称为**全连接神经网络。**

![image-20231023145353389](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231023145353389.png)

多层神经网络采用一种单向多层结构。其中每一层包含若干个神经元。在此种神经网络中，各神经元可以接收前一层神经元的信号，并产生输出到下一层。第0层叫**输入层**，最后一层叫**输出层**，其他中间层叫做**隐含层**（或隐藏层、隐层）。隐层可以是一层，也可以是多层。



### 2.4 参数的传播方向

当我们知道这些神经元的构成后，我们还需要知道参数是如何传播的？传播方向是什么样的？我们应该怎么去更新对应的权重值？

我们训练的意义就是为了找到合适的权重值等参数，所以参数传播的方向是十分重要的。

参数的传播方向：**前向传播**、**反向传播**

![image-20231018170856555](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231018170856555.png)



### 2.5 前向传播和反向传播

**前向传播**是指在神经网络中沿着输入层到输出层的顺序，将**上一层的输出**作为**下一层的输入**，并计算下一层的输出，依次计算到输出层为止。这里举一个简单的例子，便于大家理解。假设输入信号有x_1,x_2,x_3。神经网络结构如下图所示：

![image-20231016155903908](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231016155903908.png)

通过上图可以看出节点f_1 (x)与输入信号x_1,x_2,x_3 相连，节点f_5 (x)和f_6 (x)分别与节点f_1 (x)、 f_2 (x) 、f_3 (x)、 f_4 (x)相连。

**输入数据**x_1,x_2,x_3的通过隐含层节点后f_1 (x)…f_6 (x)，最后到输出层y_1输出。



**反向传播算法**也称为**误差逆传播算法**(error BackPropagation)，简称**BP**算法**。现在很多神经网络都用BP算法，特别多用于多层前反馈神经网络，所以一般BP网络则是指BP算法的**多层前反馈神经网络。



假定数据集为D=\{(x_1,x_2 ) ，(x_3,x_4)，...，(x_n,x_n+1)} ，这里我以最简单的模型举例，以1层输入层，1层隐含层h_1,h_2，1层输出层y_1，激活函数a_1,a_2,a_3 。在前面我们已经对神经网络有了初步了解，输入层是不对输入的信号进行处理的，只有隐含层和输出层有激活函数，输出激活值。

在前面我们已经对神经网络有了初步了解，输入层是不对输入的信号进行处理的，只有隐含层和输出层有激活函数，输出激活值。

![image-20231012111726443](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012111726443.png)

对于隐含层：

![image-20231019093933443](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019093933443.png)

对于输出层：

![image-20231019093945902](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019093945902.png)

上述过程就为正向传播，我们这里使用平方差损失函数衡量预测结果，对于误差值有：

![image-20231019094245382](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019094245382.png)

通过梯度下降法和链式法则，求解梯度。

对于输出层，求解梯度值：

![image-20231019094253134](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019094253134.png)

更新权重值和偏置值为：

![image-20231019094303567](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019094303567.png)

![image-20231019094319925](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019094319925.png)

对于隐含层![image-20231019094345202](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019094345202.png)

![image-20231019094408439](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019094408439.png)

更新权重和偏置值为：

![image-20231019094418478](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231019094418478.png)

对于隐含层其他的也是类似的，这里就不举例了。

所谓**反向传播**就是将**正向传播计算的结果**，**反向传回**给**初始化参数**，从而**改变权重值**，再次训练后再查看预期值是否符合预期结果，如果不符合则继续改变权重，直至获得的权重训练的结果满足预期目标。

反向传播的步骤如下：

​	1.初始化权重ω和偏置值b等初始化参数

​	2.正向传播，计算每个神经元的输出

​	3.通过损失函数计算误差值

​	4.通过梯度下降法和链式法则求解每个神经元的梯度

​	5.更新网络参数。

通过上述步骤可以看出，反向传播的作用主要是更新权重，使训练拟合的模型性能更加优秀。

### 2.6 损失函数

前面我们讨论了我们需要通过训练不断去更新权重值，那么这里就有一个问题，我们如何去判断我们得到的权重是符合我们数据的网络要求的？

这里就需要引入一个判断标准，去判断我们更新的网络模型可以正确的预测目标。

这个判断标准叫做**损失函数**，损失函数是度量模型的预测值f(x)与真实值Y的**差异程度**的运算函数，它是一个非负实值函数，通常使用L(Y, f(x))来表示，损失函数越小，模型的鲁棒性就越好。可以用来评价模型的预测值和真实值不一样的程度。

![image-20231012111833680](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231012111833680.png)

通过损失函数计算出来的值叫做损失值，**损失值**是**预测值**和**真实值**的**差值**。损失值越小，通常模型的性能越好。如上图所示，我们经过不断迭代，就是为了找出损失值的最低点。



由于不同的模型也需要不同的损失函数。常用的损失函数有绝对值误差, 平方差、log对数损失函数等。

下面展示一下常见的两种损失函数，绝对值误差损失函数、log对数损失函数的函数图像。

![image-20231016162928212](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231016162928212.png)



下面介绍什么是绝对值误差函数?它是基于y轴对称的函数，其表达式为：

![image-20231016162951329](http://photos.100ask.net/eLinuxAI-TrainingDocs/image-20231016162951329.png)

它描述了目标值和预测值的差值的绝对值之和，表示预测值的平均误差程度，且不考虑方向问题。



假设现在以求解线性回归问题（求解样本点趋势线）为例，我们通过预测得到的某一样本点为（1,2），实际的样本点为（1,4）。

$$
L_1=|4-2 |=2
$$
上述公式是求解一个样本点的绝对值误差，即（实际值的平方-预测值的平方）的绝对值。

$$
L=(L_1+L_2+…+L_n)/n
$$
将所有的预测样本点和实际的样本点进行上述操作获取绝对值误差，并将所有的绝对值误差进行求和操作后再除以样本点总数，即可获取总绝对值误差。

