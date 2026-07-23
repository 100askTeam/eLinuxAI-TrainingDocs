---
boards: [CanMV_V3]
---
# 矩形检测

## 实验原理

本实验使用 cv_lite 提供的矩形检测接口，在摄像头采集的图像上实时检测矩形，并用 openmv 的绘图接口将检测到的矩形框绘制出来。其底层实现沿用 OpenCV 经典的“多边形拟合 + 角度约束”矩形检测思路，输入为通过 `to_numpy_ref()` 零拷贝获取的 `ulab.numpy.ndarray`：灰度图调用 `cv_lite.grayscale_find_rectangles`，彩色图调用 `cv_lite.rgb888_find_rectangles`。

### 基本思路

矩形是一种“四边形且四个角均接近直角”的特殊多边形，因此检测矩形可以转化为：先从图像中提取闭合轮廓，再把轮廓近似为多边形，最后筛选出“顶点数为 4、面积足够大、各内角接近 90°”的那些多边形。具体流程如下：

1. **预处理与边缘提取**：先做高斯模糊（核大小 `gaussian_blur_size`）去噪，再用 Canny（双阈值 `canny_thresh1` / `canny_thresh2`）得到二值边缘图；彩色图会在多通道上分别求梯度再合并，以充分利用颜色信息；
2. **轮廓提取**：对边缘图做 `findContours`，得到所有闭合轮廓；
3. **多边形拟合**：对每条轮廓用 Douglas-Peucker 算法（`approxPolyDP`）做折线逼近，逼近精度 `epsilon = 轮廓周长 × approx_epsilon`。`approx_epsilon` 越小，拟合越精细、越能保留细节顶点；越大则越容易被简化为少顶点多边形；
4. **几何筛选**：保留满足以下条件的轮廓--
   - 拟合后顶点数为 4；
   - 面积大于 `area_min_ratio × 图像总面积`，过滤过小的噪声块；
   - 计算相邻两条边夹角的余弦并取最大值，若其绝对值小于 `max_angle_cos`，则认为四个角都接近直角，判定为矩形。`max_angle_cos` 越小，要求越严格（越接近标准矩形）；
5. **输出**：每个检测到的矩形以其外接矩形 `[x, y, w, h]`（左上角坐标与宽高）返回，所有矩形扁平拼接为 `[x0, y0, w0, h0, x1, y1, w1, h1, ...]`。

### 角度余弦判别

判断四边形是否为矩形的关键是各内角是否为 90°。对相邻两条边向量 $\vec{a}$、$\vec{b}$，其余弦为：

$$
\cos\theta = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}|\,|\vec{b}|}
$$

当 $\theta = 90°$ 时 $\cos\theta = 0$。因此算法计算每个顶点处相邻边的余弦，取其最大绝对值，只要它小于阈值 `max_angle_cos`，就认为四个角都足够接近直角。`max_angle_cos` 越小，允许的角度偏差越小，检出越严格。

### cv_lite 的封装与数据流

cv_lite 的矩形检测接口接收 `ulab.numpy.ndarray`，返回扁平的矩形参数列表：

- 通过 `img.to_numpy_ref()` 以零拷贝方式取得输入图像的 ndarray 引用，灰度图为单通道、彩色图为 RGB888 三通道；
- 灰度图直接进入检测流程；RGB888 图在多通道上求梯度以利用颜色信息；
- 返回值 `rects` 为 `[x, y, w, h, ...]`，每 4 个元素描述一个矩形，用 openmv 的 `img.draw_rectangle()` 在原图上绘制后再显示。

由于 ndarray 与 image 共享同一块内存，整个“采集 -> 检测 -> 绘制 -> 显示”链路无需额外拷贝，因此相比 openmv 原生 `find_rectangles` 有明显的速度优势（参见 cv_lite 概述中的速度对比）。
## 代码解析
两个示例（灰度图与彩色图）的处理流程基本一致，区别在于像素格式、调用的检测函数、绘制颜色及个别参数默认值。下面按关键步骤进行解析。

### 导入模块

```
import cv_lite                 # cv_lite 扩展模块
import ulab.numpy as np        # MicroPython NumPy 类库
from media.sensor import *     # 摄像头接口
from media.display import *    # 显示接口
from media.media import *      # 媒体资源管理器
```

