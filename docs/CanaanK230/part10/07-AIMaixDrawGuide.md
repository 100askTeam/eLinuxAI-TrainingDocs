---
sidebar_position: 3

boards: [AIMaix]
---
# 绘制实验

## 1.实验目的

学习在图像中添加图形或文字。

## 2.实验原理

### 2.1 概述

OpenMV 是一个小型嵌入式机器视觉模块，广泛用于快速开发计算机视觉应用。OpenMV 的图像绘制方法可以用于在图像上绘制各种形状和文字，以便进行视觉反馈和调试。

### 2.2 常用函数

### 2.1 draw_string_advanced

`draw_string_advanced` 函数使用freetype渲染文字，支持中文，用户也可指定字体

- 语法

```
image.draw_string_advanced(x,y,char_size,str,[color, font])
```



- 参数解释
  - `x, y`起点坐标。
  - `char_size`:字符大小
  - `str`:需要绘制的中文字符
  - `color`：字的颜色。
  - `font`： 字体文件路径
- 示例

```
img.draw_string_advanced(10, 10, 32, "你好世界", color=(255, 0, 0))  # 绘制红色线
```



### 2.2 draw_line

`draw_line` 函数可实现在图像上绘制一条线。

- 语法

```
image.draw_line(x0, y0, x1, y1, color)
```



- 参数解释
  - `x0, y0`：起点坐标。
  - `x1, y1`：终点坐标。
  - `color`：线的颜色。
- 示例

```
img.draw_line(10, 10, 100, 100, color=(255, 0, 0))  # 绘制红色线
```



### 2.3 draw_rectangle

`draw_rectangle` 函数可实现在图像上绘制一个矩形。

- 语法

```
image.draw_rectangle(x, y, w, h, color, thickness=1)
```



- 参数解释
  - `x, y`：矩形的左上角坐标。
  - `w, h`：矩形的宽度和高度。
  - `color`：矩形的颜色。
  - `thickness`：矩形边框的厚度（默认为1）。
- 示例

```
img.draw_rectangle(20, 20, 50, 30, color=(0, 255, 0), thickness=2)  # 绘制绿色矩形
```



### 2.4 draw_circle

`draw_circle`函数可实现在图像上绘制一个圆。

- 语法

```
image.draw_circle(x, y, r, color, thickness=1)
```



- 参数解释
  - `x, y`：圆心坐标。
  - `r`：圆的半径。
  - `color`：圆的颜色。
  - `thickness`：圆边框的厚度（默认为1）。
- 示例

```
    img.draw_circle(60, 60, 30, color=(0, 0, 255), thickness=3)  # 绘制蓝色圆
```



### 2.5 draw_cross

`draw_cross`函数可实现在图像上绘制一个十字交叉。

- 语法

```
image.draw_cross(x, y, color, size=5, thickness=1)
```



- 参数解释
  - `x, y`：交叉点坐标。
  - `color`：交叉的颜色。
  - `size`：交叉的大小（默认为5）。
  - `thickness`：交叉线条的厚度（默认为1）。
- 示例

```
    img.draw_cross(40, 40, color=(255, 255, 0), size=10, thickness=2)  # 绘制黄色交叉
```



### 2.6 draw_arrow

`draw_arrow`函数可实现在图像上绘制一条箭头线。

- 语法

```
image.draw_arrow(x0, y0, x1, y1, color, thickness=1)
```



- 参数解释
  - `x0, y0`：起点坐标。
  - `x1, y1`：终点坐标。
  - `color`：箭头的颜色。
  - `thickness`：箭头线条的厚度（默认为1）。
- 示例

```
img.draw_arrow(10, 10, 100, 100, color=(255, 0, 0), thickness=2)  # 绘制红色箭头
```



### 2.7 draw_ellipse

`draw_ellipse`函数可实现在图像上绘制一个椭圆。

- 语法

```
image.draw_ellipse(cx, cy, rx, ry, color, thickness=1)
```



- 参数解释
  - `cx, cy`：椭圆中心的坐标。
  - `rx, ry`：椭圆的半径（x轴和y轴方向）。
  - `color`：椭圆的颜色。
  - `thickness`：椭圆边框的厚度（默认为1）。
- 示例

```
img.draw_ellipse(60, 60, 30, 20, color=(0, 0, 255), thickness=3)  # 绘制蓝色椭圆
```



### 2.8 draw_image

`draw_image`函数可实现在当前图像上绘制另一个图像。

- 语法

