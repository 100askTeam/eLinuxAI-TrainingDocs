---
sidebar_position: 21
---
# 2.8 K230 CanMV FPIOA 模块API手册

## 前言

### 概述

本文档主要介绍machine模块下的FPIOA类API。

### 读者对象

本文档（本指南）主要适用于以下人员：

- 技术支持工程师
- 软件开发工程师

### 缩略词定义

| 简称  | 说明                                                         |
| ----- | ------------------------------------------------------------ |
| GPIO  | General Purpose Input Output （通用输入/输出）               |
| iomux | Pin multiplexing(管脚功能选择)                               |
| FPIOA | Field Programmable Input and Output Array(现场可编程 IO 阵列) |

### 修订记录

| 文档版本号 | 修改说明 | 修改者 | 日期       |
| ---------- | -------- | ------ | ---------- |
| V1.0       | 初版     | 软件部 | 2023-10-08 |

## 1. 概述

IOMUX主要配置物理PAD(管脚)的功能，由于soc功能多管脚(pads)少，多个功能共享同一个I/O管脚(pads),但是一个pads同一时间只能使用其中一个功能,所以需要IOMUX进行功能选择。IOMUX也叫FPIOA，Pin multiplexing，管脚功能选择等。

## 2. API描述

FPIOA类位于machine模块下

### 示例

```
from machine import FPIOA
# 实例化FPIOA
fpioa = FPIOA()
# 打印所有引脚配置
fpioa.help()
# 打印指定引脚详细配置
fpioa.help(0)
# 打印指定功能所有可用的配置引脚
fpioa.help(FPIOA.IIC0_SDA, func=True)
# 设置Pin0为GPIO0
fpioa.set_function(0, FPIOA.GPIO0)
# 设置Pin2为GPIO2, 同时配置其它项
fpioa.set_function(2, FPIOA.GPIO2, ie=1, oe=1, pu=0, pd=0, st=1, sl=0, ds=7)
# 获取指定功能当前所在的引脚
fpioa.get_pin_num(FPIOA.UART0_TXD)
# 获取指定引脚当前功能
fpioa.get_pin_func(0)
```



### 构造函数

```
fpioa = FPIOA()
```



【参数】

无

### freq

```
FPIOA.set_function(pin, func, ie=-1, oe=-1, pu=-1, pd=-1, st=-1, sl=-1, ds=-1)
```



设置引脚的功能

【参数】

- pin: 引脚号，取值:[0,63]
- func: 功能号
- ie: 重新设置输入使能，可选参数
- oe: 重新设置输出使能，可选参数
- pu: 重新设置上拉使能，可选参数
- pd: 重新设置下拉使能，可选参数
- st: 重新设置st使能，可选参数
- sl: 重新设置sl使能，可选参数
- ds: 重新设置驱动能力，可选参数

【返回值】

无

### get_pin_num

```
PWM.get_pin_num(func)
```



获取指定功能当前所在引脚

【参数】

- func: 功能号

【返回值】

返回空或引脚号

### get_pin_func

```
PWM.get_pin_func(pin)
```



获取指定引脚当前的功能

【参数】

- pin: 引脚号

【返回值】

引脚当前的功能号

### help

```
PWM.help([number, func=false])
```



打印引脚配置提示信息

【参数】

- number: 引脚号或功能号，可选参数
- func: 使能功能号查询，可选参数

【返回值】

可能为以下三种：

1. 所有引脚的配置信息(未设置number)
2. 指定引脚的详细配置信息(设置number,未设置func或设置为false)
3. 指定功能所有可配置的引脚号(设置number,设置func为true)