- **`cv_lite`**：提供 `grayscale_find_rectangles` / `rgb888_find_rectangles` 等基于 OpenCV 的加速接口；
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
sensor.again(20.0)                        # 可选：调节增益（灰度示例）

Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=100)
sensor.run()
```

- **`image_shape = [480, 640]`**：处理图像的高 × 宽为 480×640，后续既用于设置帧大小，也作为 cv_lite 检测函数的入参；
- **`Sensor(...)`**：创建摄像头对象，`set_framesize` 将输出帧设为 640×480，`set_pixformat` 设置像素格式--灰度示例用 `Sensor.GRAYSCALE`，彩色示例用 `Sensor.RGB888`；
- **`sensor.again(20.0)`**：可选的模拟增益设置，用于调节画面亮度/对比度（灰度示例中使用，按需调整）；
- **`Display.init(Display.ST7701, ...)`**：初始化 3.5 寸 LCD，`to_ide=True` 同时把画面回传给 IDE，`quality` 为 JPEG 压缩质量；
- **`sensor.run()`**：启动摄像头采集。

### 矩形检测参数

```
canny_thresh1      = 50        # Canny 边缘检测低阈值
canny_thresh2      = 150       # Canny 边缘检测高阈值
approx_epsilon     = 0.04      # 多边形拟合精度比例
area_min_ratio     = 0.001     # 最小面积比例（相对于图像总面积）
max_angle_cos      = 0.3       # 最大角度余弦（越小越接近矩形）
gaussian_blur_size = 5         # 高斯模糊核尺寸（奇数）
```

这 7 个参数对应矩形检测流程中的各环节（含义详见“实验原理”）：

- `canny_thresh1` / `canny_thresh2`：Canny 双阈值，控制边缘提取的强弱；
- `gaussian_blur_size`：高斯模糊核大小（奇数），用于在边缘提取前去噪；
- `approx_epsilon`：多边形拟合精度，`epsilon = 轮廓周长 × approx_epsilon`，越小越精细；
- `area_min_ratio`：最小面积占图像总面积的比例，过滤过小的噪声块；
- `max_angle_cos`：相邻边夹角余弦的最大允许值，越小要求越接近标准矩形。注意灰度示例取 0.3、彩色示例取 0.5，可按场景松紧调整。

实际调试时，若漏检多可适当降低 Canny 阈值、调大 `max_angle_cos`；若误检多则反向调整，并提高 `area_min_ratio` 过滤小块。

### 获取图像 ndarray 引用（零拷贝）

```
img = sensor.snapshot()
img_np = img.to_numpy_ref()
```

- **`sensor.snapshot()`**：采集一帧图像，返回 openmv 的 `image` 对象；
- **`img.to_numpy_ref()`**：以零拷贝方式返回引用同一块传感器缓冲区的 `ulab.numpy.ndarray`（灰度为单通道、彩色为 RGB888），作为 cv_lite 检测函数的输入。由于不复制像素数据，这一步耗时极低。

### 调用 cv_lite 矩形检测

```
# 灰度图
rects = cv_lite.grayscale_find_rectangles(
    image_shape, img_np,
    canny_thresh1, canny_thresh2, approx_epsilon,
    area_min_ratio, max_angle_cos, gaussian_blur_size
)
# 彩色图
rects = cv_lite.rgb888_find_rectangles(
    image_shape, img_np,
    canny_thresh1, canny_thresh2, approx_epsilon,
    area_min_ratio, max_angle_cos, gaussian_blur_size
)
```

- 第一个参数 `image_shape` 给出图像的高宽，`img_np` 为输入 ndarray，其后依次是 7 个检测参数；
- 灰度图调用 `grayscale_find_rectangles`，RGB888 图调用 `rgb888_find_rectangles`；
- 返回值 `rects` 是一个扁平列表，格式为 `[x0, y0, w0, h0, x1, y1, w1, h1, ...]`，每 4 个元素描述一个矩形（左上角 x、y 与宽 w、高 h）。

### 遍历并绘制矩形

```
for i in range(0, len(rects), 4):
    x = rects[i]
    y = rects[i + 1]
    w = rects[i + 2]
    h = rects[i + 3]
    img.draw_rectangle(x, y, w, h, color=(255, 255, 255), thickness=2)  # 灰度示例：白色
    # img.draw_rectangle(x, y, w, h, color=(255, 0, 0), thickness=2)    # 彩色示例：红色
