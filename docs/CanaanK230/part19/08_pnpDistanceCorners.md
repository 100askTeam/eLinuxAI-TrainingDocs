---
boards: [CanMV_V3]
---
# PnP矩形测距

## 实验原理

本实验在矩形角点检测的基础上，利用检测到的 4 个真实角点进行 PnP 测距，相比基于色块外接矩形的轴对齐四角，真实角点能更好应对矩形的透视形变，测距更准。底层调用 `cv_lite.rgb888_pnp_distance_from_corners`，一步完成“矩形 + 角点检测 -> PnP 测距”。

### 为什么用角点

色块测距用外接矩形的 4 个轴对齐角作为 2D 对应点，当目标倾斜或存在透视形变时，轴对齐外接矩形与真实投影并不重合，会引入误差。矩形角点检测直接给出拟合四边形的 4 个真实顶点，它们才是平面矩形在图像中的真实投影，用这 4 个点做 PnP 对应更准确。

### PnP 测距

与色块测距原理一致：以 4 个图像角点对应 `obj_width_real × obj_height_real` 真实矩形的 4 个 3D 角点，结合相机内参 `camera_matrix` 与畸变 `dist_coeffs`，由 `solvePnP` 解出位姿，平移向量的 $Z$ 分量即为距离。基本关系仍为针孔模型：

$$
Z = \frac{f \cdot W}{w}
$$

PnP 在此基础上引入完整内参与畸变校正，并用真实角点而非外接矩形角作为对应点，因而对存在透视形变的目标更稳健。

### cv_lite 的封装与数据流

- `rgb888_pnp_distance_from_corners` 以 `image_shape`、`img_np`、内参、畸变、真实宽高为输入，内部完成矩形与角点检测并求解 PnP；
- 返回 `res = [distance, rect, corners]`：`distance` 为距离（检测失败时为 0 或负值）、`rect` 为外接矩形 `[x, y, w, h]`、`corners` 为 4 个角点坐标；
- 检测成功时把图像转 RGB565 后绘制矩形、角点与距离文字并显示，并在矩形内部进一步做泛洪填充与色块分割以标注内容区域。
## 代码解析
本示例为 RGB888 矩形角点 + PnP 测距，下面按关键步骤解析。

### 导入模块

```
import cv_lite               # cv_lite 扩展模块
import ulab.numpy as np      # MicroPython NumPy 类库
from media.sensor import *
from media.display import *
from media.media import *
```

- **`cv_lite`**：提供 `rgb888_pnp_distance_from_corners` 接口（内部完成矩形/角点检测与 PnP 解算）；
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
- **`Sensor(...)` / `set_framesize` / `set_pixformat(Sensor.RGB888)`**：创建摄像头并把输出帧设为 640×480 的 RGB888；
- **`Display.init(Display.ST7701, ...)`**：初始化 3.5 寸 LCD，`to_ide=True` 同时回传 IDE；
- **`sensor.run()`**：启动摄像头采集。

### 相机参数与目标尺寸

```
camera_matrix = [789.12, 0.0, 308.82, 0.0, 784.64, 220.81, 0.0, 0.0, 1.0]  # 3x3 内参（行展开）
dist_coeffs = [...]   # 5 个畸变系数
dist_len = len(dist_coeffs)

obj_width_real = 20.1    # 目标真实宽度（约 A4 纸宽）
obj_height_real = 28.9   # 目标真实高度（约 A4 纸高）
```

- **`camera_matrix`**：相机内参矩阵（3×3 按行展开），由标定得到；代码中另保留了一套注释的 `lushanpi` 标定参数，可按实际开发板切换；
- **`dist_coeffs` / `dist_len`**：镜头畸变系数及其长度；
- **`obj_width_real` / `obj_height_real`**：目标矩形的真实尺寸（单位 cm），示例约为 A4 纸大小，需按实际目标测量填入。

### 辅助函数与颜色设置

```
green_rgb = (0, 255, 0)
green_lab_min = (0, -128, 0)
green_lab_max = (100, 0, 127)

def mid_point_rect(x0, y0, wid, heigh):
    x_mid = x0 + wid // 2
    y_mid = y0 + heigh // 2
    return (x_mid, y_mid)
```

- `green_rgb` / `green_lab_*`：后续泛洪填充与绿色色块检测用到的颜色与阈值；
- **`mid_point_rect`**：计算矩形中心点坐标，用作泛洪填充的种子点。

### 获取图像 ndarray 引用（零拷贝）

```
img = sensor.snapshot()
img_np = img.to_numpy_ref()
```

- **`sensor.snapshot()`**：采集一帧图像；
- **`img.to_numpy_ref()`**：零拷贝取得 RGB888 ndarray 引用，供 PnP 测距使用。

