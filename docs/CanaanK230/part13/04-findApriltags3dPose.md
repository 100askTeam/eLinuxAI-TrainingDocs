---
sidebar_position: 4
---
# AprilTag姿态估计

## 1.实验目的

识别AprilTag并输出姿态信息（Tx、Ty、Tz、Rx、Ry、Rz），即位移和旋转角度。



## 2.示例代码

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

# 注意！与 find_qrcodes 不同，find_apriltags 方法在检测时不需要对图像进行畸变校正。

# 不同的 Tag 家族有何区别？例如，TAG16H5 是一个 4x4 的正方形标签，
# 所以它在更远的距离上也可以被检测到。而 TAG36H11 是一个 6x6 的标签，
# 更难识别但更可靠。较低的 H 值（如 H5 相较于 H11）意味着误识别率更高。
# 因此，除非你有特别需求，否则默认使用 TAG36H11 即可。

# AprilTags 库在检测到标签后可以输出姿态信息，包括 x/y/z 的平移与旋转。
# 平移单位是无量纲的（需根据实际情况进行换算），旋转单位是弧度，可转为角度。
# 本程序会将其转换为角度进行输出。

# f_x 表示相机的水平焦距，计算公式为：镜头焦距 ÷ 传感器水平尺寸 × 图像宽度（像素）
# f_y 表示相机的垂直焦距，计算公式为：镜头焦距 ÷ 传感器垂直尺寸 × 图像高度（像素）
# 以下参数适用于 OV7725 相机搭配 2.8mm 镜头。

# c_x 和 c_y 是图像中心点的像素坐标，通常设为图像宽高的一半。

DETECT_WIDTH = 320    # 图像宽度
DETECT_HEIGHT = 240   # 图像高度

f_x = (2.8 / 3.984) * DETECT_WIDTH    # 水平方向焦距
f_y = (2.8 / 2.952) * DETECT_HEIGHT   # 垂直方向焦距
c_x = DETECT_WIDTH * 0.5              # 图像中心 X 坐标
c_y = DETECT_HEIGHT * 0.5             # 图像中心 Y 坐标

def degrees(radians):
    return (180 * radians) / math.pi  # 弧度转角度

sensor = None

try:
    # 构造 Sensor 对象
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    sensor.reset()  # 复位摄像头

    # 可选：镜像和翻转设置
    # sensor.set_hmirror(False)  # 设置水平镜像
    # sensor.set_vflip(False)    # 设置垂直翻转

    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)  # 设置输出图像尺寸
    sensor.set_pixformat(Sensor.RGB565)  # 设置图像格式为 RGB565

    # 初始化 LCD 显示器（默认使用 ST7701）
    Display.init(Display.ST7701, to_ide = True)

    # 如果使用 HDMI，请取消注释以下任一配置（并注释 LCD 部分）
    # HDMI 输出（VGA 模式）
    # Display.init(Display.LT9611, width = 640, height = 480, to_ide = True)

    # HDMI 输出（1080P 模式）
    # Display.init(Display.LT9611, width = 1920, height = 1080, to_ide = True)

    # 初始化媒体管理器
    MediaManager.init()

    # 启动摄像头采集
    sensor.run()

    fps = time.clock()  # 初始化帧率计数器

    while True:
        fps.tick()  # 启动帧率计时

        os.exitpoint()  # 检查退出点（CanMV 特有，用于调试或脚本管理）
        img = sensor.snapshot()  # 拍摄当前图像

        # 检测 AprilTag，默认使用 TAG36H11 家族
        for tag in img.find_apriltags(fx=f_x, fy=f_y, cx=c_x, cy=c_y):
            # 绘制检测框
            img.draw_rectangle([v for v in tag.rect()], color=(255, 0, 0))
            # 在中心位置绘制十字
            img.draw_cross(tag.cx(), tag.cy(), color=(0, 255, 0))

            print_args = (
                tag.x_translation(), tag.y_translation(), tag.z_translation(),
                degrees(tag.x_rotation()), degrees(tag.y_rotation()), degrees(tag.z_rotation())
            )

            # 输出标签姿态信息
            print("Tx: %f, Ty %f, Tz %f, Rx %f, Ry %f, Rz %f" % print_args)

        # 图像显示到屏幕中央
        Display.show_image(
            img,
            x=round((800 - sensor.width()) / 2),
            y=round((480 - sensor.height()) / 2)
        )

        gc.collect()  # 执行垃圾回收（释放内存）
        print(fps.fps())  # 输出当前帧率

except KeyboardInterrupt as e:
    print(f"用户主动中断程序")
except BaseException as e:
    print(f"发生异常: '{e}'")
finally:
    # 停止摄像头
    if isinstance(sensor, Sensor):
        sensor.stop()

    # 释放显示器
    Display.deinit()

    # 设置退出点并休眠一段时间（用于系统切换）
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)

    # 释放媒体资源
    MediaManager.deinit()

```

## 3.实验结果

点击运行代码后，会在显示屏上识别AprilTag标签并打印标签的姿态信息。