```

- 由于返回列表每 4 个元素为一个矩形，循环以步长 4 取出 `x, y, w, h`；
- **`img.draw_rectangle(x, y, w, h, ...)`**：用 openmv 的绘图接口在原图上画矩形框，灰度示例用白色、彩色示例用红色，`thickness` 为线宽；
- 绘制操作作用在原始 `image` 对象上（与 ndarray 共享内存），因此检测结果会直接反映到显示画面中。

### 显示与帧率

```
Display.show_image(img)
gc.collect()
print("fps:", clock.fps(), "rects:", len(rects) // 4)   # 灰度示例同时打印矩形数量
```

- **`Display.show_image(img)`**：将带矩形框的图像输出到 LCD 与 IDE；
- **`gc.collect()`**：每帧回收内存，避免长时间运行内存碎片化（彩色示例在回收前还执行了 `del img_np`、`del img` 主动释放引用）；
- **`print(...)`**：打印实时帧率，灰度示例额外打印检测到的矩形数量 `len(rects) // 4`，便于观察 cv_lite 相对 openmv 原生 `find_rectangles` 的速度提升。

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
# MicroPython 灰度图矩形检测测试代码（使用 cv_lite 扩展模块）
# Grayscale Rectangle Detection Test using cv_lite extension
# ============================================================

import time, os, sys, gc
from machine import Pin
from media.sensor import *     # 摄像头接口 / Camera interface
from media.display import *    # 显示接口 / Display interface
from media.media import *      # 媒体资源管理器 / Media manager
import _thread
import cv_lite                 # cv_lite扩展模块 / cv_lite extension (C bindings)
import ulab.numpy as np        # MicroPython NumPy类库

# -------------------------------
# 图像尺寸设置 / Image resolution
# -------------------------------
image_shape = [480, 640]  # 高 x 宽 / Height x Width

# -------------------------------
# 初始化摄像头（灰度图模式） / Initialize camera (grayscale mode)
# -------------------------------
sensor = Sensor(id=0, width=1280, height=720,fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.GRAYSCALE)  # 灰度图格式 / Grayscale format

# -------------------------------
# 初始化显示器（IDE虚拟输出） / Initialize display (IDE virtual output)
# -------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=100)

# -------------------------------
# 初始化媒体系统 / Initialize media system
# -------------------------------

sensor.run()

# -------------------------------
# 可选增益设置（亮度/对比度调节）/ Optional sensor gain setting
# -------------------------------
sensor.again(20.0)

# -------------------------------
# 启动帧率计时 / Start FPS timer
# -------------------------------
clock = time.clock()

# -------------------------------
# 矩形检测可调参数 / Adjustable rectangle detection parameters
# -------------------------------
canny_thresh1      = 50        # Canny 边缘检测低阈值 / Canny low threshold
canny_thresh2      = 150       # Canny 边缘检测高阈值 / Canny high threshold
approx_epsilon     = 0.04      # 多边形拟合精度比例（越小拟合越精确）/ Polygon approximation accuracy
area_min_ratio     = 0.001     # 最小面积比例（相对于图像总面积）/ Min area ratio
max_angle_cos      = 0.3       # 最大角度余弦（越小越接近矩形）/ Max cosine of angle between edges
gaussian_blur_size = 5         # 高斯模糊核尺寸（奇数）/ Gaussian blur kernel size

# -------------------------------
# 主循环 / Main loop
# -------------------------------
while True:
    clock.tick()

    # 拍摄一帧图像 / Capture a frame
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()

    # 调用底层矩形检测函数
    # 返回格式：[x0, y0, w0, h0, x1, y1, w1, h1, ...]
    rects = cv_lite.grayscale_find_rectangles(
        image_shape, img_np,
        canny_thresh1, canny_thresh2,
        approx_epsilon,
        area_min_ratio,
        max_angle_cos,
        gaussian_blur_size
    )

    # 遍历检测到的矩形并绘制
    for i in range(0, len(rects), 4):
        x = rects[i]
        y = rects[i + 1]
        w = rects[i + 2]
        h = rects[i + 3]
        img.draw_rectangle(x, y, w, h, color=(255, 255, 255), thickness=2)

    # 显示图像 / Show image
    Display.show_image(img)

    # 垃圾回收 & 输出帧率和检测矩形数量 / Garbage collect and print FPS & rectangles count
    gc.collect()
    print("fps:", clock.fps(), "rects:", len(rects) // 4)

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
# MicroPython 基于 cv_lite 的 RGB888 矩形检测测试代码
# RGB888 Rectangle Detection Test using cv_lite extension
# ============================================================

import time, os, sys, gc
from machine import Pin
from media.sensor import *     # 摄像头接口 / Camera interface
from media.display import *    # 显示接口 / Display interface
from media.media import *      # 媒体资源管理器 / Media manager
import _thread
import cv_lite                 # cv_lite扩展模块 / cv_lite extension module
import ulab.numpy as np

# -------------------------------
# 图像尺寸 [高, 宽] / Image size [Height, Width]
# -------------------------------
image_shape = [480, 640]

# -------------------------------
# 初始化摄像头（RGB888格式） / Initialize camera (RGB888 format)
# -------------------------------
sensor = Sensor(id=0, width=1280, height=720,fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.RGB888)

# -------------------------------
# 初始化显示器（IDE虚拟显示输出） / Initialize display (IDE virtual output)
# -------------------------------
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=100)

# -------------------------------
# 初始化媒体资源管理器并启动摄像头 / Init media manager and start camera
# -------------------------------

sensor.run()

# -------------------------------
# 启动帧率计时器 / Start FPS timer
# -------------------------------
clock = time.clock()

# -------------------------------
# 可调参数（建议调试时调整）/ Adjustable parameters (recommended for tuning)
# -------------------------------
canny_thresh1       = 50        # Canny 边缘检测低阈值 / Canny edge low threshold
canny_thresh2       = 150       # Canny 边缘检测高阈值 / Canny edge high threshold
approx_epsilon      = 0.04      # 多边形拟合精度（比例） / Polygon approximation precision (ratio)
area_min_ratio      = 0.001     # 最小面积比例（0~1） / Minimum area ratio (0~1)
max_angle_cos       = 0.5       # 最大角余弦（值越小越接近矩形） / Max cosine of angle (smaller closer to rectangle)
gaussian_blur_size  = 5         # 高斯模糊核大小（奇数） / Gaussian blur kernel size (odd number)

# -------------------------------
# 主循环 / Main loop
# -------------------------------
while True:
    clock.tick()

    # 拍摄当前帧图像 / Capture current frame
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()  # 获取 RGB888 ndarray 引用 / Get RGB888 ndarray reference

    # 调用底层矩形检测函数，返回矩形列表 [x0, y0, w0, h0, x1, y1, w1, h1, ...]
    # Call underlying rectangle detection function, returns list of rectangles [x, y, w, h, ...]
    rects = cv_lite.rgb888_find_rectangles(
        image_shape, img_np,
        canny_thresh1, canny_thresh2,
        approx_epsilon,
        area_min_ratio,
        max_angle_cos,
        gaussian_blur_size
    )

    # 遍历检测到的矩形，绘制矩形框 / Iterate detected rectangles and draw bounding boxes
    for i in range(0, len(rects), 4):
        x = rects[i]
        y = rects[i + 1]
        w = rects[i + 2]
        h = rects[i + 3]
        img.draw_rectangle(x, y, w, h, color=(255, 0, 0), thickness=2)

    # 显示带矩形框的图像 / Display image with rectangles drawn
    Display.show_image(img)

    # 释放临时变量内存 / Free temporary variables memory
    del img_np
    del img

    # 进行垃圾回收 / Perform garbage collection
    gc.collect()

    # 打印当前帧率和检测到的矩形数量 / Print current FPS and number of detected rectangles
    print("fps:", clock.fps())

# -------------------------------
# 退出时释放资源 / Cleanup on exit
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)

```



## 实验结果
在 CanMV IDE 中运行示例代码，摄像头采集的图像上会用矩形框标出检测到的矩形（灰度示例为白色、彩色示例为红色），同时串口打印实时帧率（灰度示例还会打印检测到的矩形数量）。若出现漏检或误检，可按场景调整参数：降低 `canny_thresh1` / `canny_thresh2` 可检出更弱的边缘，调小 `max_angle_cos` 能减少非矩形被误判，调大 `area_min_ratio` 可过滤小面积干扰；`approx_epsilon` 过大会把圆角或弯曲轮廓误拟合成四边形，需按目标大小适当调小。
