---
boards: [CanMV_V3]
---
# 边缘检测

## 实验原理

本实验使用 cv_lite 提供的边缘检测接口，对摄像头采集的图像实时提取边缘，并将边缘图直接显示出来。其底层实现基于 OpenCV 的 Canny 边缘检测，输入为通过 `to_numpy_ref()` 零拷贝获取的 `ulab.numpy.ndarray`：灰度图调用 `cv_lite.grayscale_find_edges`，彩色图调用 `cv_lite.rgb888_find_edges`，二者均输出一张灰度边缘图。

### 什么是边缘

边缘是指图像中像素灰度发生剧烈变化的位置。物体的边界、纹理的突变等都会在灰度上形成明显的阶跃或斜坡，因此边缘检测的本质是求图像梯度的幅值，并在梯度较大的位置标记为边缘。

### Canny 边缘检测

cv_lite 底层调用的是 OpenCV 的 `Canny` 算子，它是一种多阶段的经典边缘检测算法，主要包括以下步骤：

1. **高斯滤波**：先对图像做高斯平滑，抑制噪声，避免噪声被误判为边缘；
2. **计算梯度**：用 Sobel 算子分别计算水平、垂直方向的梯度 $G_x$、$G_y$，由此得到梯度幅值与方向：

$$
G = \sqrt{G_x^2 + G_y^2}, \quad \theta = \arctan\left(\frac{G_y}{G_x}\right)
$$

3. **非极大值抑制**：沿梯度方向比较每个像素的梯度幅值，只保留局部极大值，从而把粗边缘细化为单像素宽的细线；
4. **双阈值检测**：用高阈值 `threshold2` 和低阈值 `threshold1` 把像素分为三类--
   - 梯度 ≥ `threshold2`：强边缘，必定保留；
   - 梯度 < `threshold1`：非边缘，丢弃；
   - 介于两者之间：弱边缘，仅当与强边缘相连时才保留；
5. **滞后连接**：通过连通性判断，把真正与强边缘相连的弱边缘连成完整边界，剔除孤立的弱边缘响应。

其中 `threshold1`（低阈值）与 `threshold2`（高阈值）是仅有的两个可调参数，通常高阈值约为低阈值的 2~3 倍。阈值越大，检出的边缘越少但越可靠；阈值越小，边缘越完整但噪声也越多。

### cv_lite 的封装与数据流

cv_lite 的边缘检测接口接收 `ulab.numpy.ndarray`，返回的同样是一个 ndarray（灰度边缘图，边缘处为亮、背景为暗）：

- 通过 `img.to_numpy_ref()` 以零拷贝方式取得输入图像的 ndarray 引用，灰度图为单通道、彩色图为 RGB888 三通道；
- 灰度图直接进入 Canny；RGB888 图在底层转换为灰度后再做检测（Canny 依赖单通道梯度）；
- 输出 `edge_np` 是一张与原图同尺寸的灰度边缘图 ndarray，再用 `image.Image(..., image.GRAYSCALE, alloc=image.ALLOC_REF, data=edge_np)` 以零拷贝方式包回 `image` 对象交给 `Display.show_image()` 显示。

由于输入、输出都与 image 共享同一块内存，整个“采集 -> 检测 -> 显示”链路无需额外拷贝，因此相比 openmv 原生方案有明显的速度优势（参见 cv_lite 概述中的速度对比）。
## 代码解析
两个示例（灰度图与彩色图）的处理流程基本一致，区别仅在于像素格式与调用的检测函数。下面按关键步骤进行解析。

### 导入模块

```
import cv_lite               # cv_lite 扩展模块（包含边缘检测）
import ulab.numpy as np      # NumPy-like ndarray for MicroPython
from media.sensor import *   # 摄像头接口
from media.display import *  # 显示接口
from media.media import *    # 媒体资源管理器
```

- **`cv_lite`**：提供 `grayscale_find_edges` / `rgb888_find_edges` 等基于 OpenCV Canny 的加速接口；
- **`ulab.numpy`**：MicroPython 下的类 NumPy 库，`to_numpy_ref()` 返回的 ndarray 即为该类型，作为 cv_lite 的输入；
- `media.sensor` / `media.display` / `media.media`：openmv 风格的摄像头、显示与媒体管理接口，负责采集与显示。

### 初始化摄像头与显示

