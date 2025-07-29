---
sidebar_position: 3
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

