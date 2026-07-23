---
boards: [CanMV_V3]
---
# 色块检测

## 实验原理

本实验使用 cv_lite 提供的色块检测接口，在摄像头采集的 RGB888 图像上实时检测指定颜色的色块，并用 openmv 的绘图接口将检测到的色块外接矩形绘制出来。其底层实现基于“颜色阈值分割 + 形态学预处理 + 连通域分析”的经典流程，输入为通过 `to_numpy_ref()` 零拷贝获取的 `ulab.numpy.ndarray`，调用 `cv_lite.rgb888_find_blobs`。

### 颜色阈值分割

色块检测的第一步是把“目标颜色”从背景中分离出来。阈值以 6 元素列表 `[Rmin, Rmax, Gmin, Gmax, Bmin, Bmax]` 给出，对 RGB888 图像的每个像素，若其 R、G、B 三个分量同时落在各自的 [min, max] 区间内，则判为目标颜色像素，否则为背景。逐像素判断后得到一张二值掩膜（目标为前景、其余为背景）。例如 `[120, 255, 0, 50, 0, 50]` 表示 R 偏高、G 与 B 偏低，即红色。

### 形态学预处理

受光照、噪声影响，阈值分割得到的掩膜常含细小噪点或目标内部空洞。代码用 `kernel_size` 指定形态学核大小，对掩膜做腐蚀/膨胀（开运算）处理：先腐蚀去掉零散小点，再膨胀补回目标边缘，从而抑制噪声、使色块更紧凑连续。

### 连通域分析与面积过滤

对预处理后的掩膜做连通域标记，把彼此连通的前景像素聚成一个个色块。随后按 `min_area` 过滤--面积小于该值的色块被当作噪声丢弃。最终每个有效色块以其外接矩形 `[x, y, w, h]`（左上角坐标与宽高）返回，所有色块扁平拼接为 `[x0, y0, w0, h0, x1, y1, w1, h1, ...]`。

### cv_lite 的封装与数据流

- 通过 `img.to_numpy_ref()` 以零拷贝方式取得 RGB888 图像的 ndarray 引用；
- 阈值 `threshold`、最小面积 `min_area`、形态学核 `kernel_size` 作为参数传入 `rgb888_find_blobs`；
- 返回值 `blobs` 为 `[x, y, w, h, ...]`，每 4 个元素描述一个色块，用 openmv 的 `img.draw_rectangle()` 在原图上绘制后再显示。

由于 ndarray 与 image 共享同一块内存，整个“采集 -> 检测 -> 绘制 -> 显示”链路无需额外拷贝，因此相比 openmv 原生 `find_blobs` 在彩色图上有明显的速度优势（参见 cv_lite 概述中的速度对比）。
## 代码解析
本示例为 RGB888 彩色色块检测，下面按关键步骤进行解析。

### 导入模块

```
import cv_lite              # cv_lite 扩展模块
import ulab.numpy as np     # MicroPython NumPy 类库
from media.sensor import *  # 摄像头接口
from media.display import * # 显示接口
from media.media import *   # 媒体资源管理器
```

- **`cv_lite`**：提供 `rgb888_find_blobs` 等基于 OpenCV 的加速接口；
- **`ulab.numpy`**：MicroPython 下的类 NumPy 库，`to_numpy_ref()` 返回的 ndarray 即为该类型，作为 cv_lite 的输入；
- `media.sensor` / `media.display` / `media.media`：openmv 风格的摄像头、显示与媒体管理接口，负责采集与显示。

### 初始化摄像头与显示

```
image_shape = [480, 640]  # 高 x 宽
sensor = Sensor(id=0, fps=90)
sensor.reset()
sensor.set_framesize(width=image_shape[1], height=image_shape[0])
sensor.set_pixformat(Sensor.RGB888)  # 色块检测需要彩色信息
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
MediaManager.init()
sensor.run()
```

