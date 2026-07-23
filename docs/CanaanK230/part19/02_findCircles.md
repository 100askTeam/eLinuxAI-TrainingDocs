---
boards: [CanMV_V3]
---
# 圆形检测

## 实验原理

本实验使用 cv_lite 提供的霍夫圆检测接口，在摄像头采集的图像上实时检测圆形，并用 openmv 的绘图接口将检测到的圆绘制出来。其底层实现基于 OpenCV 的霍夫圆变换（Hough Circle Transform），输入为通过 `to_numpy_ref()` 零拷贝获取的 `ulab.numpy.ndarray`：灰度图调用 `cv_lite.grayscale_find_circles`，彩色图调用 `cv_lite.rgb888_find_circles`。

### 霍夫圆变换基本原理

圆在图像中可用圆心坐标与半径三个参数描述：

$$
(x - x_c)^2 + (y - y_c)^2 = r^2
$$

因此检测一个圆本质上是在三维参数空间 $(x_c, y_c, r)$ 中寻找“投票”最多的组合。经典霍夫变换的做法是：对图像中的每一个边缘点，在参数空间中为所有可能的 $(x_c, y_c, r)$ 投票，统计累加器中的局部极大值即为检测到的圆。这种穷举投票计算量大，因此实际实现普遍采用基于梯度的改进方法。

### OpenCV 的两阶段法（HOUGH_GRADIENT）

cv_lite 底层调用的是 OpenCV 的 `HoughCircles`，默认采用 `HOUGH_GRADIENT` 方法，分为两个阶段：

1. **检测圆心**：先用 Sobel 算子计算图像梯度，得到边缘点及其梯度方向；再让每个边缘点沿自身梯度方向在二维累加器 $(x_c, y_c)$ 上投票（而非在三维空间穷举）。累加器中响应值超过阈值 `param2` 的局部极大值即为候选圆心。利用梯度方向投票大幅减少了计算量。

2. **估计半径**：对每个候选圆心，考察其周围边缘点的梯度信息，在 `[minRadius, maxRadius]` 范围内选择支持度最高的半径作为该圆的半径。

各参数含义如下：

- `dp`：累加器分辨率相对于图像分辨率的比例（倒数），`dp=1` 表示与原图同分辨率；
- `minDist`：两个圆心之间的最小距离，用于避免同一个圆被重复检出；
- `param1`：内部 Canny 边缘检测的高阈值（低阈值取其一半），决定哪些像素参与投票；
- `param2`：圆心累加器的阈值，值越小越容易检出圆（误检也更多），值越大越严格；
- `minRadius` / `maxRadius`：限定检测圆的半径范围，可用来过滤过大或过小的干扰。

### cv_lite 的封装与数据流

cv_lite 的圆检测接口并不直接操作 openmv 的 RGB565 `image` 对象，而是接收 `ulab.numpy.ndarray`：

- 通过 `img.to_numpy_ref()` 以零拷贝方式取得图像缓冲区的 ndarray 引用，灰度图为单通道、彩色图为 RGB888 三通道；
- 灰度图直接进入霍夫检测；RGB888 图在底层转换为灰度后再做检测（圆检测依赖灰度梯度）；
- 函数返回一个扁平的圆参数列表 `[x1, y1, r1, x2, y2, r2, ...]`，每 3 个元素描述一个圆（圆心 x、y 与半径 r）；
- 拿到结果后用 openmv 的 `img.draw_circle()` 在原图上绘制，再由 `Display.show_image()` 显示。

由于 ndarray 与 image 共享同一块内存，整个“采集 -> 检测 -> 绘制 -> 显示”链路无需额外拷贝，因此相比 openmv 原生的 `find_circles` 有明显的速度优势（参见 cv_lite 概述中的速度对比）。

## 代码解析

两个示例（灰度图与彩色图）的处理流程基本一致，区别仅在于像素格式、调用的检测函数和绘制颜色。下面按关键步骤进行解析。

### 导入模块

```
import cv_lite               # cv_lite 扩展模块（包含圆检测函数）
import ulab.numpy as np      # NumPy-like ndarray for MicroPython
from media.sensor import *   # 摄像头接口
from media.display import *  # 显示接口
from media.media import *    # 媒体资源管理器
```

