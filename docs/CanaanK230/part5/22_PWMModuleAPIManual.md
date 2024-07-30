---
sidebar_position: 22
---
# 2.9 PWM 模块API手册

## 前言

### 概述

本文档主要介绍machine模块下的PWM类API。

### 读者对象

本文档（本指南）主要适用于以下人员：

- 技术支持工程师
- 软件开发工程师

### 缩略词定义

| 简称 | 说明         |
| ---- | ------------ |
| PWM  | 脉宽调制模块 |

### 修订记录

| 文档版本号 | 修改说明 | 修改者 | 日期       |
| ---------- | -------- | ------ | ---------- |
| V1.0       | 初版     | 软件部 | 2023-09-17 |

## 1. 概述

K230内部包含两个PWM硬件模块，每个模块有3个输出通道，模块输出频率可调，但3通道共用，通道占空比独立可调。因此通道0、1、2共用频率，通道3、4、5共用频率。 通道输出IO配置参考IOMUX模块。

## 2. API描述

PWM类位于machine模块下

### 2.1 示例

```
from machine import PWM
# channel 0 output freq 1kHz duty 50%, enable
pwm0 = PWM(0, 1000, 50, enable = True)
# disable channel 0 output
pwm0.enable(False)
# set channel 0 output freq 2kHz
pwm0.freq(2000)
# set channel 0 output duty 10%
pwm0.duty(10)
# enable channel 0 output
pwm0.enable(True)
# release channel 0
pwm0.deinit()
```



### 2.2 构造函数

```
pwm = PWM(channel, freq, duty=50, enable=False)
```



【参数】

- channel: PWM通道号，取值:[0,5]
- freq: PWM通道输出频率
- duty: PWM通道输出占空比，指高电平占整个周期的百分比，取值:[0,100]，可选参数，默认50
- enable: PWM通道输出立即使能，可选参数，默认False

### 2.3 freq

```
PWM.freq([freq])
```



获取或设置PWM通道输出频率

【参数】

- freq: PWM通道输出频率，可选参数，如果不传参数则返回当前频率

【返回值】

返回空或当前PWM通道输出频率

### 2.4 duty

```
PWM.duty([duty])
```



获取或设置PWM通道输出占空比

【参数】

- duty: PWM通道输出占空比，可选参数，如果不传参数则返回当前占空比

【返回值】

返回空或当前PWM通道输出占空比

### 2.5 enable

```
PWM.enable(enable)
```



使能或禁止PWM通道输出

【参数】

- enable: 使能或禁止PWM通道输出

【返回值】

无

### 2.6 deinit

```
PWM.deinit()
```



释放PWM通道资源

【参数】

无

【返回值】

无
