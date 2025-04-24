---
sidebar_position: 1
---
# 条形码识别

## 1.实验目的

学习如何设置摄像头，进行条形码识别，并将结果显示在屏幕上。

## 2.实验原理

### 2.1 条形码区域检测

**原理：**

条形码由规则的黑白条纹组成，其在图像中表现为**高频率的亮度变化**，尤其在水平方向更为明显。

**常见的技术：**

- **边缘检测**（如Sobel算子）：可检测条形码的边缘特征；
- **梯度方向分析**：分析图像中水平方向或垂直方向的梯度变化；
- **形态学操作**：如膨胀、腐蚀、闭运算等，用于提取明显的线性区域；
- **Hough变换**：用于提取直线结构，有助于条码定位；
- **滑动窗口扫描 + 局部直方图分析**：识别可能存在条纹的区域。

------

### 2.2 条形码解码

原理：

一维条形码（如 EAN13、CODE128）是通过**不同宽度的黑白条纹组合**来表示数字或字母的：

- 黑条 = 二进制中的“1”
- 白条 = 二进制中的“0”

解码过程：

1. **二值化**：将图像转成黑白图（0 和 255），提高对比度；
2. **条宽检测**：分析条纹宽度，识别每一组条纹的模式；
3. **查表匹配**：每种条码标准（如 EAN-13、CODE128）都有一张“编码表”，程序将识别到的模式与之比对；
4. **校验位验证**：很多条码都有校验位（如 EAN13 的第13位），用于验证解码是否正确；



## 3.代码解析

### 定义条形码类型

```
def barcode_name(code):
    if(code.type() == image.EAN2):
        return "EAN2"
    if(code.type() == image.EAN5):
        return "EAN5"
    if(code.type() == image.EAN8):
        return "EAN8"
    if(code.type() == image.UPCE):
        return "UPCE"
    if(code.type() == image.ISBN10):
        return "ISBN10"
    if(code.type() == image.UPCA):
        return "UPCA"
    if(code.type() == image.EAN13):
        return "EAN13"
    if(code.type() == image.ISBN13):
        return "ISBN13"
    if(code.type() == image.I25):
        return "I25"
    if(code.type() == image.DATABAR):
        return "DATABAR"
    if(code.type() == image.DATABAR_EXP):
        return "DATABAR_EXP"
    if(code.type() == image.CODABAR):
        return "CODABAR"
    if(code.type() == image.CODE39):
        return "CODE39"
    if(code.type() == image.PDF417):
        return "PDF417"
    if(code.type() == image.CODE93):
        return "CODE93"
    if(code.type() == image.CODE128):
        return "CODE128"
```

该函数接收条形码对象并根据条形码类型返回相应的名称。它通过调用 `code.type()` 方法获取条形码的类型，并根据类型返回对应的名称。

### 配置传感器

```
DETECT_WIDTH = 800
DETECT_HEIGHT = 480

sensor = None

try:
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    sensor.reset()
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    sensor.set_pixformat(Sensor.RGB565)
```

**`DETECT_WIDTH` 和 `DETECT_HEIGHT`**：定义捕获图像的分辨率。此处设定为 800x480 像素。

**`Sensor` 类**：用于初始化和控制摄像头。创建一个 `Sensor` 对象，并设置其分辨率为 800x480。

**`sensor.set_pixformat(Sensor.RGB565)`**：设置图像格式为 RGB565。

### 初始化显示模块

```
Display.init(Display.ST7701, to_ide = True)
```

初始化显示模块，配置为使用 ST7701 显示屏，并将其输出设置为 IDE 环境。

### 媒体管理器初始化

```
MediaManager.init()
sensor.run()
```

初始化媒体管理器，负责管理图像和其他资源。

启动传感器，开始图像采集。

### 条形码检测和输出

```
    img = sensor.snapshot()
```

捕获一帧图像

```
    for code in img.find_barcodes():
        img.draw_rectangle([v for v in code.rect()], color=(255, 0, 0))
        print_args = (barcode_name(code), code.payload(), (180 * code.rotation()) / math.pi, code.quality(), fps.fps())
        print("Barcode %s, Payload \"%s\", rotation %f (degrees), quality %d, FPS %f" % print_args)
```

**`img.find_barcodes()`**：识别图像中的所有条形码。

**`img.draw_rectangle([v for v in code.rect()], color=(255, 0, 0))`**：在条形码区域绘制红色矩形框。

**条形码信息**：