- **`cv_lite`**：提供 `grayscale_find_circles` / `rgb888_find_circles` 等基于 OpenCV 的加速接口；
- **`ulab.numpy`**：MicroPython 下的类 NumPy 库，`to_numpy_ref()` 返回的 ndarray 即为该类型，作为 cv_lite 的输入；
- `media.sensor` / `media.display` / `media.media`：openmv 风格的摄像头、显示与媒体管理接口，负责采集与显示。

### 初始化摄像头与显示

```
image_shape = [480, 640]  # 高 x 宽
sensor = Sensor(id=0, width=1280, height=720, fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.GRAYSCALE)   # 灰度示例
# sensor.set_pixformat(Sensor.RGB888)    # 彩色示例

Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
sensor.run()
```

- **`image_shape = [480, 640]`**：处理图像的高 × 宽为 480×640，后续既用于设置帧大小，也作为 cv_lite 检测函数的入参；
- **`Sensor(...)`**：创建摄像头对象，`set_framesize` 将输出帧设为 640×480，`set_pixformat` 设置像素格式——灰度示例用 `Sensor.GRAYSCALE`，彩色示例用 `Sensor.RGB888`；
- **`Display.init(Display.ST7701, ...)`**：初始化 3.5 寸 LCD，`to_ide=True` 同时把画面回传给 IDE，`quality` 为 JPEG 压缩质量；
- **`sensor.run()`**：启动摄像头采集。

### 霍夫圆检测参数

```
dp = 1            # 累加器分辨率比
minDist = 20      # 圆心最小距离
param1 = 80       # Canny 高阈值
param2 = 20       # 累加器阈值
minRadius = 10    # 最小圆半径
maxRadius = 50    # 最大圆半径
```

这 6 个参数对应 OpenCV `HoughCircles` 的同名参数（含义详见“实验原理”）：`dp` 控制累加器分辨率、`minDist` 防止重复检同一圆、`param1`/`param2` 分别影响边缘提取与圆心判定、`minRadius`/`maxRadius` 限定半径范围。实际场景中可按圆的大小与数量调整，例如增大 `minRadius` 可过滤小面积干扰。

### 获取图像 ndarray 引用（零拷贝）

```
img = sensor.snapshot()
img_np = img.to_numpy_ref()
```

- **`sensor.snapshot()`**：采集一帧图像，返回 openmv 的 `image` 对象；
- **`img.to_numpy_ref()`**：以零拷贝方式返回引用同一块传感器缓冲区的 `ulab.numpy.ndarray`（灰度为单通道、彩色为 RGB888），作为 cv_lite 检测函数的输入。由于不复制像素数据，这一步耗时极低。

### 调用 cv_lite 圆检测

```
# 灰度图
circles = cv_lite.grayscale_find_circles(
    image_shape, img_np, dp, minDist, param1, param2, minRadius, maxRadius
)
# 彩色图
circles = cv_lite.rgb888_find_circles(
    image_shape, img_np, dp, minDist, param1, param2, minRadius, maxRadius
)
```

- 第一个参数 `image_shape` 给出图像的高宽，`img_np` 为输入 ndarray，其后依次是霍夫圆的 6 个参数；
- 灰度图调用 `grayscale_find_circles`，RGB888 图调用 `rgb888_find_circles`（底层会先转灰度再做霍夫检测）；
- 返回值 `circles` 是一个扁平列表，格式为 `[x1, y1, r1, x2, y2, r2, ...]`，每 3 个元素描述一个圆（圆心 x、y 与半径 r）。

### 遍历并绘制圆

```
for i in range(0, len(circles), 3):
    x = circles[i]
    y = circles[i + 1]
    r = circles[i + 2]
    img.draw_circle(x, y, r, color=(255, 255, 0), thickness=2)  # 灰度示例：黄色
    # img.draw_circle(x, y, r, color=(255, 0, 0), thickness=2)  # 彩色示例：红色
```

- 由于返回列表每 3 个元素为一个圆，循环以步长 3 取出 `x, y, r`；
- **`img.draw_circle(x, y, r, ...)`**：用 openmv 的绘图接口在原图上画圆，灰度示例用黄色、彩色示例用红色，`thickness` 为线宽；
- 绘制操作作用在原始 `image` 对象上（与 ndarray 共享内存），因此检测结果会直接反映到显示画面中。

