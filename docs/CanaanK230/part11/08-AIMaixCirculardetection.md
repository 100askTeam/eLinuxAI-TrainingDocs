---
sidebar_position: 3
boards: [AIMaix]
---
# 圆形检测

## 1.实验目的

实现K230对图像中的圆形进行检测。

## 2.实验原理

### 2.1 原理解析

圆形检测通常是通过 **霍夫圆变换（Hough Circle Transform）** 来实现的，它是经典霍夫变换（用于直线检测）的扩展，适用于检测图像中的圆形。

霍夫圆变换的目标是：
 从图像中**找出边缘像素点**，然后**反推出可能的圆心和半径**，将它们投票累加，找到得票最多的那组 (a,b,r)即为检测到的圆。

**步骤如下：**

1. **边缘检测**（如使用 Canny 算子）
    提取出图像中潜在的边缘像素（这些点可能在圆的边缘上）。

2. **投票累加（Hough 累加器）**
    对于每一个边缘点 (x,y)，枚举可能的半径 r，并根据圆方程计算可能的圆心 (a,b)：
   $$
   a = x - r \cdot \cos(\theta), \quad b = y - r \cdot \sin(\theta)
   $$
   所有可能的 (a,b,r) 在三维空间中投票。

3. **寻找局部最大值**
    累加器中投票值最高的点，就是图像中存在圆形的概率最大的地方。





## 3.代码解析

### 导入模块

```python
import time, os, sys

from media.sensor import *    # 摄像头相关接口
from media.display import *   # 显示屏相关接口
from media.media import *     # 多媒体资源管理接口
```

- **`time`**：提供延时和帧率计时（`time.clock()`）。
- **`os`**、**`sys`**：用于系统控制和异常处理。
- **`media.sensor`**：摄像头传感器接口，提供图像采集、格式设置等功能。
- **`media.display`**：显示模块接口，支持 LCD、虚拟显示等输出。
- **`media.media`**：媒体管理器，负责内存池和缓冲区管理。

---

### 配置参数

```python
# === 配置参数 ===
SENSOR_W, SENSOR_H     = 1280, 960          # 摄像头采集分辨率（原始）
FRAME_W, FRAME_H       = 320, 240           # 实际输出帧大小
LCD_W, LCD_H           = 480, 360           # LCD 屏幕分辨率
CIRCLE_THRESHOLD       = 2000               # 圆检测强度阈值，越高圆越少但更准确
CIRCLE_X_MARGIN        = 10                 # 圆心 X 坐标合并容差
CIRCLE_Y_MARGIN        = 10                 # 圆心 Y 坐标合并容差
CIRCLE_R_MARGIN        = 10                 # 半径合并容差
CIRCLE_R_MIN           = 2                  # 最小检测半径
CIRCLE_R_MAX           = 100                # 最大检测半径
CIRCLE_R_STEP          = 2                  # 半径步进
CIRCLE_COLOR           = (255, 0, 0)        # 检测圆形绘制颜色（红色）
```

- **摄像头采集分辨率**：`1280x960`，传感器原始分辨率，用于捕获细节。
- **输出帧大小**：`320x240`，实际从摄像头获取的图像尺寸（可能经过缩放）。
- **LCD 分辨率**：`480x360`，物理屏幕显示区域，用于居中显示。
- **圆检测参数**（`find_circles` 函数参数）：
  - `threshold`：圆强度阈值，值越大，检测到的圆越少但更可靠。
  - `x_margin`、`y_margin`、`r_margin`：合并相似圆时的圆心坐标和半径容差。
  - `r_min`、`r_max`、`r_step`：扫描半径范围和步长。
- **绘制颜色**：检测到的圆用红色（R=255, G=0, B=0）描边。

---

### 初始化摄像头

```python
# === 初始化摄像头 ===
sensor = Sensor(width=SENSOR_W, height=SENSOR_H)   # 创建摄像头对象
sensor.reset()                                     # 初始化摄像头
sensor.set_framesize(width=FRAME_W, height=FRAME_H) # 设置图像帧尺寸
sensor.set_pixformat(Sensor.RGB565)                # 设置图像格式为 RGB565
```

- `Sensor(width, height)`：创建摄像头对象，指定传感器采集分辨率。
- `reset()`：复位摄像头，恢复默认配置。
- `set_framesize()`：设置输出帧的大小为 `320x240`。
- `set_pixformat()`：设置像素格式为 RGB565（16 位色，适合快速显示）。

---

### 初始化显示屏

```python
# === 初始化显示屏 ===
Display.init(Display.AML020T, to_ide=True)          # 初始化 MIPI LCD 和 IDE 显示输出
# Display.init(Display.VIRT, sensor.width(), sensor.height()) # 仅使用 IDE 显示输出（调试用）
```

- `Display.init()`：初始化显示设备。
  - `Display.AML020T`：指定使用 MIPI LCD 屏幕（分辨率 480x360）。
  - `to_ide=True`：同时将图像发送到 IDE 预览窗口，方便调试。
- 注释行提供了虚拟显示器选项（仅 IDE 输出），可用于无物理屏幕时的调试。

---

### 初始化媒体系统

```python
# === 初始化媒体系统 ===
MediaManager.init()                                # 启用媒体管理器
sensor.run()                                       # 开始采集图像
```

- `MediaManager.init()`：初始化媒体底层资源（缓冲区、DMA 等），必须在使用摄像头和显示前调用。
- `sensor.run()`：启动摄像头连续采集，之后可通过 `snapshot()` 获取图像帧。

---

### 主循环：捕获图像并检测圆形

