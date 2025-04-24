---
sidebar_position: 3
---
# AprilTag标签识别

## 1.实验目的

学习摄像头初始化、AprilTag 检测、屏幕绘制等核心流程



## 2.实验原理

**AprilTag** 是一种类似二维码的图像识别标签，常用于机器人定位与导航。相比二维码，AprilTags 更适合用于 **精确定位和姿态估计**，并且支持多个**标签家族**（tag families），不同家族具有不同的编码结构与鲁棒性。



## 3.代码解析

### 配置支持的 AprilTag 家族

```
tag_families = 0
tag_families |= image.TAG16H5
tag_families |= image.TAG25H7
tag_families |= image.TAG25H9
tag_families |= image.TAG36H10
tag_families |= image.TAG36H11  # 默认推荐使用
tag_families |= image.ARTOOLKIT
```

你可以根据需要**注释/取消注释**这些家族，默认启用全部。推荐使用 `TAG36H11`，识别准确率高，误检率低。

### 摄像头与屏幕初始化

```
sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
sensor.reset()
sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
sensor.set_pixformat(Sensor.RGB565)
Display.init(Display.ST7701, to_ide = True)
MediaManager.init()
sensor.run()
```

使用 `ST7701` LCD 屏作为输出（也可以改为 HDMI 或虚拟 IDE 输出）。

### 图像识别与绘图

```
img = sensor.snapshot()

for tag in img.find_apriltags(families=tag_families):
    img.draw_rectangle([v for v in tag.rect()], color=(255, 0, 0))    # 画矩形框
    img.draw_cross(tag.cx(), tag.cy(), color=(0, 255, 0))            # 画中心十字
    print("Tag Family %s, ID %d, rotation %f" % (...))               # 打印识别信息
```

每一帧图像会进行标签识别，并在屏幕上绘制红框、中心点，以及打印标签家族与 ID。

### 显示图像

```
Display.show_image(img, x=round((800-sensor.width())/2), y=round((480-sensor.height())/2))
```

将图像显示在屏幕中央（屏幕为 800×480 时）。

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

import time, math, os, gc, sys

from media.sensor import *
from media.display import *
from media.media import *

# 设置图像检测区域分辨率
DETECT_WIDTH = 320
DETECT_HEIGHT = 240

# 注意：与 find_qrcodes 不同，find_apriltags 方法不需要对图像进行镜头畸变矫正。

# apriltag 支持同时处理最多 6 个标签族（tag family）
# 返回的标签对象中会包含该标签所属的族信息及其在该族中的 ID。

tag_families = 0
tag_families |= image.TAG16H5  # 4x4 方形，检测距离远，但误检率较高
tag_families |= image.TAG25H7  # 可根据需要启用
tag_families |= image.TAG25H9  # 可根据需要启用
tag_families |= image.TAG36H10 # 可根据需要启用
tag_families |= image.TAG36H11 # 默认启用，误检率低
tag_families |= image.ARTOOLKIT # 可根据需要启用

# 标签族的区别说明：
# TAG16H5 是一个 4x4 的方形标签，因此可以在较远距离被识别；
# 而 TAG36H11 是 6x6 的标签，虽然识别距离近，但误检率较低。
# 除非你有特殊需求，否则建议使用 TAG36H11。

# 根据标签返回其族名称的辅助函数
def family_name(tag):
    if(tag.family() == image.TAG16H5):
        return "TAG16H5"
    if(tag.family() == image.TAG25H7):
        return "TAG25H7"
    if(tag.family() == image.TAG25H9):
        return "TAG25H9"
    if(tag.family() == image.TAG36H10):
        return "TAG36H10"
    if(tag.family() == image.TAG36H11):
        return "TAG36H11"
    if(tag.family() == image.ARTOOLKIT):
        return "ARTOOLKIT"

sensor = None

try:
    # 创建并初始化摄像头对象
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    sensor.reset()  # 重置摄像头

    # 如需图像翻转，可取消以下注释：
    # sensor.set_hmirror(False)  # 设置水平镜像
    # sensor.set_vflip(False)    # 设置垂直翻转

    # 设置通道0的输出分辨率和像素格式
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    sensor.set_pixformat(Sensor.RGB565)  # 设置 RGB565 格式输出

    # 初始化显示设备
    # 如使用 HDMI 输出，请根据实际需求取消对应注释：
    # Display.init(Display.LT9611, width = 640, height = 480, to_ide = True)
    # Display.init(Display.LT9611, width = 1920, height = 1080, to_ide = True)

    # 如使用 LCD 输出，默认使用 ST7701 面板：
    Display.init(Display.ST7701, to_ide = True)

    # 如仅在 IDE 显示器中显示，可使用虚拟显示：
    # Display.init(Display.VIRT, width = DETECT_WIDTH, height = DETECT_HEIGHT, fps = 100)

    # 初始化媒体管理器（图像显示缓冲器）
    MediaManager.init()

    # 启动摄像头图像采集
    sensor.run()

    # 创建 FPS 计时器
    fps = time.clock()

    while True:
        fps.tick()  # 开始新一帧计时

        os.exitpoint()  # 检查是否需要退出程序

        img = sensor.snapshot()  # 拍摄一帧图像

        # 在图像中查找所有指定族的 AprilTags
        for tag in img.find_apriltags(families=tag_families):
            img.draw_rectangle([v for v in tag.rect()], color=(255, 0, 0))  # 绘制标签边框
            img.draw_cross(tag.cx(), tag.cy(), color=(0, 255, 0))           # 在中心画十字

            # 打印标签信息：标签族、ID、旋转角度
            print_args = (family_name(tag), tag.id(), (180 * tag.rotation()) / math.pi)
            print("Tag Family %s, Tag ID %d, rotation %f (degrees)" % print_args)

        # 将图像显示在屏幕中央
        Display.show_image(
            img,
            x=round((800 - sensor.width()) / 2),
            y=round((480 - sensor.height()) / 2)
        )

        # 垃圾回收，释放内存
        gc.collect()

        # 打印当前帧率
        print(fps.fps())

except KeyboardInterrupt as e:
    print("用户主动终止程序")
except BaseException as e:
    print(f"发生异常: '{e}'")
finally:
    # 停止摄像头
    if isinstance(sensor, Sensor):
        sensor.stop()
    # 关闭显示设备
    Display.deinit()

    # 设置退出点并延迟一会以确保资源释放
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)

    # 释放媒体资源
    MediaManager.deinit()
```



## 5.实验结果

​	点击运行代码后可以，识别到AprilTag标签。