### 显示与帧率

```
Display.show_image(img)
gc.collect()
print("findcircles:", clock.fps())
```

- **`Display.show_image(img)`**：将带圆框的图像输出到 LCD 与 IDE；
- **`gc.collect()`**：每帧回收内存，避免长时间运行内存碎片化；
- **`clock.fps()`**：打印实时帧率，便于观察 cv_lite 相对 openmv 原生 `find_circles` 的速度提升。

示例末尾的 `sensor.stop()`、`Display.deinit()` 等为资源释放代码，用于脚本停止时回收摄像头与显示资源。

## 参考代码

### 灰图检测

```
'''
本程序遵循GPL V3协议, 请遵循协议
实验平台: DshanPI CanMV
开发板文档站点	: https://eai.100ask.net/
百问网学习平台   : https://www.100ask.net
百问网官方B站    : https://space.bilibili.com/275908810
百问网官方淘宝   : https://100ask.taobao.com
'''
# ============================================================
# MicroPython 霍夫圆检测测试代码（使用 cv_lite 扩展模块）
# Hough Circle Detection Test using cv_lite extension
# ============================================================

import time, os, sys, gc
from machine import Pin
from media.sensor import *   # 摄像头接口 / Camera interface
from media.display import *  # 显示接口 / Display interface
from media.media import *    # 媒体资源管理器 / Media manager
import _thread
import cv_lite               # cv_lite 扩展模块（包含圆检测函数）
import ulab.numpy as np      # NumPy-like ndarray for MicroPython

'''
本程序遵循GPL V3协议, 请遵循协议
实验平台: DshanPI CanMV
开发板文档站点	: https://eai.100ask.net/
百问网学习平台   : https://www.100ask.net
百问网官方B站    : https://space.bilibili.com/275908810
百问网官方淘宝   : https://100ask.taobao.com
'''
# -------------------------------
# 图像尺寸设置 / Image resolution
# -------------------------------
image_shape = [480, 640]  # 高 x 宽 / Height x Width

# -------------------------------
# 初始化摄像头 / Initialize camera
# -------------------------------
sensor = Sensor(id=0, width=1280, height=720,fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.GRAYSCALE)  # 设置为灰度图像输出 / Grayscale mode

# --------------------------------------
# 初始化显示模块（IDE 虚拟显示模式）
# Initialize display (IDE virtual mode)
# --------------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)

# -------------------------------
# 初始化媒体资源管理器 / Init media manager
# -------------------------------

sensor.run()

# -------------------------------
# 启动帧率计时器 / Start FPS timer
# -------------------------------
clock = time.clock()

# -------------------------------
# 霍夫圆检测参数 / Hough circle detection parameters
# -------------------------------
dp = 1            # 累加器分辨率比 / Inverse ratio of resolution
minDist = 20      # 圆心最小距离 / Minimum distance between centers
param1 = 80       # Canny 高阈值 / Upper threshold for Canny edge detector
param2 = 20       # 累加器阈值 / Accumulator threshold for center detection
minRadius = 10    # 最小圆半径 / Minimum radius to detect
maxRadius = 50    # 最大圆半径 / Maximum radius to detect

# -------------------------------
# 主循环 / Main loop
# -------------------------------
while True:
    clock.tick()

    # 拍摄一帧图像 / Capture a frame
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()  # 获取图像的 ndarray 引用 / Get image data reference

    # 检测圆形 / Detect circles using Hough Transform
    # 返回格式：[x1, y1, r1, x2, y2, r2, ...]
    circles = cv_lite.grayscale_find_circles(
        image_shape, img_np,
        dp, minDist,
        param1, param2,
        minRadius, maxRadius
    )

    # 遍历圆信息并绘制 / Draw each detected circle
    for i in range(0, len(circles), 3):
        x = circles[i]
        y = circles[i + 1]
        r = circles[i + 2]
        img.draw_circle(x, y, r, color=(255, 255, 0), thickness=2)  # 黄色圆 / Yellow circle

    # 显示图像 / Show processed image
    Display.show_image(img)

    # 清理内存并输出帧率 / Cleanup and print FPS
    gc.collect()
    print("findcircles:", clock.fps())

# -------------------------------
# 程序退出与资源释放 / Cleanup on exit
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)
```



