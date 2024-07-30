---
sidebar_position: 20
---
# 2.7 I2C 模块API手册

## 前言

### 概述

本文档主要介绍machine模块下的I2C类API。

### 读者对象

本文档（本指南）主要适用于以下人员：

- 技术支持工程师
- 软件开发工程师

### 缩略词定义

| 简称 | 说明               |
| ---- | ------------------ |
| I2C  | 二进制双向通信模块 |

### 修订记录

| 文档版本号 | 修改说明 | 修改者 | 日期       |
| ---------- | -------- | ------ | ---------- |
| V1.0       | 初版     | 软件部 | 2023-09-21 |

## 1. 概述

K230内部包含五个I2C硬件模块，支持标准100kb/s，快速400kb/s模式，高速模式3.4Mb/s。 通道输出IO配置参考IOMUX模块。

## 2. API描述

I2C类位于machine模块下

### 2.1 示例

```
from machine import I2C
# i2c0 init 100KHz clock
i2c = I2C(0, freq=100000)
# Scan the slave on the I2C bus
i2c.scan()
# Reading data from the bus
i2c.readfrom(addr, len, True)
# Read data and place it in buff
i2c.readfrom_into(addr, buf, True)
# Sending data to the slave
i2c.writeto(addr, buf, True)
# Read slave register
i2c.readfrom_mem(addr, memaddr, nbytes, mem_size=8)
# Read slave register and place it in buff
i2c.readfrom_mem_into(addr, memaddr, buf, mem_size=8)
# Write data to slave register
i2c.writeto_mem(addr, memaddr, buf, mem_size=8)
# i2c deinit
i2c.deinit()
```



### 2.2 构造函数

```
i2c = I2C(id, freq=100000)
```



【参数】

- id： I2C ID, [0~4] (I2C.I2C0~I2C.I2C4)
- freq: I2C时钟频率

### 2.3 scan

```
i2c.scan()
```



扫描I2C总线上的从机

【参数】

无

【返回值】

list 对象， 包含了所有扫描到的从机地址

### 2.4 readfrom

```
i2c.readfrom(addr, len, True)
```



从总线读取数据

【参数】

- addr: 从机地址
- len： 数据长度
- stop： 是否产生停止信号，保留，目前只能使用默认值Ture

【返回值】

读取到的数据，bytes 类型

### 2.5 readfrom_into

```
i2c.readfrom_into(addr, buf, True)
```



读取数据并放到制定变量中

【参数】

- addr: 从机地址
- buf： bytearray类型， 定义了长度，读取到的数据存放在此
- stop： 是否产生停止信号，保留，目前只能使用默认值Ture

【返回值】

无

### 2.6 writeto

```
i2c.writeto(addr, buf, True)
```



发送数据到从机

【参数】

- addr: 从机地址
- buf： 需要发送的数据
- stop： 是否产生停止信号，保留，目前只能使用默认值Ture

【返回值】

成功发送的字节数

### 2.7readfrom_mem

```
i2c.readfrom_mem(addr, memaddr, nbytes, mem_size=8)
```



读取从机寄存器

【参数】

- addr: 从机地址
- memaddr： 从机寄存器地址
- nbytes： 需要读取的长度
- mem_size： 寄存器宽度， 默认为8位

【返回值】

返回bytes类型的读取到的数据

### 2.8 readfrom_mem_into

```
i2c.readfrom_mem_into(addr, memaddr, buf, mem_size=8)
```



读取从机寄存器值到指定变量中

【参数】

- addr: 从机地址
- memaddr： 从机寄存器地址
- buf： bytearray类型， 定义了长度，读取到的数据存放在此
- mem_size： 寄存器宽度， 默认为8位

【返回值】

无

### 2.9 writeto_mem

```
i2c.writeto_mem(addr, memaddr, buf, mem_size=8)
```



写数据到从机寄存器

【参数】

- addr: 从机地址
- memaddr： 从机寄存器地址
- buf： 需要写的数据
- mem_size： 寄存器宽度， 默认为8位

【返回值】

无

### 2.10 deinit

```
i2c.deinit()
```



释放i2c资源

【参数】

无

【返回值】

无