- **`image_shape = [480, 640]`**：处理图像的高 × 宽为 480×640，后续既用于设置帧大小，也作为 cv_lite 检测函数的入参；
- **`Sensor(...)` / `set_pixformat(Sensor.RGB888)`**：创建摄像头对象并把输出帧设为 640×480 的 RGB888 格式（色块检测依赖颜色信息，故必须用彩色）；
- **`Display.init(Display.ST7701, ...)`**：初始化 3.5 寸 LCD，`to_ide=True` 同时把画面回传给 IDE，`quality` 为 JPEG 压缩质量；
- **`MediaManager.init()`**：初始化媒体资源管理器，管理图像等缓冲资源；
- **`sensor.run()`**：启动摄像头采集。

### 色块检测阈值与参数

```
# 格式：[Rmin, Rmax, Gmin, Gmax, Bmin, Bmax]
threshold = [120, 255, 0, 50, 0, 50] #红色
#threshold = [0, 50, 120, 255, 0, 50] #绿色
#threshold = [0, 50, 0, 50, 120, 255] #黄色

min_area = 100    # 最小色块面积
kernel_size = 1   # 腐蚀膨胀核大小（用于预处理）
```

- **`threshold`**：颜色阈值，6 元素列表 `[Rmin, Rmax, Gmin, Gmax, Bmin, Bmax]`，像素的 R/G/B 三个分量需同时落在各自区间才被判为目标色。默认 `[120,255,0,50,0,50]` 为红色（R 高、G/B 低）；代码另以注释形式给出了绿色、黄色等颜色预设，切换目标颜色时取消对应行注释即可，并按实际光照微调区间；
- **`min_area`**：最小色块面积（像素数），小于该值的连通域当作噪声丢弃；
- **`kernel_size`**：形态学腐蚀/膨胀的核大小，用于在连通域分析前对掩膜去噪、补洞。

实际调试时，若目标色块漏检可适当放宽阈值区间、调小 `min_area`；若背景误检多则收紧阈值区间、调大 `min_area` 或 `kernel_size`。

### 获取图像 ndarray 引用（零拷贝）

```
img = sensor.snapshot()
img_np = img.to_numpy_ref()
```

- **`sensor.snapshot()`**：采集一帧图像，返回 openmv 的 `image` 对象；
- **`img.to_numpy_ref()`**：以零拷贝方式返回引用同一块传感器缓冲区的 `ulab.numpy.ndarray`（RGB888 三通道），作为 cv_lite 检测函数的输入。由于不复制像素数据，这一步耗时极低。

### 调用 cv_lite 色块检测

```
blobs = cv_lite.rgb888_find_blobs(image_shape, img_np, threshold, min_area, kernel_size)
```

- 第一个参数 `image_shape` 给出图像的高宽，`img_np` 为输入 ndarray，其后依次是颜色阈值 `threshold`、最小面积 `min_area`、形态学核 `kernel_size`；
- 函数内部完成"阈值分割 -> 形态学预处理 -> 连通域分析 -> 面积过滤"；
- 返回值 `blobs` 是一个扁平列表，格式为 `[x0, y0, w0, h0, x1, y1, w1, h1, ...]`，每 4 个元素描述一个色块（左上角 x、y 与宽 w、高 h）。

### 遍历并绘制色块

```
for i in range(len(blobs) // 4):
    x = blobs[4*i]
    y = blobs[4*i + 1]
    w = blobs[4*i + 2]
    h = blobs[4*i + 3]
    img.draw_rectangle(x, y, w, h, color=(255, 0, 0), thickness=2)  # 红色框
```

- 由于返回列表每 4 个元素为一个色块，`len(blobs) // 4` 即色块个数，循环逐个取出 `x, y, w, h`；
- **`img.draw_rectangle(x, y, w, h, ...)`**：用 openmv 的绘图接口在原图上画色块外接矩形，红色框，`thickness` 为线宽；
- 绘制操作作用在原始 `image` 对象上（与 ndarray 共享内存），因此检测结果会直接反映到显示画面中。