```
image.draw_image(img, x, y, alpha=128, scale=1.0)
```



- 参数解释
  - `img`：要绘制的图像对象。
  - `x, y`：绘制位置的左上角坐标。
  - `alpha`：透明度（0-256）。
  - `scale`：缩放比例（默认为1.0）。
- 示例

```
  overlay = image.Image("overlay.bmp")
  img.draw_image(overlay, 10, 10, alpha=128, scale=1.0)  # 在(10, 10)位置绘制 overlay.bmp
```



### 2.9 draw_keypoints

`draw_keypoints`函数可实现在图像上绘制关键点。

- 语法

```
image.draw_keypoints(keypoints, size=10, color, thickness=1)
```



- 参数解释
  - `keypoints`：关键点列表，每个关键点是一个(x, y)元组。
  - `size`：关键点的大小（默认为10）。
  - `color`：关键点的颜色。
  - `thickness`：关键点边框的厚度（默认为1）。
- 示例

```
keypoints = [(30, 30), (50, 50), (70, 70)]
img.draw_keypoints(keypoints, size=10, color=(255, 255, 0), thickness=2)  # 绘制黄色关键点
```



### 2.10 flood_fill

`flood_fill`函数可实现在图像上执行洪水填充算法，从指定的起点开始填充指定的颜色。

- 语法

```
image.flood_fill(x, y, color, threshold, invert=False, clear_background=False)
```



- 参数解释
  - `x, y`：起点坐标。
  - `color`：填充的颜色。
  - `threshold`：填充阈值，表示起点像素与相邻像素颜色的允许差异范围。
  - `invert`：布尔值，如果为 True，则反转填充条件。
  - `clear_background`：布尔值，如果为 True，则清除填充区域以外的背景。
- 示例

```
img.flood_fill(30, 30, color=(255, 0, 0), threshold=30, invert=False, clear_background=False)  # 从(30, 30)开始填充红色
```



### 2.11 draw_string

`draw_string`函数可实现在图像上绘制字符串。

- 语法

```
image.draw_string(x, y, text, color, scale=1)
```



- 参数解释
  - `x, y`：字符串的起始坐标。
  - `text`：要绘制的字符串内容。
  - `color`：字符串的颜色。
  - `scale`：字符串的缩放比例（默认为1）。
- 示例

```
img.draw_string(10, 10, "Hello OpenMV", color=(255, 255, 255), scale=2)  # 绘制白色字符串
```

## 3.代码解析

### 导入模块

```python
import time
import os
import sys

from media.sensor import Sensor, CAM_CHN_ID_0
from media.display import Display
from media.media import MediaManager
```

- **`time`**：提供延时函数（如 `sleep_ms`）。
- **`os`**：用于退出点管理（`exitpoint()`），支持安全中断。
- **`sys`**：用于打印异常信息。
- **`media.sensor`**：摄像头传感器接口，`Sensor` 类用于控制摄像头，`CAM_CHN_ID_0` 表示通道 0。
- **`media.display`**：显示模块接口，`Display` 类用于初始化屏幕、显示图像。
- **`media.media`**：媒体管理器，负责内存池和缓冲区管理。

---

### 参数配置区

```python
# -------------------------------
# 参数配置区
# -------------------------------

# 显示模式选择：'VIRT' 虚拟显示器，'LCD' MIPI 显示屏，'HDMI' HDMI 转接板
DISPLAY_MODE = "LCD"

# 根据显示模式设置显示器宽高
DISPLAY_CONFIG = {
    "VIRT": {"width": 1920, "height": 1080, "driver": Display.VIRT},
    "LCD":  {"width": 480,  "height": 360,  "driver": Display.AML020T},
}

# 获取当前显示配置
if DISPLAY_MODE not in DISPLAY_CONFIG:
    raise ValueError("不支持的 DISPLAY_MODE，请使用 'VIRT'、'LCD'")

config = DISPLAY_CONFIG[DISPLAY_MODE]
DISPLAY_WIDTH = config["width"]
DISPLAY_HEIGHT = config["height"]
DISPLAY_DRIVER = config["driver"]
```

- **显示模式选择**：通过修改变量 `DISPLAY_MODE` 可切换输出目标（虚拟屏 / LCD / HDMI）。
- **显示配置字典**：预定义了不同显示模式的分辨率和驱动类型。
  - `VIRT`：虚拟显示器，分辨率 1920x1080，用于 IDE 预览。
  - `LCD`：MIPI 屏幕，分辨率 480x360，驱动 `AML020T`。