```
image_shape = [480, 640]  # 高 x 宽
sensor = Sensor(id=2, width=1280, height=720, fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.GRAYSCALE)   # 灰度示例
# sensor.set_pixformat(Sensor.RGB888)    # 彩色示例

Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=100)
sensor.run()
```

- **`image_shape = [480, 640]`**：处理图像的高 × 宽为 480×640，后续既用于设置帧大小，也作为 cv_lite 检测函数的入参；
- **`Sensor(...)`**：创建摄像头对象，`set_framesize` 将输出帧设为 640×480，`set_pixformat` 设置像素格式--灰度示例用 `Sensor.GRAYSCALE`，彩色示例用 `Sensor.RGB888`；
- **`Display.init(Display.ST7701, ...)`**：初始化 3.5 寸 LCD，`to_ide=True` 同时把画面回传给 IDE，`quality` 为 JPEG 压缩质量；
- **`sensor.run()`**：启动摄像头采集。

### 边缘检测参数

```
threshold1 = 50  # 低阈值
threshold2 = 80  # 高阈值
```

这两个参数即 Canny 的双阈值（含义详见“实验原理”）：`threshold2` 为高阈值，决定哪些像素作为强边缘必定保留；`threshold1` 为低阈值，低于该值的像素直接丢弃。实际场景中可按边缘强弱调整--想得到更干净、更少的边缘就调高两个阈值；想捕捉更多细节边缘就调低，但同时会引入更多噪声响应。

### 获取图像 ndarray 引用（零拷贝）

```
img = sensor.snapshot()
img_np = img.to_numpy_ref()
```

- **`sensor.snapshot()`**：采集一帧图像，返回 openmv 的 `image` 对象；
- **`img.to_numpy_ref()`**：以零拷贝方式返回引用同一块传感器缓冲区的 `ulab.numpy.ndarray`（灰度为单通道、彩色为 RGB888），作为 cv_lite 检测函数的输入。由于不复制像素数据，这一步耗时极低。

### 调用 cv_lite 边缘检测

```
# 灰度图
edge_np = cv_lite.grayscale_find_edges(image_shape, img_np, threshold1, threshold2)
# 彩色图
edge_np = cv_lite.rgb888_find_edges(image_shape, img_np, threshold1, threshold2)
```

- 第一个参数 `image_shape` 给出图像的高宽，`img_np` 为输入 ndarray，随后是 Canny 的低、高两个阈值；
- 灰度图调用 `grayscale_find_edges`，RGB888 图调用 `rgb888_find_edges`（底层会先转灰度再做 Canny）；
- 返回值 `edge_np` 是一张与原图同尺寸的灰度边缘图 ndarray（边缘处为亮、背景为暗）。

### 包装边缘图为 image 并显示

```
img_out = image.Image(image_shape[1], image_shape[0], image.GRAYSCALE,
                      alloc=image.ALLOC_REF, data=edge_np)
Display.show_image(img_out)
```

- **`image.Image(..., image.GRAYSCALE, alloc=image.ALLOC_REF, data=edge_np)`**：以 `ALLOC_REF` 方式直接引用 `edge_np` 的内存构造一个灰度 `image` 对象，不复制像素数据（零拷贝）。需要注意图像类型必须与数据匹配--这里边缘图是单通道灰度，故用 `image.GRAYSCALE`；
- 与“色块/圆检测”在原图上叠加绘制不同，边缘检测的输出本身就是一张图像，因此这里新建 `img_out` 作为显示对象；
- **`Display.show_image(img_out)`**：将边缘图输出到 LCD 与 IDE。

### 显示与帧率

```
gc.collect()
print("edges:", clock.fps())
```

- **`gc.collect()`**：每帧回收内存，避免长时间运行内存碎片化；
- **`clock.fps()`**：打印实时帧率，便于观察 cv_lite 相对 openmv 原生边缘方案的速度提升。

示例末尾的 `sensor.stop()`、`Display.deinit()` 等为资源释放代码，用于脚本停止时回收摄像头与显示资源。
## 示例代码

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
# MicroPython 灰度图边缘检测测试代码（使用 cv_lite 扩展模块）
# Grayscale Edge Detection (Canny) Test using cv_lite extension
# ============================================================