### 显示与帧率

```
Display.show_image(img)
print("findblobs:", clock.fps())
gc.collect()
```

- **`Display.show_image(img)`**：将带色块框的图像输出到 LCD 与 IDE；
- **`print("findblobs:", clock.fps())`**：打印实时帧率，便于观察 cv_lite 相对 openmv 原生 `find_blobs` 的速度提升；
- **`gc.collect()`**：每帧回收内存，避免长时间运行内存碎片化。

示例末尾的 `sensor.stop()`、`Display.deinit()`、`MediaManager.deinit()` 等为资源释放代码，用于脚本停止时回收摄像头、显示与媒体资源。
## 示例代码

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
# MicroPython RGB888 彩色块检测测试代码（使用 cv_lite 扩展模块）
# RGB888 Color Blob Detection Test using cv_lite extension
# ============================================================

import time, os, sys, gc
from machine import Pin
from media.sensor import *  # 导入摄像头接口 / Camera interface
from media.display import * # 导入显示接口 / Display interface
from media.media import *   # 导入媒体资源管理器 / Media manager
import _thread
import cv_lite              # cv_lite 扩展模块
import ulab.numpy as np     # MicroPython NumPy 类库

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
# 初始化显示（IDE虚拟显示模式） / Initialize display (IDE virtual output)
# -------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)

# -------------------------------
# 初始化媒体资源管理器 / Initialize media manager
# -------------------------------
MediaManager.init()
sensor.run()

# -------------------------------
# 色块检测阈值 / Blob detection thresholds
# 格式：[Rmin, Rmax, Gmin, Gmax, Bmin, Bmax]
threshold = [120, 255, 0, 50, 0, 50] #红色
#threshold = [0, 50, 120, 255, 0, 50] #绿色
#threshold = [0, 50, 0, 50, 120, 255] #黄色

min_area = 100    # 最小色块面积 / Minimum blob area
kernel_size = 1   # 腐蚀膨胀核大小（用于预处理）/ Kernel size for morphological ops

# -------------------------------
# 启动帧率计时器 / Start FPS timer
# -------------------------------
clock = time.clock()

# -------------------------------
# 主循环 / Main loop
# -------------------------------
while True:
    clock.tick()

    # 拍摄一帧图像 / Capture a frame
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()  # 获取 RGB888 ndarray 引用

    # 调用 cv_lite 扩展进行色块检测，返回 [x, y, w, h, ...] 列表
    blobs = cv_lite.rgb888_find_blobs(image_shape, img_np, threshold, min_area, kernel_size)

    # 遍历检测到的色块并绘制矩形框
    for i in range(len(blobs) // 4):   # 修正为整数除法
        x = blobs[4*i]
        y = blobs[4*i + 1]
        w = blobs[4*i + 2]
        h = blobs[4*i + 3]
        img.draw_rectangle(x, y, w, h, color=(255, 0, 0), thickness=2)  # 红色框

    # 显示结果图像 / Show image with blobs
    Display.show_image(img)

    # 打印帧率 / Print FPS
    print("findblobs:", clock.fps())

    # 垃圾回收 / Garbage collect
    gc.collect()

# -------------------------------
# 退出释放资源 / Cleanup on exit
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)
MediaManager.deinit()
```



## 实验结果
在 CanMV IDE 中运行示例代码，摄像头采集的图像上会用红色矩形框标出检测到的目标色块（默认为红色），同时串口打印实时帧率。若要检测其它颜色，修改 `threshold` 为对应颜色的 RGB 区间（代码中已预留绿色、黄色等预设），并按实际光照微调阈值范围；漏检时放宽阈值区间或调小 `min_area`，误检时收紧阈值区间或调大 `min_area` / `kernel_size`。