```python
# === 主循环：捕获图像并检测圆形 ===
clock = time.clock()

while True:
    clock.tick()                                   # 开始计时（用于FPS计算）
    img = sensor.snapshot()                        # 拍摄一帧图像
```

- `time.clock()`：创建计时器对象。
- `clock.tick()`：开始一帧的计时，用于计算 FPS。
- `sensor.snapshot()`：从摄像头捕获一帧，返回 `image` 对象。

#### 圆形检测

```python
    # 在图像中检测圆形
    circles = img.find_circles(
        threshold=CIRCLE_THRESHOLD,
        x_margin=CIRCLE_X_MARGIN,
        y_margin=CIRCLE_Y_MARGIN,
        r_margin=CIRCLE_R_MARGIN,
        r_min=CIRCLE_R_MIN,
        r_max=CIRCLE_R_MAX,
        r_step=CIRCLE_R_STEP
    )
```

- `img.find_circles()`：在图像中检测圆形，返回一个列表，每个元素包含圆心坐标 `(x, y)`、半径 `r` 和强度值。
- 参数与配置区定义一致，控制检测的敏感度和精度。

#### 绘制检测结果

```python
    # 遍历检测到的所有圆
    for c in circles:
        img.draw_circle(c.x(), c.y(), c.r(), color=CIRCLE_COLOR, thickness=2)  # 绘制圆
        print(c)  # 输出圆的参数（圆心坐标、半径、强度）
```

- 遍历每个检测到的圆，调用 `draw_circle()` 在图像上绘制红色圆圈（线宽 2）。
- 打印圆的详细信息，便于调试和观察。

#### 居中显示图像

```python
    # 居中显示图像
    Display.show_image(
        img,
        x=round((LCD_W - sensor.width()) / 2),
        y=round((LCD_H - sensor.height()) / 2)
    )
```

- 计算居中偏移：屏幕宽高减去图像宽高，除以 2 取整。
- `Display.show_image()`：将图像显示到 LCD 屏幕上，指定显示位置左上角坐标。

#### 打印帧率

```python
    print(clock.fps())  # 打印每秒帧率
```

- `clock.fps()`：返回上一帧到当前帧的帧率（帧/秒），用于性能监控。

## 4.示例代码

```
import cv2
import numpy as np

# 摄像头配置参数
SENSOR_W, SENSOR_H = 1280, 960  # 摄像头采集分辨率（原始）
FRAME_W, FRAME_H = 320, 240     # 实际输出帧大小

# 打开摄像头1并设置分辨率
cap = cv2.VideoCapture(1)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, SENSOR_W)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, SENSOR_H)

# 检查摄像头是否成功打开
if not cap.isOpened():
    print(f"无法打开摄像头1(分辨率{SENSOR_W}x{SENSOR_H})！请检查设备连接。")
    exit()

print(f"摄像头设置: 采集 {SENSOR_W}x{SENSOR_H} → 处理 {FRAME_W}x{FRAME_H}")


# 缩放比例计算 (用于检测参数的调整)
SCALE_FACTOR = max(SENSOR_W/FRAME_W, SENSOR_H/FRAME_H)

while True:
    # 捕获高分辨率帧
    ret, frame_high_res = cap.read()
    if not ret:
        print("无法获取帧，退出中...")
        break
    
    # 缩放至处理尺寸
    frame = cv2.resize(frame_high_res, (FRAME_W, FRAME_H))
    
    # 转换为灰度图像
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # 高斯模糊降噪
    blurred = cv2.GaussianBlur(gray, (9, 9), 2)
    
    # 自适应参数计算 (根据缩放比例调整)
    min_dist_scaled = max(20, int(50 / SCALE_FACTOR))
    min_radius_scaled = max(5, int(10 / SCALE_FACTOR))
    max_radius_scaled = min(100, int(100 / SCALE_FACTOR))
    
    # 霍夫圆检测
    circles = cv2.HoughCircles(
        blurred, 
        cv2.HOUGH_GRADIENT, 
        dp=1,   # 分辨率因子
        minDist=min_dist_scaled,  # 圆之间的最小距离(缩放调整)
        param1=50,   # Canny边缘检测阈值
        param2=30,   # 圆心检测阈值(越小检测越多)
        minRadius=min_radius_scaled, # 最小半径(缩放调整)
        maxRadius=max_radius_scaled   # 最大半径(缩放调整)
    )
    
    # 绘制检测到的圆
    if circles is not None:
        circles = np.uint16(np.around(circles))
        for circle in circles[0, :]:
            # 将坐标转换回高分辨率坐标系
            x_high_res = int(circle[0] * SCALE_FACTOR)
            y_high_res = int(circle[1] * SCALE_FACTOR)
            radius_high_res = int(circle[2] * SCALE_FACTOR)
            
            # 在高分辨率帧上绘制
            cv2.circle(frame_high_res, 
                      (x_high_res, y_high_res), 
                      radius_high_res, 
                      (0, 255, 0), 3)
            # 绘制圆心
            cv2.circle(frame_high_res, 
                      (x_high_res, y_high_res), 
                      3, 
                      (0, 0, 255), 5)
    
    # 在高分辨率帧上添加分辨率信息
    cv2.putText(frame_high_res, 
               f"Sensor: {SENSOR_W}x{SENSOR_H} | Display: {FRAME_W}x{FRAME_H}",
               (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    
    # 显示高分辨率结果
    cv2.imshow('Real-time Circle Detection', frame_high_res)
    
    # 按'q'键退出
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 释放资源
cap.release()
cv2.destroyAllWindows()
```



## 5.实验结果

运行代码后可以在显示屏上实时显示检测到的圆形。