import time, os, sys, gc
from machine import Pin
from media.sensor import *   # 摄像头接口 / Camera interface
from media.display import *  # 显示接口 / Display interface
from media.media import *    # 媒体资源管理器 / Media manager
import _thread
import cv_lite               # cv_lite 扩展模块（包含边缘检测）
import ulab.numpy as np      # NumPy-like ndarray for MicroPython

# -------------------------------
# 图像尺寸设置 / Image resolution
# -------------------------------
image_shape = [480, 640]  # 高 x 宽 / Height x Width

# -------------------------------
# 初始化摄像头 / Initialize camera
# -------------------------------
sensor = Sensor(id=2, width=1280, height=720,fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.GRAYSCALE)  # 设置为灰度图像输出 / Grayscale mode

# --------------------------------------
# 初始化显示模块（IDE 虚拟显示模式）
# Initialize display (IDE virtual mode)
# --------------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0],to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=100)

# -------------------------------
# 初始化媒体资源管理器 / Init media manager
# -------------------------------

sensor.run()

# -------------------------------
# 启动帧率计时器 / Start FPS timer
# -------------------------------
clock = time.clock()

# -------------------------------
# 边缘检测参数 / Canny edge detection thresholds
# -------------------------------
threshold1 = 50  # 低阈值 / Lower threshold
threshold2 = 80  # 高阈值 / Upper threshold

# -------------------------------
# 主循环 / Main loop
# -------------------------------
while True:
    clock.tick()

    # 拍摄一帧图像 / Capture a frame
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()  # 获取 ndarray 引用 / Get ndarray reference

    # 调用 cv_lite 扩展执行边缘检测 / Perform edge detection
    # 返回灰度边缘图像 ndarray / Returns edge image ndarray
    edge_np = cv_lite.grayscale_find_edges(
        image_shape, img_np, threshold1, threshold2)

    # 包装边缘图像用于显示 / Wrap ndarray as image for display
    img_out = image.Image(image_shape[1], image_shape[0], image.GRAYSCALE,
                          alloc=image.ALLOC_REF, data=edge_np)

    # 显示边缘图像 / Show edge image
    Display.show_image(img_out)

    # 清理内存并打印帧率 / Cleanup and print FPS
    gc.collect()
    print("edges:", clock.fps())

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
# MicroPython 基于 cv_lite 的 RGB888 边缘检测测试代码
# RGB888 Edge Detection Test using cv_lite extension
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
sensor = Sensor(id=2, width=1280, height=720,fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.RGB888)  # 设置 RGB888 像素格式 / Set RGB888 pixel format

# -------------------------------
# 初始化显示器（IDE虚拟输出） / Initialize display (IDE virtual output)
# -------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
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
# 边缘检测参数 / Edge detection parameters (Canny thresholds)
# -------------------------------
threshold1 = 50   # Canny 边缘检测低阈值 / Lower threshold for Canny
threshold2 = 80   # Canny 边缘检测高阈值 / Higher threshold for Canny

# -------------------------------
# 主循环 / Main loop
# -------------------------------
while True:
    clock.tick()

    # 拍摄一帧图像 / Capture a frame
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()  # 获取 RGB888 ndarray 引用

    # 调用 cv_lite 扩展的边缘检测函数，返回灰度边缘图 ndarray
    edge_np = cv_lite.rgb888_find_edges(image_shape, img_np, threshold1, threshold2)

    # 构造灰度图像对象用于显示
    img_out = image.Image(image_shape[1], image_shape[0], image.GRAYSCALE, alloc=image.ALLOC_REF, data=edge_np)

    # 显示边缘检测结果
    Display.show_image(img_out)

    # 垃圾回收 / Garbage collect
    gc.collect()

    # 打印当前帧率 / Print FPS
    print("edges:", clock.fps())

# -------------------------------
# 退出时释放资源 / Cleanup on exit
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)
```



## 实验结果
在 CanMV IDE 中运行示例代码，LCD 与 IDE 上会显示 Canny 边缘检测结果——原图中灰度变化剧烈的轮廓以亮色勾勒、背景为暗，同时串口会打印实时帧率。灰度图与彩色图两个示例的输出均为一张灰度边缘图（彩色输入会在底层先转灰度再检测）。若边缘过多、噪声明显，可适当调大 `threshold1`、`threshold2`；若边缘过少、轮廓断续，则调小阈值，通常高阈值约为低阈值的 2~3 倍。
