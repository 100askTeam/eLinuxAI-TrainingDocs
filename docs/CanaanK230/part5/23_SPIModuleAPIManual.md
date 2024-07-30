---
sidebar_position: 23
---
# 2.10 SPI 模块API手册

## 前言

### 概述

本文档主要介绍machine模块下的SPI类API。

### 读者对象

本文档（本指南）主要适用于以下人员：

- 技术支持工程师
- 软件开发工程师

### 缩略词定义

| 简称 | 说明                        |
| ---- | --------------------------- |
| SPI  | Serial Peripheral Interface |

### 修订记录

| 文档版本号 | 修改说明 | 修改者 | 日期       |
| ---------- | -------- | ------ | ---------- |
| V1.0       | 初版     | 软件部 | 2023-10-23 |

## 1. 概述

K230内部包含三个SPI硬件模块，片选的极性可配置；支持时钟速率可配。 通道输出IO配置参考IOMUX模块。

## 2. API描述

SPI类位于machine模块下

### 2.1 示例

```
from machine import SPI
# spi init clock 5MHz, polarity 0, phase 0, data bitwide 8bits
spi = SPI(id, baudrate=5000000, polarity=0, phase=0, bits=8)
# Sending data to the slave
spi.write(buf)
# Sending data while reading data to variables
spi.write_readinto(write_buf, read_buf)
# close spi
spi.deinit()
```



### 2.2 构造函数

```
spi = machine.SPI(id, baudrate=20, polarity=0, phase=0, bits=8)
```



【参数】

- id： SPI ID, [0~2] (spi.SPI0~spi.SPI2)
- baudrate: SPI时钟baudrate，Fsclk_out=Fssi_clk/BAUDR
- polarity: 极性
- phase: 相位
- bits: 数据位宽

### 2.3 read

```
spi.read(nbytes)
```



读取指定的字节数

【参数】

- nbytes： 读取长度

【返回值】

返回bytes对象

### 2.4 readinto

```
spi.readinto(buf)
```



读入指定的缓冲区

【参数】

- buf： bytearray类型的缓冲区

【返回值】

无

### 2.5 write

```
spi.write(buf)
```



发送数据

【参数】

- buf： bytearray 类型， 定义了数据及长度

【返回值】

无

### 2.6 write_readinto

```
spi.write_readinto(write_buf, read_buf)
```



发送数据，同时读取数据到变量

【参数】

- write_buf： bytearray 类型， 定义了需要发送的数据及长度
- read_buf： bytearray 类型， 定义了接收数据存放的位置

【返回值】

无

### 2.7 deinit

```
spi.deinit()
```



注销spi

【参数】

无

【返回值】

无