- **参数提取**：根据所选模式自动获取宽度、高度和驱动常量。

---

### 主程序入口

```python
sensor = None
```

- 声明 `sensor` 变量并初始化为 `None`，用于在 `finally` 中安全释放资源。

#### 异常保护与初始化

```python
try:
    print("[INFO] 启动摄像头测试程序")

    # 初始化摄像头
    sensor = Sensor()
    sensor.reset()
```

- 使用 `try` 块捕获可能发生的异常（如摄像头打开失败、内存不足等），确保资源能正确释放。
- `Sensor()`：创建摄像头对象。
- `reset()`：复位摄像头，恢复默认参数。

#### 设置摄像头属性

```python
    # 设置图像输出格式与分辨率
    sensor.set_framesize(width=DISPLAY_WIDTH, height=DISPLAY_HEIGHT, chn=CAM_CHN_ID_0)
    sensor.set_pixformat(Sensor.RGB888, chn=CAM_CHN_ID_0)
```

- `set_framesize`：设置输出图像尺寸，与显示分辨率保持一致。
- `set_pixformat`：设置像素格式为 RGB888（24位真彩色）。
- `chn=CAM_CHN_ID_0`：指定配置应用于通道 0（通常只有一路摄像头）。

#### 初始化显示器

```python
    # 初始化显示器
    Display.init(
        DISPLAY_DRIVER,
        width=DISPLAY_WIDTH,
        height=DISPLAY_HEIGHT,
        fps=60,
        to_ide=True  # 即使是物理屏幕，仍可在IDE中同步预览
    )
```

- `Display.init`：根据显示模式初始化屏幕。
  - `DISPLAY_DRIVER`：具体驱动（如 `Display.AML020T`）。
  - `width` / `height`：显示分辨率。
  - `fps=60`：设置显示刷新率（虚拟屏有效）。
  - `to_ide=True`：将图像同时发送到 IDE 预览窗口，方便调试。

#### 启动媒体管理器

```python
    # 启动媒体缓冲管理器
    MediaManager.init()
```

- 初始化媒体底层资源（如 DMA 缓冲区、显示内存池），必须在显示和摄像头采集前调用。

#### 启动摄像头

```python
    # 启动摄像头采集
    sensor.run()
    print("[INFO] 摄像头已启动，分辨率: {}x{}".format(DISPLAY_WIDTH, DISPLAY_HEIGHT))
```

- `sensor.run()`：开始采集图像数据，之后通过 `snapshot()` 获取帧。

---

### 主循环：采集图像并绘制图形

```python
    # 主循环：采集图像并绘制图形
    while True:
        os.exitpoint()  # 监听 IDE 停止命令

        # 捕获一帧图像
        img = sensor.snapshot(chn=CAM_CHN_ID_0)
```

- **无限循环**：持续采集和显示。
- `os.exitpoint()`：检查退出标志（如 IDE 中点击停止按钮），支持安全退出。
- `sensor.snapshot()`：从摄像头通道 0 捕获一帧，返回 `image` 对象。

#### 在图像上绘制图形

```python
        # 图像绘制内容
        img.draw_rectangle(30, 30, 100, 50, color=(0, 255, 0), thickness=5)                 # 绿色矩形
        img.draw_circle(200, 250, 50, color=(255, 0, 0), thickness=3)                      # 红色圆形
        img.draw_line(300, 250, 400, 200, color=(0, 0, 255), thickness=2)                  # 蓝色线
        img.draw_string_advanced(50, 100, 32, "你好, DshanPI-AIMaix!",
                                 color=(255, 255, 0), scale=2)                              # 黄色字符串
        img.draw_cross(350, 300, color=(255, 255, 255), size=20, thickness=2)              # 白色十字
```

- 在采集到的图像上叠加各种图形：
  - **矩形**：左上角 (30,30)，宽 100，高 50，绿色，线宽 5。
  - **圆形**：圆心 (200,250)，半径 50，红色，线宽 3。
  - **线段**：起点 (300,250) 到终点 (400,200)，蓝色，线宽 2。
  - **字符串**：位置 (50,100)，字体大小 32，黄色，缩放 2 倍，支持中文。
  - **十字线**：中心 (350,300)，白色，尺寸 20，线宽 2。

#### 显示图像

```python
        # 显示图像
        Display.show_image(img)
```

- 将绘制后的图像输出到屏幕（根据 `DISPLAY_MODE` 设置）。

---

### 异常捕获与资源释放

