---
boards: [CanMV_V3]
---
# 矩形角点检测

## 实验原理

本实验使用 cv_lite 提供的“带角点”矩形检测接口，在检测矩形的同时输出每个矩形的 4 个角点坐标，便于后续做透视校正、位姿估计（如 PnP 测距）等。其底层实现与矩形检测一致，沿用 OpenCV“多边形拟合 + 角度约束”的思路，区别在于额外把拟合得到的四边形顶点返回。输入为通过 `to_numpy_ref()` 零拷贝获取的 `ulab.numpy.ndarray`：灰度图调用 `cv_lite.grayscale_find_rectangles_with_corners`，彩色图调用 `cv_lite.rgb888_find_rectangles_with_corners`。

### 检测流程

检测流程与矩形检测相同：

1. 高斯模糊（`gaussian_blur_size`）去噪 + Canny（`canny_thresh1` / `canny_thresh2`）提取边缘；
2. `findContours` 提取闭合轮廓；
3. `approxPolyDP` 以 `epsilon = 轮廓周长 × approx_epsilon` 做多边形拟合；
4. 筛选顶点数为 4、面积大于 `area_min_ratio × 图像总面积`、相邻边夹角余弦绝对值小于 `max_angle_cos` 的多边形，判定为矩形。

### 角点输出

与矩形检测只返回外接矩形 `[x, y, w, h]` 不同，带角点版本会额外返回拟合四边形的 4 个顶点。这些顶点是轮廓上真实拟合出的角点，对于存在透视形变（倾斜、近大远小）的矩形，它们比轴对齐外接矩形的四角更贴近真实角点位置，因此更适合用于后续的透视变换或 PnP 位姿估计。每个矩形的返回结构为：

`[x, y, w, h, c1.x, c1.y, c2.x, c2.y, c3.x, c3.y, c4.x, c4.y]`

其中 `[x, y, w, h]` 为外接矩形，`c1~c4` 为 4 个角点坐标，所有矩形以列表形式返回：`[[...], [...], ...]`。

### cv_lite 的封装与数据流

- 通过 `img.to_numpy_ref()` 以零拷贝方式取得输入图像的 ndarray 引用；
- 灰度图调用 `grayscale_find_rectangles_with_corners`，RGB888 图调用 `rgb888_find_rectangles_with_corners`，参数与矩形检测完全一致；
- 返回值为嵌套列表，每个元素含外接矩形与 4 个角点；用 openmv 的 `img.draw_rectangle()` 画矩形框、`img.draw_cross()` 标注 4 个角点后再显示。
## 代码解析
两个示例（灰度图与彩色图）处理流程一致，区别仅在于像素格式与调用的检测函数。下面按关键步骤进行解析。

### 导入模块

```
import cv_lite                 # cv_lite 扩展模块
import ulab.numpy as np        # MicroPython NumPy 类库
from media.sensor import *     # 摄像头接口
from media.display import *    # 显示接口
from media.media import *      # 媒体资源管理器
```

- **`cv_lite`**：提供 `grayscale_find_rectangles_with_corners` / `rgb888_find_rectangles_with_corners` 等基于 OpenCV 的加速接口；
- **`ulab.numpy`**：MicroPython 下的类 NumPy 库，`to_numpy_ref()` 返回的 ndarray 即为该类型，作为 cv_lite 的输入；
- `media.sensor` / `media.display` / `media.media`：openmv 风格的摄像头、显示与媒体管理接口，负责采集与显示。

### 初始化摄像头与显示

```
image_shape = [480, 640]
sensor = Sensor(id=0, fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.GRAYSCALE)   # 灰度示例
# sensor.set_pixformat(Sensor.RGB888)    # 彩色示例
sensor.again(20.0)                        # 可选：调节增益
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
sensor.run()
```