### 彩图检测

```
'''
本程序遵循GPL V3协议, 请遵循协议
实验平台: DshanPI CanMV
开发板文档站点	: https://eai.100ask.net/
百问网学习平台   : https://www.100ask.net
百问网官方B站    : https://space.bilibili.com/275908810
百问网官方淘宝   : https://100ask.taobao.com
'''
# ============================================================
# MicroPython 基于 cv_lite 的 RGB888 霍夫圆检测测试代码
# RGB888 Hough Circle Detection Test using cv_lite extension
# ============================================================

import time, os, sys, gc
from machine import Pin
from media.sensor import *    # 导入摄像头接口 / Camera interface
from media.display import *   # 导入显示接口 / Display interface
from media.media import *     # 导入媒体资源管理器 / Media manager
import _thread
import cv_lite                # 导入 cv_lite 扩展模块 / cv_lite extension
import ulab.numpy as np       # MicroPython 类 NumPy 库

# -------------------------------
# 图像尺寸设置 / Image resolution
# -------------------------------
image_shape = [480, 640]  # 高 x 宽 / Height x Width

# -------------------------------
# 初始化摄像头（RGB888格式） / Initialize camera (RGB888 format)
# -------------------------------
sensor = Sensor(id=0, width=1280, height=720,fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.RGB888)  # 设置 RGB888 像素格式 / Set RGB888 pixel format

# -------------------------------
# 初始化显示器（IDE虚拟显示） / Initialize display (IDE virtual output)
# -------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=100)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=100)

# -------------------------------
# 初始化媒体资源管理器 / Initialize media manager
# -------------------------------

sensor.run()

# -------------------------------
# 启动帧率计时器 / Start FPS timer
# -------------------------------
clock = time.clock()

# -------------------------------
# 霍夫圆检测参数 / Hough Circle parameters
# -------------------------------
dp = 1           # 累加器分辨率与图像分辨率的反比 / Inverse ratio of accumulator resolution
minDist = 30     # 检测到的圆心最小距离 / Minimum distance between detected centers
param1 = 80      # Canny边缘检测高阈值 / Higher threshold for Canny edge detection
param2 = 20      # 霍夫变换圆心检测阈值 / Threshold for center detection in accumulator
minRadius = 10   # 检测圆最小半径 / Minimum circle radius
maxRadius = 50   # 检测圆最大半径 / Maximum circle radius

# -------------------------------
# 主循环 / Main loop
# -------------------------------
while True:
    clock.tick()

    # 拍摄一帧图像 / Capture a frame
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()  # 获取 RGB888 ndarray 引用

    # 调用 cv_lite 扩展的霍夫圆检测函数，返回圆参数列表 [x, y, r, ...]
    circles = cv_lite.rgb888_find_circles(
        image_shape, img_np, dp, minDist, param1, param2, minRadius, maxRadius
    )

    # 遍历检测到的圆形，绘制圆形框
    for i in range(0, len(circles), 3):
        x = circles[i]
        y = circles[i + 1]
        r = circles[i + 2]
        img.draw_circle(x, y, r, color=(255, 0, 0), thickness=2)  # 红色圆圈

    # 显示带有检测圆的图像 / Display image with circles drawn
    Display.show_image(img)

    # 垃圾回收 / Garbage collect
    gc.collect()

    # 打印帧率 / Print FPS
    print("findcircles:", clock.fps())

# -------------------------------
# 程序退出时释放资源 / Cleanup on exit
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)
```



## 实验结果

​	在 CanMV IDE 中运行示例代码，摄像头采集的图像上会用圆框标出检测到的圆形（灰度示例为黄色、彩色示例为红色），同时串口会打印实时帧率。若出现误检或漏检，可按实际场景调整霍夫圆参数：增大 `minRadius` 可过滤小面积干扰，调大 `param2` 能提高圆心判定的严格度以减少误检、调小则更易检出模糊圆，`minDist` 用于避免同一圆被重复检出。