- `barcode_name(code)`：条形码类型名称。
- `code.payload()`：条形码的内容（有效载荷）。
- `code.rotation()`：条形码的旋转角度，转换为度数。
- `code.quality()`：条形码质量。
- `fps.fps()`：当前帧率。

### 显示结果

```
    Display.show_image(img)
    gc.collect()
    print(fps.fps())
```

**`Display.show_image(img)`**：将图像显示在屏幕上。

**`gc.collect()`**：进行垃圾回收，释放内存。

**`print(fps.fps())`**：打印当前的帧率。



## 4.示例代码

```
'''
本程序遵循GPL V3协议, 请遵循协议
实验平台: DshanPI CanMV
开发板文档站点	: https://eai.100ask.net/
百问网学习平台   : https://www.100ask.net
百问网官方B站    : https://space.bilibili.com/275908810
百问网官方淘宝   : https://100ask.taobao.com
'''
import time, math, os, gc, sys

from media.sensor import *
from media.display import *
from media.media import *

# 定义一个函数，根据条形码类型返回相应的名称
def barcode_name(code):
    if(code.type() == image.EAN2):
        return "EAN2"
    if(code.type() == image.EAN5):
        return "EAN5"
    if(code.type() == image.EAN8):
        return "EAN8"
    if(code.type() == image.UPCE):
        return "UPCE"
    if(code.type() == image.ISBN10):
        return "ISBN10"
    if(code.type() == image.UPCA):
        return "UPCA"
    if(code.type() == image.EAN13):
        return "EAN13"
    if(code.type() == image.ISBN13):
        return "ISBN13"
    if(code.type() == image.I25):
        return "I25"
    if(code.type() == image.DATABAR):
        return "DATABAR"
    if(code.type() == image.DATABAR_EXP):
        return "DATABAR_EXP"
    if(code.type() == image.CODABAR):
        return "CODABAR"
    if(code.type() == image.CODE39):
        return "CODE39"
    if(code.type() == image.PDF417):
        return "PDF417"
    if(code.type() == image.CODE93):
        return "CODE93"
    if(code.type() == image.CODE128):
        return "CODE128"

# 定义检测图像的宽度和高度
DETECT_WIDTH = 800
DETECT_HEIGHT = 480

# 初始化传感器对象
sensor = None

try:
    # 使用默认配置构造一个传感器对象
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 重置传感器
    sensor.reset()
    # 设置水平镜像（注释掉了，可根据需求启用）
    # sensor.set_hmirror(False)
    # 设置垂直翻转（注释掉了，可根据需求启用）
    # sensor.set_vflip(False)
    # 设置传感器的输出尺寸
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 设置传感器的输出格式为RGB565
    sensor.set_pixformat(Sensor.RGB565)

    # 使用LCD作为显示输出
    Display.init(Display.ST7701, to_ide = True)

    # 初始化媒体管理器
    MediaManager.init()
    # 启动传感器开始运行
    sensor.run()

    # 使用时间模块记录帧率
    fps = time.clock()

    while True:
        # 更新帧率计数
        fps.tick()

        # 检查是否需要退出
        os.exitpoint()

        # 捕获一帧图像
        img = sensor.snapshot()

        # 查找图像中的所有条形码
        for code in img.find_barcodes():
            # 在条形码区域绘制矩形框，颜色为红色
            img.draw_rectangle([v for v in code.rect()], color=(255, 0, 0))

            # 打印条形码的详细信息
            print_args = (barcode_name(code), code.payload(), (180 * code.rotation()) / math.pi, code.quality(), fps.fps())
            print("条形码类型: %s, 有效载荷: \"%s\", 旋转角度: %f (度), 质量: %d, 帧率: %f" % print_args)

        # 将图像显示到屏幕上
        Display.show_image(img)

        # 执行垃圾回收
        gc.collect()

        # 打印当前的帧率
        print(fps.fps())
except KeyboardInterrupt as e:
    # 用户手动中断时输出提示
    print(f"用户停止")
except BaseException as e:
    # 捕获其他异常并打印异常信息
    print(f"异常 '{e}'")
finally:
    # 确保在退出时停止传感器
    if isinstance(sensor, Sensor):
        sensor.stop()
    
    # 关闭显示屏
    Display.deinit()

    # 启用休眠模式
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)

    # 释放媒体缓冲区
    MediaManager.deinit()
```

## 5.实验结果

![test](${images}/test.png)

点击运行运行后，可在显示屏上显示识别到的条形码。