- **`image_shape = [480, 640]`**：处理图像的高 × 宽为 480×640，后续既用于设置帧大小，也作为 cv_lite 检测函数的入参；
- **`Sensor(...)` / `set_pixformat`**：创建摄像头对象并把输出帧设为 640×480，灰度示例用 `Sensor.GRAYSCALE`、彩色示例用 `Sensor.RGB888`；
- **`sensor.again(20.0)`**：可选的模拟增益设置，用于调节画面亮度/对比度；
- **`Display.init(Display.ST7701, ...)`**：初始化 3.5 寸 LCD，`to_ide=True` 同时把画面回传给 IDE；
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

这 7 个参数与矩形检测完全一致：`canny_thresh1` / `canny_thresh2` 控制边缘提取、`gaussian_blur_size` 控制预处理模糊程度、`approx_epsilon` 控制多边形拟合精度、`area_min_ratio` 过滤小面积、`max_angle_cos` 约束四角接近直角的程度。

### 获取图像 ndarray 引用（零拷贝）

```
img = sensor.snapshot()
img_np = img.to_numpy_ref()
```

- **`sensor.snapshot()`**：采集一帧图像，返回 openmv 的 `image` 对象；
- **`img.to_numpy_ref()`**：以零拷贝方式返回引用同一块传感器缓冲区的 `ulab.numpy.ndarray`，作为 cv_lite 检测函数的输入，耗时极低。

### 调用 cv_lite 带角点矩形检测

```
# 灰度图
rects = cv_lite.grayscale_find_rectangles_with_corners(
    image_shape, img_np,
    canny_thresh1, canny_thresh2, approx_epsilon,
    area_min_ratio, max_angle_cos, gaussian_blur_size
)
# 彩色图
rects = cv_lite.rgb888_find_rectangles_with_corners(
    image_shape, img_np,
    canny_thresh1, canny_thresh2, approx_epsilon,
    area_min_ratio, max_angle_cos, gaussian_blur_size
)
```

- 参数与矩形检测完全一致，区别在于函数名带 `_with_corners`；
- 返回值 `rects` 是**嵌套列表**，每个元素为 `[x, y, w, h, c1.x, c1.y, c2.x, c2.y, c3.x, c3.y, c4.x, c4.y]`--前 4 个为外接矩形，后 8 个为 4 个角点坐标。

### 遍历并绘制矩形与角点

```
for i in range(len(rects)):
    r = rects[i]
    img.draw_rectangle(r[0], r[1], r[2], r[3], color=(255, 255, 255), thickness=2)
    img.draw_cross(r[4], r[5], color=(255, 255, 255), size=5, thickness=2)
    img.draw_cross(r[6], r[7], color=(255, 255, 255), size=5, thickness=2)
    img.draw_cross(r[8], r[9], color=(255, 255, 255), size=5, thickness=2)
    img.draw_cross(r[10], r[11], color=(255, 255, 255), size=5, thickness=2)
```

- `len(rects)` 为检测到的矩形个数，逐个取出 `r`；
- **`img.draw_rectangle(r[0..3])`**：用白色框画出外接矩形；
- **`img.draw_cross(r[4..11])`**：在 4 个角点 `(c1~c4)` 处绘制白色十字标记，`size` 控制十字大小、`thickness` 控制线宽；
- 绘制作用在原始 `image` 对象上（与 ndarray 共享内存），直接反映到显示画面。

### 显示与帧率

```
Display.show_image(img)
gc.collect()
print("fps:", clock.fps())
```

- **`Display.show_image(img)`**：将带矩形框与角点标记的图像输出到 LCD 与 IDE；
- **`gc.collect()`**：每帧回收内存，避免长时间运行内存碎片化；
- **`print("fps:", ...)`**：打印实时帧率。

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
# MicroPython 灰度图矩形检测测试代码（使用 cv_lite 扩展模块）,带角点
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
sensor = Sensor(id=0, fps = 90)
sensor.reset()

sensor_width = sensor.width(None)
sensor_height = sensor.height(None)
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.GRAYSCALE)  # 灰度图格式 / Grayscale format

