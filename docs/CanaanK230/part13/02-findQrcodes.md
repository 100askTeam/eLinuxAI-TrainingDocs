---
sidebar_position: 2
---
# 二维码识别

## 1.实现目的

如何配置摄像头传感器、捕获图像、识别二维码以及在屏幕上显示结果。

## 2.实验原理

二维码（如 QR Code）是一种可以**编码数字、字母、汉字甚至图片**的二维条码，信息密度高、容错能力强。

### 2.1 定位二维码区域

原理：

二维码有明显的结构特征：

- **三个定位标志（Finder Patterns）**，位于二维码的三个角；
- **一个对齐标志（Alignment Pattern）**，用于纠正图像扭曲；
- **静区（Quiet Zone）**，二维码周围的空白区域。

实现方法：

- **边缘检测 + 轮廓分析**：查找典型的同心正方形结构；
- **图形几何关系验证**：判断三个定位点的位置是否呈直角三角形；
- **比例分析**：定位标志的黑白块比例近似为 1:1:3:1:1。

一旦成功检测到这些特征，就可以推算出二维码的位置、角度、大小。

------

### 2.2. 数据解码（Decode）

**编码格式（以 QR Code 为例）：**

- **格式信息**：记录纠错等级、掩码信息；
- **版本信息**：二维码的尺寸；
- **数据区域**：实际存储的数据内容；
- **纠错码**：用于修复二维码部分破损的数据。

**解码过程：**

- 应用掩码反变换；
- 解码字符模式（Numeric, Alphanumeric, Byte, Kanji 等）；
- 使用 Reed-Solomon 纠错算法恢复损坏的数据；
- 还原为字符串或二进制数据。

## 3.代码解析

### 图像捕获

```
    img = sensor.snapshot()
```

### 二维码检测

```
    for code in img.find_qrcodes():
        rect = code.rect()
        img.draw_rectangle([v for v in rect], color=(255, 0, 0), thickness = 5)
        img.draw_string_advanced(rect[0], rect[1], 32, code.payload())
        print(code)
```

`img.find_qrcodes()`：检测图像中的所有二维码，并返回一个二维码对象列表。

`code.rect()`：获取二维码的位置（矩形框的坐标）。

`img.draw_rectangle()`：在二维码区域绘制一个红色矩形框。

`img.draw_string_advanced()`：在二维码矩形框旁边绘制二维码的有效载荷（二维码内容）。

`print(code)`：打印二维码的信息

###  显示图像

```
Display.show_image(img)
```

将处理后的图像显示到屏幕上。

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
import time, os, gc, sys

from media.sensor import *       # 摄像头模块
from media.display import *      # 显示屏模块
from media.media import *        # 媒体管理模块

# 定义图像检测的宽度和高度
DETECT_WIDTH = 800
DETECT_HEIGHT = 480

sensor = None

try:
    # 构造一个默认配置的摄像头对象
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    
    # 重置摄像头
    sensor.reset()
    
    # 设置图像水平镜像（如有需要可打开）
    # sensor.set_hmirror(False)
    
    # 设置图像垂直翻转（如有需要可打开）
    # sensor.set_vflip(False)
    
    # 设置通道0输出图像的分辨率
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    
    # 设置通道0输出图像的像素格式为 RGB565
    sensor.set_pixformat(Sensor.RGB565)

    # 使用 HDMI 输出（VGA 分辨率）
    # Display.init(Display.LT9611, width = 640, height = 480, to_ide = True)

    # 使用 HDMI 输出（1080P 分辨率）
    # Display.init(Display.LT9611, width = 1920, height = 1080, to_ide = True)

    # 使用 LCD 屏幕作为显示输出
    Display.init(Display.ST7701, to_ide = True)

    # 使用 IDE 虚拟显示输出（高刷新率）
    # Display.init(Display.VIRT, width = DETECT_WIDTH, height = DETECT_HEIGHT, fps = 100)

    # 初始化媒体管理器（用于帧缓冲、DMA 等资源管理）
    MediaManager.init()

    # 启动摄像头采集图像
    sensor.run()

    # 创建 FPS 计时器
    fps = time.clock()

    while True:
        fps.tick()  # 开始新一帧计时

        # 检查是否触发退出点（用于热插拔、断电退出等）
        os.exitpoint()

        # 获取当前帧图像
        img = sensor.snapshot()

        # 扫描图像中的二维码
        for code in img.find_qrcodes():
            rect = code.rect()  # 获取二维码所在的矩形区域
            
            # 在图像上画出二维码边框，红色，线宽为 5
            img.draw_rectangle([v for v in rect], color=(255, 0, 0), thickness = 5)
            
            # 在二维码左上角绘制二维码内容（字符串）
            img.draw_string_advanced(rect[0], rect[1], 32, code.payload())

            # 打印二维码信息到串口
            print(code)

        # 将图像结果显示在屏幕上
        Display.show_image(img)

        # 主动触发垃圾回收，避免内存碎片
        gc.collect()

        # 打印当前帧率
        print(fps.fps())

except KeyboardInterrupt as e:
    # 捕获 Ctrl+C 手动终止程序
    print(f"user stop")

except BaseException as e:
    # 捕获其他异常并打印信息
    print(f"Exception '{e}'")

finally:
    # 程序退出前释放资源

    # 停止摄像头
    if isinstance(sensor, Sensor):
        sensor.stop()

    # 关闭显示器
    Display.deinit()

    # 设置退出点状态为允许睡眠
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)

    # 延时，确保显示器和摄像头完全释放资源
    time.sleep_ms(100)

    # 释放媒体管理器资源（如帧缓冲池）
    MediaManager.deinit()
```



## 5.实验结果

​	点击运行代码，可以在显示屏上看到二维码识别的结果。