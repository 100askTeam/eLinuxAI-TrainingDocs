---
boards: [CanMV_V3]
---
# PnP色块测距

## 实验原理

本实验在色块检测的基础上，结合相机内参与目标实际尺寸，通过 PnP 求解色块到相机的距离。先用 `cv_lite.rgb888_find_blobs` 检出色块，取其外接矩形作为 2D 投影，再调用 `cv_lite.rgb888_pnp_distance` 估算距离。

### 单目测距与针孔模型

单目相机无法直接得到深度，但若已知目标的真实尺寸，就可以借助针孔成像模型反推距离。设相机焦距为 $f$（像素）、目标真实宽度为 $W$、其在图像中的投影宽度为 $w$，则目标到相机的距离近似为：

$$
Z = \frac{f \cdot W}{w}
$$

即目标在画面中越大（$w$ 越大），距离越近。这是单目测距最直观的关系。

### PnP 位姿求解

PnP（Perspective-n-Point）是上述思想的严格化：给定若干 2D 图像点及其对应的 3D 物体坐标，再结合相机内参矩阵与畸变系数，求解相机相对物体的位姿（旋转 $R$ 与平移 $t$）。本实验中：

- 把色块外接矩形的 4 个角作为 2D 图像点；
- 把目标真实尺寸 `obj_width_real × obj_height_real` 构成的矩形四角作为对应的 3D 物体点（置于 $Z=0$ 平面）；
- `camera_matrix`（3×3 内参，含焦距与主点）与 `dist_coeffs`（畸变系数）提供相机参数，求解前先对图像点做去畸变；
- 由 `solvePnP` 解出平移向量 $t$，其 $Z$ 分量即为色块到相机的距离。

### cv_lite 的封装与数据流

- `rgb888_find_blobs` 返回 `[x, y, w, h, ...]`，取第一个色块的外接矩形 `roi`；
- `rgb888_pnp_distance` 以 `image_shape`、`img_np`、`roi`、内参、畸变、真实宽高为输入，返回距离（单位与真实尺寸一致，示例中为 cm）；
- 距离值通过 `img.draw_string_advanced()` 叠加显示在色块上方。
## 代码解析
本示例为 RGB888 色块 + PnP 测距，下面按关键步骤进行解析。

### 导入模块

```
import cv_lite               # cv_lite 扩展模块
import ulab.numpy as np      # MicroPython NumPy 类库
from media.sensor import *
from media.display import *
from media.media import *
```

- **`cv_lite`**：提供 `rgb888_find_blobs` 与 `rgb888_pnp_distance` 接口；
- **`ulab.numpy`**：`to_numpy_ref()` 返回的 ndarray 类型，作为 cv_lite 输入；
- `media.*`：摄像头、显示与媒体管理接口。

### 初始化摄像头与显示

```
image_shape = [480, 640]
sensor = Sensor(id=0, fps=90)
sensor.reset()
sensor.set_framesize(w=image_shape[1], h=image_shape[0], chn=CAM_CHN_ID_0)
sensor.set_pixformat(Sensor.RGB888)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
sensor.run()
```

- **`image_shape = [480, 640]`**：处理图像高 × 宽为 480×640；
- **`Sensor(...)` / `set_framesize` / `set_pixformat(Sensor.RGB888)`**：创建摄像头并把输出帧设为 640×480 的 RGB888（测距需要彩色色块）；
- **`Display.init(Display.ST7701, ...)`**：初始化 3.5 寸 LCD，`to_ide=True` 同时回传 IDE；
- **`sensor.run()`**：启动摄像头采集。

### 色块检测参数

```
threshold = [120, 255, 0, 50, 0, 50]  # 红色 RGB 阈值 [Rmin, Rmax, Gmin, Gmax, Bmin, Bmax]
min_area = 10                         # 最小检测面积
kernel_size = 1                       # 腐蚀膨胀核大小
```