# -------------------------------
# 初始化显示器（IDE虚拟输出） / Initialize display (IDE virtual output)
# -------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)

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
    # 返回格式：[[x0, y0, w0, h0, c1.x, c1.y, c2.x, c2.y, c3.x, c3.y, c4,x, c4.y], [x1, y1, w1, h1,c1.x, c1.y, c2.x, c2.y, c3.x, c3.y, c4,x, c4.y], ...]
    rects = cv_lite.grayscale_find_rectangles_with_corners(
        image_shape, img_np,
        canny_thresh1, canny_thresh2,
        approx_epsilon,
        area_min_ratio,
        max_angle_cos,
        gaussian_blur_size
    )
    # 遍历检测到的矩形并绘制矩形框和角点
    for i in range(len(rects)):
        r = rects[i]
        img.draw_rectangle(r[0],r[1], r[2], r[3], color=(255, 255, 255), thickness=2)
        img.draw_cross(r[4],r[5],color=(255,255,255),size=5,thickness=2)
        img.draw_cross(r[6],r[7],color=(255,255,255),size=5,thickness=2)
        img.draw_cross(r[8],r[9],color=(255,255,255),size=5,thickness=2)
        img.draw_cross(r[10],r[11],color=(255,255,255),size=5,thickness=2)

    # 显示图像 / Show image
    Display.show_image(img)

    # 垃圾回收 & 输出帧率/ Garbage collect and print FPS
    gc.collect()
    print("fps:", clock.fps())

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
# MicroPython RGB888矩形检测测试代码（使用 cv_lite 扩展模块）,带角点
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
# 初始化摄像头（RGB888模式） / Initialize camera (rgb888 mode)
# -------------------------------
sensor = Sensor(id=0, fps = 90)
sensor.reset()
sensor_width = sensor.width(None)
sensor_height = sensor.height(None)
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.RGB888)  # RGB888格式 / rgb888 format

# -------------------------------
# 初始化显示器（IDE虚拟输出） / Initialize display (IDE virtual output)
# -------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)

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
    # 返回格式：[[x0, y0, w0, h0, c1.x, c1.y, c2.x, c2.y, c3.x, c3.y, c4,x, c4.y], [x1, y1, w1, h1,c1.x, c1.y, c2.x, c2.y, c3.x, c3.y, c4,x, c4.y], ...]
    rects = cv_lite.rgb888_find_rectangles_with_corners(
        image_shape, img_np,
        canny_thresh1, canny_thresh2,
        approx_epsilon,
        area_min_ratio,
        max_angle_cos,
        gaussian_blur_size
    )
    # 遍历检测到的矩形并绘制矩形框和角点
    for i in range(len(rects)):
        r = rects[i]
        img.draw_rectangle(r[0],r[1], r[2], r[3], color=(255, 255, 255), thickness=2)
        img.draw_cross(r[4],r[5],color=(255,255,255),size=5,thickness=2)
        img.draw_cross(r[6],r[7],color=(255,255,255),size=5,thickness=2)
        img.draw_cross(r[8],r[9],color=(255,255,255),size=5,thickness=2)
        img.draw_cross(r[10],r[11],color=(255,255,255),size=5,thickness=2)

    # 显示图像 / Show image
    Display.show_image(img)

    # 垃圾回收 & 输出帧率/ Garbage collect and print FPS
    gc.collect()
    print("fps:", clock.fps())

# -------------------------------
# 程序退出与资源释放 / Cleanup on exit
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)
```



## 实验结果
在 CanMV IDE 中运行示例代码，画面上会用白色矩形框标出检测到的矩形，并在其 4 个角点处绘制十字标记，同时串口打印实时帧率。角点是拟合四边形的真实顶点，可配合后续的 PnP 测距或透视校正使用。若出现漏检或误检，调参方式与矩形检测一致：调整 `canny_thresh1` / `canny_thresh2`、`max_angle_cos`、`area_min_ratio`、`approx_epsilon` 等。
