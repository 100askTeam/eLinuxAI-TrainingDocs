---
sidebar_position: 26
---
# 2.13 UART 模块API手册

## 前言

### 概述

本文档主要介绍machine模块下的UART类API。

### 读者对象

本文档（本指南）主要适用于以下人员：

- 技术支持工程师
- 软件开发工程师

### 缩略词定义

| 简称 | 说明 |
| ---- | ---- |
|      |      |

### 修订记录

| 文档版本号 | 修改说明 | 修改者 | 日期       |
| ---------- | -------- | ------ | ---------- |
| V1.0       | 初版     | 软件部 | 2023-09-17 |

## 1. 概述

K230内部包含五个UART硬件模块，其中UART0被小核sh占用，UART3被大核sh占用，剩余UART1，UART2，UART4可供用户使用。 UART IO配置参考IOMUX模块。

## 2. API描述

UART类位于machine模块下

### 2.1 示例

```
from machine import UART
# UART1: baudrate 115200, 8bits, parity none, one stopbits
u1 = UART(UART.UART1, baudrate=115200, bits=UART.EIGHTBITS, parity=UART.PARITY_NONE, stop=UART.STOPBITS_ONE)
# UART write
u1.write("UART1 test")
# UART read
r = u1.read()
# UART readline
r = u1.readline()
# UART readinto
b = bytearray(8)
r = u1.readinto(b)
# UART deinit
u1.deinit()
```



### 2.2 构造函数

```
uart = UART(id, baudrate=115200, bits=UART.EIGHTBITS, parity=UART.PARITY_NONE, stop=UART.STOPBITS_ONE)
```



【参数】

- id: UART号，有效值 UART1、UART2、UART4
- baudrate: UART波特率，可选参数，默认115200
- bits: 每个字符的位数，有效值 FIVEBITS、SIXBITS、SEVENBITS、EIGHTBITS，可选参数，默认EIGHTBITS
- parity: 奇偶校验，有效值 PARITY_NONE、PARITY_ODD、PARITY_EVEN，可选参数，默认PARITY_NONE
- stop: 停止位的数目，有效值 STOPBITS_ONE、STOPBITS_TWO，可选参数，默认STOPBITS_ONE

### 2.3 init

```
UART.init(baudrate=115200, bits=UART.EIGHTBITS, parity=UART.PARITY_NONE, stop=UART.STOPBITS_ONE)
```



配置UART

【参数】

参考构造函数

【返回值】

无

### 2.4 read

```
UART.read([nbytes])
```



读取字符。若指定nbytes，则最多读取该数量的字节。否则可读取尽可能多的数据。

【参数】

- nbytes: 最多读取nbytes字节，可选参数

【返回值】

一个包括读入字节的字节对象

### 2.5 readline

```
UART.readline()
```



读取一行，并以一个换行符结束。

【参数】

无

【返回值】

一个包括读入字节的字节对象

### 2.6 readinto

```
UART.readinto(buf[, nbytes])
```



将字节读取入buf。若指定nbytes，则最多读取该数量的字节。否则，最多读取len(buf)数量的字节。

【参数】

- buf: 一个buffer对象
- nbytes: 最多读取nbytes字节，可选参数

【返回值】

读取并存入buf的字节数

### 2.7 write

```
UART.write(buf)
```



将字节缓冲区写入UART。

【参数】

- buf: 一个buffer对象

【返回值】

写入的字节数

### 2.8 deinit

```
UART.deinit()
```



释放UART资源

【参数】

无

【返回值】

无