- **`threshold`**：颜色阈值，6 元素列表，默认为红色；代码另以注释形式给出绿色、蓝色预设，切换目标颜色时取消对应行注释即可；
- **`min_area`**：最小色块面积，过滤小噪声；
- **`kernel_size`**：形态学核大小，用于掩膜去噪。

### 相机参数与目标尺寸

```
camera_matrix = [789.12, 0.0, 308.82, 0.0, 784.64, 220.81, 0.0, 0.0, 1.0]  # 3x3 内参（行展开）
dist_coeffs = [...]   # 5 个畸变系数
dist_len = len(dist_coeffs)

obj_width_real = 3.0    # 色块宽度 3cm
obj_height_real = 3.0   # 色块高度 3cm
```

- **`camera_matrix`**：相机内参矩阵（3×3 按行展开为 9 元素），包含焦距与主点坐标，由相机标定得到；
- **`dist_coeffs` / `dist_len`**：镜头畸变系数及其长度，用于对图像点去畸变；
- **`obj_width_real` / `obj_height_real`**：目标色块的真实尺寸（单位 cm），需按实际使用的色块测量填入，距离结果单位与之一致。

### 获取图像 ndarray 引用（零拷贝）

```
img = sensor.snapshot()
img_np = img.to_numpy_ref()
```

- **`sensor.snapshot()`**：采集一帧图像；
- **`img.to_numpy_ref()`**：零拷贝取得 RGB888 ndarray 引用，供色块检测与 PnP 测距共用。

### 色块检测 + PnP 测距

```
blobs = cv_lite.rgb888_find_blobs(image_shape, img_np, threshold, min_area, kernel_size)

if len(blobs) > 0:
    roi = [blobs[0], blobs[1], blobs[2], blobs[3]]           # 第一个色块的外接矩形
    distance = cv_lite.rgb888_pnp_distance(
        image_shape, img_np, roi,
        camera_matrix, dist_coeffs, dist_len,
        obj_width_real, obj_height_real
    )
    img.draw_rectangle(roi[0], roi[1], roi[2], roi[3], color=(255, 0, 0), thickness=2)
    img.draw_string_advanced(roi[0], roi[1] - 40, 30, str("%.2f" % distance) + ' cm', color=(255, 0, 0))
else:
    img.draw_string_advanced(10, 10, 32, "No Blob Found", color=(255, 0, 0))
```

- **`rgb888_find_blobs`**：检出色块，返回 `[x, y, w, h, ...]`；
- **`roi`**：取第一个色块的外接矩形 `[x, y, w, h]` 作为 PnP 的 2D 投影；
- **`rgb888_pnp_distance`**：以 `image_shape`、`img_np`、`roi`、内参、畸变、真实宽高为输入，内部由 `solvePnP` 解算并返回距离（cm）；
- 检测到色块时画红色矩形框并在其上方显示距离文字；未检测到时提示 `No Blob Found`。

### 显示与帧率

```
img.draw_string_advanced(0, 0, 30, 'FPS: ' + str("%.3f" % clock.fps()), color=(255, 255, 255))
Display.show_image(img)
print("blob_pnp:", clock.fps())
gc.collect()
```

- **`img.draw_string_advanced(...)`**：在左上角叠加 FPS 文字；
- **`Display.show_image(img)`**：将带标注的图像输出到 LCD 与 IDE；
- **`gc.collect()`**：每帧回收内存。

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
# MicroPython 色块检测+PnP 距离估计测试（cv_lite 扩展）
# Color Blob Detection + PnP Distance Estimation via cv_lite
# ============================================================

import time, os, gc
from machine import Pin
from media.sensor import *
from media.display import *
from media.media import *
import _thread
import cv_lite               # 需要实现对应的 native C 接口
import ulab.numpy as np

# -------------------------------
# 图像尺寸 / Image size
# -------------------------------
image_shape = [480, 640]