### 调用 cv_lite 角点 PnP 测距

```
res = cv_lite.rgb888_pnp_distance_from_corners(
    image_shape, img_np,
    camera_matrix, dist_coeffs, dist_len,
    obj_width_real, obj_height_real
)
distance = res[0]
rect = res[1]
corners = res[2]

if distance > 0:
    ...
else:
    img.draw_string_advanced(10, 10, 32, "No Rect Found", color=(255, 0, 0))
```

- **`rgb888_pnp_distance_from_corners`**：以 `image_shape`、`img_np`、内参、畸变、真实宽高为输入，内部完成矩形与角点检测并用 4 个真实角点求解 PnP；
- 返回 `res` 三元组：`distance`（距离，cm）、`rect`（外接矩形 `[x, y, w, h]`）、`corners`（4 个角点坐标）；
- `distance > 0` 表示检测成功；否则提示 `No Rect Found`。

### 结果可视化（泛洪填充 + 绘制）

```
if distance > 0:
    img565 = img.to_rgb565()
    x, y, w, h = rect[0], rect[1], rect[2], rect[3]

    # 取矩形中心 60% 区域作为泛洪填充种子区
    inner_x = x + int(w * 0.2); inner_y = y + int(h * 0.2)
    inner_w = int(w * 0.6);     inner_h = int(h * 0.6)
    seed_x, seed_y = mid_point_rect(inner_x, inner_y, inner_w, inner_h)

    img565.flood_fill(int(seed_x), int(seed_y), seed_threshold=0.1, floating_thresholds=0.05,
                      color=green_rgb, invert=False, clear_background=False)

    # 在矩形 ROI 内检测非绿色区域（invert=True）
    green_blobs = img565.find_blobs([(0, 80, -128, 90, -128, 29)], invert=True,
                                    roi=(int(x), int(y), int(w), int(h)), ...)
    ...
    # 绘制矩形、4 个角点十字、距离与尺寸文字
    img565.draw_string_advanced(10, 10, 32, "Dist: %.2fcm" % distance, color=(255, 255, 255))
    img565.draw_rectangle(x, y, w, h, color=(255, 0, 0), thickness=2)
    img565.draw_cross(corners[0][0], corners[0][1], ...)
    ...
```

- **`img.to_rgb565()`**：把 RGB888 图像转为 RGB565，以便使用 openmv 的 `flood_fill`、`find_blobs` 等绘图与检测接口；
- **矩形 + 角点**：`rect` 给出外接矩形，`corners` 给出 4 个真实角点，分别用 `draw_rectangle` 与 `draw_cross` 绘制；
- **泛洪填充**：以矩形中心区域为种子点向周围填充绿色，把矩形内部背景染绿；
- **内容分割**：`find_blobs(..., invert=True, roi=矩形)` 在矩形内检测与绿色阈值不匹配的区域，取面积最大者绘制并显示其尺寸 `Tgt: WxH`，用于在标定卡片上进一步定位/测量内部目标；
- 文字 `Dist`、`Rect`、`Tgt` 分别显示距离、矩形尺寸与内部目标尺寸。

### 显示与帧率

```
if img565 is not None:
    Display.show_image(img565)
else:
    Display.show_image(img)
print("contour_pnp:", clock.fps())
gc.collect()
```

- 检测成功时显示带标注的 `img565`，否则显示原图 `img`；
- **`print(...)`**：打印实时帧率；
- **`gc.collect()`**：每帧回收内存。

示例末尾的 `sensor.stop()`、`Display.deinit()` 等为资源释放代码，用于脚本停止时回收摄像头与显示资源。
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
# MicroPython 轮廓检测+PnP 距离估计测试（cv_lite 扩展）
# Contour Detection + PnP Distance Estimation via cv_lite
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
sensor.set_framesize(w=image_shape[1], h=image_shape[0],chn=CAM_CHN_ID_0)
sensor.set_pixformat(Sensor.RGB888)

# -------------------------------
# 虚拟显示器输出
# -------------------------------
#Display.init(Display.ST7701,to_ide=True, quality=50)
Display.init(Display.ST7701, width=image_shape[1], height=image_shape[0], to_ide=True, quality=50)

# -------------------------------
# 启动媒体管理器
# -------------------------------

sensor.run()

# -------------------------------
# 相机参数
# -------------------------------
# lushanpi
# camera_matrix = [
#     797.6684357000107,0.0,342.96392945469194,
#     0.0,794.0425843669741,283.9207126582295,
#     0.0,0.0,1.0
# ]
# dist_coeffs = [0.002973393824577376,1.893431891543599,0.013494792164987314,0.016771512519744052,-12.501761300350461]
# dist_len = len(dist_coeffs)

