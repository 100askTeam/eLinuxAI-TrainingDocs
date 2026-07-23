---
sidebar_position: 1
boards: [CanMV_V3]
---
# cv_lite 模块

## 概述

cv_lite 模块是针对某些特定任务、在底层基于 OpenCV 实现的轻量图像处理模块，提供了一些常见任务的加速版本方法，作为 openmv 的 `image` 模块中方法的补充。需要注意的是，它并不是完整的 OpenCV 库，仅提供部分任务的加速版本。

针对 cv_lite 模块中常见的数据格式，这里给出说明：

- **输入数据格式**：`ulab.numpy.ndarray` 类型，一般通过 `image.to_numpy_ref()` 获取。
- **ndarray 转回 image 实例**：一般使用 `img = image.Image(image_width, image_height, image.GRAYSCALE, alloc=image.ALLOC_REF, data=np_data)` 实现，构造时需注意 image 类型与数据量是否匹配。
- **零拷贝**：上面两条操作没有重新分配内存，使用的是同一块物理内存，因此耗时不长。
- **与 openmv 混合使用**：rgb888 格式数据若要和 openmv 的 `image` 模块混合使用，可以使用 `to_rgb565()` 将其转换后再使用。

## cv_lite 介绍

在前面的图像处理案例中，处理流程都是基于 openmv 移植实现的，大家可以发现部分案例的速度并不是很快。

为此，CanMV K230 官方针对某些特定场景提出了 cv_lite 的概念：针对某些特定任务在底层基于 OpenCV 实现轻量图像处理模块，提供常见任务的加速版本方法，作为 openmv 的 `image` 模块中方法的补充。

## 原理

cv_lite 的核心思路是：**用底层 OpenCV 的 C/C++ 实现替换部分 MicroPython 层的处理逻辑，并通过零拷贝的内存共享在 openmv 的 image 对象与 ulab.numpy 数组之间高效传递数据**，从而在保留 openmv 易用接口的同时获得接近原生 OpenCV 的处理速度。可从以下几个层面理解。

### 算法层：基于 OpenCV 的高效实现

openmv 的 `image` 模块默认以 RGB565 格式存储图像，其 `find_blobs`、`find_circles`、`find_rectangles`、`find_edges` 等方法在 MicroPython 环境下调用时会引入额外开销。cv_lite 则在底层直接调用 OpenCV 中经过长期优化（向量化、SIMD 等）的算法实现，例如：

- `find_blobs`：基于连通域分析（Connected Components）；
- `find_circles`：基于霍夫圆变换（Hough Circles）；
- `find_rectangles`：基于轮廓提取与多边形拟合；
- `find_edges`：基于 Canny / Sobel 边缘检测；
- 形态学操作、滤波、白平衡、直方图统计等同样复用 OpenCV 对应函数。

因此在同一任务上，cv_lite 通常能获得更高的帧率（详见下文“速度对比”）。

### 数据层：RGB888 + ulab.numpy 零拷贝

cv_lite 的接口以 `ulab.numpy.ndarray`（RGB888）作为输入输出，而非 openmv 原生的 RGB565 `image` 对象，两者之间通过零拷贝方式共享同一块物理内存：

- **image → ndarray**：`image.to_numpy_ref()` 返回一个引用 sensor 缓冲区的 ndarray，不复制像素数据；
- **ndarray → image**：`image.Image(w, h, image.GRAYSCALE, alloc=image.ALLOC_REF, data=np_data)` 以 `ALLOC_REF` 方式直接引用 ndarray 内存构造 image 对象，同样不复制。

这样既避免了 RGB565 ↔ RGB888 的格式转换开销，也避免了大数据的内存拷贝，使数据在“采集 → cv_lite 处理 → 显示/绘制”整条链路上始终共享同一块内存，整体耗时很低。需要特别注意的是，构造 image 时图像类型与数据量必须匹配，否则会出错。

### 协作层：与 openmv 分工配合

cv_lite 不是完整的 OpenCV 库，只提供部分常用任务的加速版本，作为 openmv `image` 模块的补充。实际使用中通常按如下方式配合：

- 图像采集与显示仍使用 openmv 的 `sensor` / `Display` 接口；
- 需要加速的处理交给 cv_lite：输入通过 `to_numpy_ref()` 取得，处理结果再以 `ALLOC_REF` 包回 image；
- 若需要把 cv_lite 处理后的 RGB888 结果交给只支持 RGB565 的 openmv 方法，可调用 `to_rgb565()` 转换。

通过“openmv 负责采集显示、cv_lite 负责加速处理”的分工，既保留了 openmv 生态的便利，又在关键任务上获得了 OpenCV 级别的性能。

## 速度对比

以 openmv 处理 RGB565 彩图、cv_lite 处理 RGB888 彩图进行对比，得到的帧率对比如下表所示。下述帧率仅在处理固定场景时测得，实际帧率会受场景复杂程度（如圆形数量等）影响，请以具体场景的实测为准。

| 任务 | 输入分辨率 | cv_lite 处理帧率（fps） | openmv 处理帧率（fps） |
| --- | --- | --- | --- |
| 灰度图 find_blobs | 480x640 | 90 | 57 |
| 彩色图 find_blobs | 480x640 | 80 | 44 |
| 灰度图 find_circles | 480x640 | 24 | 1.2 |
| 彩色图 find_circles | 480x640 | 24 | 1.2 |
| 灰度图 find_rectangles | 480x640 | 40 | 8 |
| 彩色图 find_rectangles | 480x640 | 38 | 4.6 |
| 灰度图 find_edges | 480x640 | 57 | 11 |
| 彩色图 find_edges | 480x640 | 53 | 仅支持灰度图 |
| 灰度图二值化 | 480x640 | 90 | 90 |
| 彩色图二值化 | 480x640 | 90 | 40 |
| 彩色图均值滤波 | 480x640 | 26 | 19 |
| 彩色图高斯滤波 | 480x640 | 12 | 4 |

除上述案例外，cv_lite 还增加了使用软件处理实现对 RGB888 图像的形态学操作、白平衡、曝光调整和 RGB888 图像直方图统计的接口：

| 任务 | 输入分辨率 | cv_lite 处理帧率（fps） |
| --- | --- | --- |
| 腐蚀 | 480x640 | 90 |
| 膨胀 | 480x640 | 32 |
| 开运算 | 480x640 | 31 |
| 闭运算 | 480x640 | 32 |
| 形态学梯度 | 480x640 | 12 |
| 顶帽变换 | 480x640 | 12 |
| 黑帽变换 | 480x640 | 12 |
| 灰度世界白平衡 | 480x640 | 47 |
| 白色 patch 白平衡 | 480x640 | 22 |
| 曝光调整 | 480x640 | 65 |
| RGB888 图像直方图统计 | 480x640 | 77 |

## 本章内容

本章内容将对 cv_lite 的一些常用案例进行讲解，后续小节安排如下：

- 圆形检测 find_circles
- 边缘检测 find_edges
- 矩形检测 find_rectangles
- 色块检测 find_blobs
- 矩形角点检测
- 基于色块的 PnP 测距
- 基于角点的 PnP 测距