# -------------------------------
# 摄像头初始化
# -------------------------------
sensor = Sensor(id=0, fps=90)
sensor.reset()
sensor_width = sensor.width(None)
sensor_height = sensor.height(None)
# 设置采集图片的分辨率
sensor.set_framesize(w=image_shape[1], h=image_shape[0], chn=CAM_CHN_ID_0)
sensor.set_pixformat(Sensor.RGB888)

# -------------------------------
# 虚拟显示器输出
# -------------------------------
#Display.init(Display.VIRT, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)

# -------------------------------
# 启动媒体管理器
# -------------------------------
sensor.run()

# -------------------------------
# 色块检测参数 / Color blob detection parameters
# -------------------------------
threshold = [120, 255, 0, 50, 0, 50]  # 红色RGB阈值 [Rmin, Rmax, Gmin, Gmax, Bmin, Bmax]
#threshold = [0, 50, 120, 255, 0, 50] #绿色
#threshold = [0, 50, 0, 50, 120, 255] #蓝色
min_area = 10                       # 最小检测面积 / Minimum valid blob area
kernel_size = 1                      # 腐蚀膨胀核大小 / Morphological kernel size

# -------------------------------
# 相机参数
# -------------------------------
camera_matrix = [
    789.1207591978101,0.0,308.8211709453399,
    0.0,784.6402477892891,220.80604393744628,
    0.0,0.0,1.0
]
dist_coeffs = [-0.0032975761115662697,-0.009984467065645562,-0.01301691382446514,-0.00805834837844004,-1.063818733754765]
dist_len = len(dist_coeffs)

# -------------------------------
# 目标实际尺寸（单位 cm）
# -------------------------------
# 色块的实际尺寸，需要根据您使用的色块实际测量
obj_width_real = 3.0    # 色块宽度 3cm
obj_height_real = 3.0   # 色块高度 3cm

# -------------------------------
# 帧率监控
# -------------------------------
clock = time.clock()

# -------------------------------
# 主循环
# -------------------------------
while True:
    clock.tick()

    img = sensor.snapshot()
    img_np = img.to_numpy_ref()

    # 色块检测：返回多个色块 [x, y, w, h, ...] / Detect color blobs
    blobs = cv_lite.rgb888_find_blobs(image_shape, img_np, threshold, min_area, kernel_size)

    if len(blobs) > 0:
        # 获取第一个色块 ROI（矩形）/ Get first blob's bounding box
        roi = [blobs[0], blobs[1], blobs[2], blobs[3]]

        # 使用 PnP 估算色块距离 / Estimate distance via PnP
        distance = cv_lite.rgb888_pnp_distance(
            image_shape, img_np, roi,
            camera_matrix, dist_coeffs, dist_len,
            obj_width_real, obj_height_real
        )

        # 绘制矩形与距离文字 / Draw bounding box and distance text
        img.draw_rectangle(roi[0], roi[1], roi[2], roi[3], color=(255, 0, 0), thickness=2)
        img.draw_string_advanced(roi[0], roi[1] - 40, 30, str("%.2f" % distance) + ' cm', color=(255, 0, 0))
    else:
        img.draw_string_advanced(10, 10, 32, "No Blob Found", color=(255, 0, 0))

    # 显示FPS
    img.draw_string_advanced(0, 0, 30, 'FPS: '+str("%.3f"%(clock.fps())), color = (255, 255, 255))

    # 显示图像
    Display.show_image(img)

    print("blob_pnp:", clock.fps())
    gc.collect()

# -------------------------------
# 释放资源
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)
MediaManager.deinit()
```



## 实验结果
在 CanMV IDE 中运行示例代码，画面上会用红色矩形框标出检测到的色块，并在其上方显示估算距离（单位 cm），左上角显示 FPS；未检测到色块时提示 `No Blob Found`。测距精度依赖相机标定参数（`camera_matrix`、`dist_coeffs`）和目标真实尺寸（`obj_width_real`、`obj_height_real`），使用前需按实际相机和色块尺寸替换；色块应尽量正对相机，倾斜或形变会增大误差。
