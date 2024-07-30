---
sidebar_position: 24
---
# 2.11 Timer 模块API手册

## 前言

### 概述

本文档主要介绍machine模块下的Timer类API。

### 读者对象

本文档（本指南）主要适用于以下人员：

- 技术支持工程师
- 软件开发工程师

### 缩略词定义

| 简称  | 说明   |
| ----- | ------ |
| Timer | 定时器 |

### 修订记录

| 文档版本号 | 修改说明 | 修改者 | 日期       |
| ---------- | -------- | ------ | ---------- |
| V1.0       | 初版     | 软件部 | 2023-09-22 |

## 1. 概述

K230内部包含6个Timer硬件模块，最小定时周期为1us。

## 2. API描述

Timer类位于machine模块下

### 2.1 示例

```
from machine import Timer
# 实例化一个软定时器
tim = Timer(-1)
tim.init(period=100, mode=Timer.ONE_SHOT, callback=lambda t:print(1))
tim.init(period=1000, mode=Timer.PERIODIC, callback=lambda t:print(2))
tim.deinit()
```



### 2.2 构造函数

```
timer = Timer(index, mode=Timer.PERIODIC, freq=-1, period=-1, callback=None, arg=None)
```



【参数】

- index: Timer号，取值:[-1,5]，-1代表软件定时器
- mode: 运行模式，单次或周期，可选参数
- freq: Timer运行频率，支持浮点，单位Hz，可选参数，优先级高于`period`
- period: Timer运行周期，单位ms，可选参数
- callback: 超时回调函数，必须设置，要带一个参数
- arg: 超时回调函数参数，可选参数

**注意：** [0-5]硬件Timer暂不可用

### 2.3 init

```
Timer.init(mode=Timer.PERIODIC, freq=-1, period=-1, callback=None, arg=None)
```



初始化定时器参数

【参数】

- mode: 运行模式，单次或周期，可选参数
- freq: Timer运行频率，支持浮点，单位Hz，可选参数，优先级高于`period`
- period: Timer运行周期，单位ms，可选参数
- callback: 超时回调函数，必须设置，要带一个参数
- arg: 超时回调函数参数，可选参数

【返回值】

无

### 2.4 deinit

```
Timer.deinit()
```



释放Timer资源

【参数】

无

【返回值】

无