```python
except KeyboardInterrupt:
    print("[INFO] 用户中断退出")
except Exception as e:
    print("[ERROR] 运行异常：", e)
finally:
    print("[INFO] 正在清理资源...")
    if isinstance(sensor, Sensor):
        sensor.stop()
    Display.deinit()
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)
    MediaManager.deinit()
    print("[INFO] 清理完成，程序退出")
```

- **`KeyboardInterrupt`**：捕获 Ctrl+C 中断，打印友好提示。
- **`Exception`**：捕获其他所有异常，打印错误信息。
- **`finally`**：无论是否异常，都会执行资源释放：
  - `sensor.stop()`：停止摄像头采集。
  - `Display.deinit()`：关闭显示设备，释放引脚和内存。
  - `os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)`：重新允许系统进入睡眠模式。
  - `time.sleep_ms(100)`：确保释放操作完成。
  - `MediaManager.deinit()`：释放媒体管理器缓冲区。

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
import time
import os
import sys

from media.sensor import Sensor, CAM_CHN_ID_0
from media.display import Display
from media.media import MediaManager

# -------------------------------
# 参数配置区
# -------------------------------

# 显示模式选择：'VIRT' 虚拟显示器，'LCD' MIPI 显示屏，'HDMI' HDMI 转接板
DISPLAY_MODE = "LCD"

# 根据显示模式设置显示器宽高
DISPLAY_CONFIG = {
    "VIRT": {"width": 1920, "height": 1080, "driver": Display.VIRT},
    "LCD":  {"width": 480,  "height": 360,  "driver": Display.AML020T},
}

# 获取当前显示配置
if DISPLAY_MODE not in DISPLAY_CONFIG:
    raise ValueError("不支持的 DISPLAY_MODE，请使用 'VIRT'、'LCD'")

config = DISPLAY_CONFIG[DISPLAY_MODE]
DISPLAY_WIDTH = config["width"]
DISPLAY_HEIGHT = config["height"]
DISPLAY_DRIVER = config["driver"]

# -------------------------------
# 主程序
# -------------------------------

sensor = None

try:
    print("[INFO] 启动摄像头测试程序")

    # 初始化摄像头
    sensor = Sensor()
    sensor.reset()

    # 设置图像输出格式与分辨率
    sensor.set_framesize(width=DISPLAY_WIDTH, height=DISPLAY_HEIGHT, chn=CAM_CHN_ID_0)
    sensor.set_pixformat(Sensor.RGB888, chn=CAM_CHN_ID_0)

    # 初始化显示器
    Display.init(
        DISPLAY_DRIVER,
        width=DISPLAY_WIDTH,
        height=DISPLAY_HEIGHT,
        fps=60,
        to_ide=True  # 即使是物理屏幕，仍可在IDE中同步预览
    )

    # 启动媒体缓冲管理器
    MediaManager.init()

    # 启动摄像头采集
    sensor.run()
    print("[INFO] 摄像头已启动，分辨率: {}x{}".format(DISPLAY_WIDTH, DISPLAY_HEIGHT))

    # 主循环：采集图像并绘制图形
    while True:
        os.exitpoint()  # 监听 IDE 停止命令

        # 捕获一帧图像
        img = sensor.snapshot(chn=CAM_CHN_ID_0)

        # 图像绘制内容
        img.draw_rectangle(30, 30, 100, 50, color=(0, 255, 0), thickness=5)                 # 绿色矩形
        img.draw_circle(200, 250, 50, color=(255, 0, 0), thickness=3)                      # 红色圆形
        img.draw_line(300, 250, 400, 200, color=(0, 0, 255), thickness=2)                  # 蓝色线
        img.draw_string_advanced(50, 100, 32, "你好, DshanPI-AIMaix!",
                                 color=(255, 255, 0), scale=2)                              # 黄色字符串
        img.draw_cross(350, 300, color=(255, 255, 255), size=20, thickness=2)              # 白色十字

        # 显示图像
        Display.show_image(img)

except KeyboardInterrupt:
    print("[INFO] 用户中断退出")
except Exception as e:
    print("[ERROR] 运行异常：", e)
finally:
    print("[INFO] 正在清理资源...")
    if isinstance(sensor, Sensor):
        sensor.stop()
    Display.deinit()
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)
    MediaManager.deinit()
    print("[INFO] 清理完成，程序退出")
```

## 5.实验结果

​	点击运行代码后可以在显示屏看到，绘制的形状和文字等，如下图所示。

![image-20260605105830391](images/image-20260605105830391.png)
