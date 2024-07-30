---
sidebar_position: 32
---
# 3.9 PM 模块API手册

## 前言

### 概述

本文档主要介绍mpp模块下的pm类API。

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

PM模块是功耗管理模块，具体可参考SDK中关于PM框架的描述([K230_PM框架使用指南.md](https://github.com/kendryte/k230_docs/blob/main/zh/01_software/board/mpp/K230_PM框架使用指南.md))。micropython中封装了cpu和kpu两部分。

## 2. API描述

pm类位于mpp模块下，模块内部包含了两个实例化对象cpu, kpu

### 2.1 示例

```
from mpp import pm
# get current cpu freq
pm.cpu.get_freq()
# get cpu support freq list
pm.cpu.list_profiles()
# set cpu freq
pm.cpu.set_profile(1)
```



### 2.2 get_freq

```
pm.pm_domain.get_freq()
```



获取指定域频率

【参数】

无

【返回值】

指定域频率

### 2.3 list_profiles

```
pm.pm_domain.list_profiles()
```



获取指定域支持的频率列表

【参数】

无

【返回值】

指定域支持的频率列表

### 2.4 set_profile

```
pm.pm_domain.set_profile(index)
```



设置指定域的频率序号

【参数】

- index: 频率序号

【返回值】

无