# 01studio
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
obj_width_real = 20.1
obj_height_real = 28.9

# -------------------------------
# 帧率监控
# -------------------------------
clock = time.clock()

green_rgb = (0, 255, 0)  # 泛洪填充的绿色RGB值
# 修正HSV阈值格式
green_lab_min = (0, -128, 0)
green_lab_max = (100, 0, 127)

def mid_point_rect(x0, y0, wid, heigh):
    x_mid = x0 + wid // 2
    y_mid = y0 + heigh // 2
    return (x_mid, y_mid)

# -------------------------------
# 主循环
# -------------------------------
while True:
    clock.tick()

    img565 = None
    img = sensor.snapshot()
    img_np = img.to_numpy_ref()

    # 距离估计（通过轮廓+PnP）
    res = cv_lite.rgb888_pnp_distance_from_corners(
        image_shape, img_np,
        camera_matrix, dist_coeffs, dist_len,
        obj_width_real, obj_height_real
    )
    distance=res[0]
    rect=res[1]
    corners=res[2]

    # 如果距离估计成功
    if distance > 0:
        img565 = img.to_rgb565()

        # 获取A4纸区域信息
        x, y, w, h = rect[0], rect[1], rect[2], rect[3]

        # 计算中心区域
        inner_x = x + int(w * 0.2)
        inner_y = y + int(h * 0.2)
        inner_w = int(w * 0.6)
        inner_h = int(h * 0.6)

        seed_x, seed_y = mid_point_rect(inner_x, inner_y, inner_w, inner_h)
        img565.flood_fill(int(seed_x), int(seed_y), seed_threshold=0.1, floating_thresholds=0.05,
                    color=green_rgb, invert=False, clear_background=False)

        # 检测中间区域
        green_blobs = img565.find_blobs(
            [(0, 80, -128, 90, -128, 29)], # green
            invert=True,
            roi=(int(x), int(y), int(w), int(h)),
            x_stride=1,
            y_stride=1,
            pixels_threshold=1000,
            area_threshold=1000,
            merge=True,
            margin=False
        )

        # 绘制绿色区域边框
        if green_blobs:
            largest_green = max(green_blobs, key=lambda b: b.area())

            img565.draw_rectangle(
                int(largest_green.x()), int(largest_green.y()),
                int(largest_green.w()), int(largest_green.h()),
                color=(0, 0, 255), thickness=2, fill=False
            )

            info = f"Tgt: {largest_green.w()}x{largest_green.h()}"
            img565.draw_string_advanced(10, 10 + 32 + 32, 32, info, color=(255, 255, 255))

        rect_info = f"Rect: {w}x{h}"
        img565.draw_string_advanced(10, 10 + 32, 32, rect_info, color=(255, 255, 255))

        # Draw all detected rectangles and corners for visual feedback
        img565.draw_string_advanced(10, 10, 32, "Dist: %.2fcm" % distance, color=(255, 255, 255))
        img565.draw_rectangle(x,y,w,h, color=(255, 0, 0), thickness=2)
        img565.draw_cross(corners[0][0],corners[0][1],color=(255,255,255),size=5,thickness=2)
        img565.draw_cross(corners[1][0],corners[1][1],color=(255,255,255),size=5,thickness=2)
        img565.draw_cross(corners[2][0],corners[2][1],color=(255,255,255),size=5,thickness=2)
        img565.draw_cross(corners[3][0],corners[3][1],color=(255,255,255),size=5,thickness=2)
    else:
        img.draw_string_advanced(10, 10, 32, "No Rect Found", color=(255, 0, 0))

    # 显示图像
    if img565 is not None:
        Display.show_image(img565)
    else:
        Display.show_image(img)

    print("contour_pnp:", clock.fps())
#    print("Distance:", distance)
    gc.collect()

# -------------------------------
# 释放资源
# -------------------------------
sensor.stop()
Display.deinit()
os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
time.sleep_ms(100)

```



## 实验结果
在 CanMV IDE 中运行示例代码，当画面中检测到符合尺寸的矩形（如 A4 纸）时，会在其上绘制矩形框、4 个角点十字与距离文字（cm），并显示矩形尺寸，同时在矩形内部通过泛洪填充与色块检测标注内容区域；未检测到时提示 `No Rect Found`。测距精度依赖相机标定参数与目标真实尺寸（`obj_width_real`、`obj_height_real`，示例约为 A4 纸大小），使用前需替换为实际值；目标应尽量平整、正对相机以减小透视误差。相比 PnP 色块测距，本方法使用真实角点而非外接矩形角，对倾斜/形变目标更准确。
